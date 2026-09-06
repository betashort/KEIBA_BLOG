#Requires -Version 5.1
<#
.SYNOPSIS
  Docker で本番ビルドし、keiba-blog/dist で Xserver の公開ディレクトリを置き換える。
.PARAMETER SkipBuild
  ビルドせず、既存の dist/ だけを転送する。
.PARAMETER DryRun
  接続情報と実行予定のコマンドを表示し、転送しない。
#>
param(
    [switch] $SkipBuild,
    [switch] $DryRun
)

$ErrorActionPreference = "Stop"

$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
Set-Location $RepoRoot

function Import-DotEnv {
    param([string] $Path)
    Get-Content -LiteralPath $Path -Encoding UTF8 | ForEach-Object {
        $line = $_.Trim()
        if ($line -eq "" -or $line.StartsWith("#")) {
            return
        }
        $idx = $line.IndexOf("=")
        if ($idx -lt 1) {
            return
        }
        $key = $line.Substring(0, $idx).Trim()
        $val = $line.Substring($idx + 1).Trim()
        if (
            $val.Length -ge 2 -and (
                ($val.StartsWith('"') -and $val.EndsWith('"')) -or
                ($val.StartsWith("'") -and $val.EndsWith("'"))
            )
        ) {
            $val = $val.Substring(1, $val.Length - 2)
        }
        Set-Item -Path "Env:$key" -Value $val
    }
}

function Require-Env {
    param([string] $Name)
    $value = [Environment]::GetEnvironmentVariable($Name)
    if ([string]::IsNullOrWhiteSpace($value)) {
        throw "$Name が .env.deploy にありません。"
    }
    return $value
}

$envFile = Join-Path $PSScriptRoot ".env.deploy"
if (-not (Test-Path -LiteralPath $envFile)) {
    throw ".env.deploy がありません。tools/deploy/.env.deploy.example を同じディレクトリへコピーして記入してください。"
}
Import-DotEnv $envFile

$hostName = Require-Env "XSERVER_HOST"
$userName = Require-Env "XSERVER_USER"
$remoteDir = (Require-Env "XSERVER_REMOTE_DIR").TrimEnd("/", "\")
$port = [Environment]::GetEnvironmentVariable("XSERVER_PORT")
if ([string]::IsNullOrWhiteSpace($port)) {
    $port = "10022"
}
$sshKey = [Environment]::GetEnvironmentVariable("XSERVER_SSH_KEY")

if ($remoteDir -match "['`"\\]") {
    throw "XSERVER_REMOTE_DIR に引用符やバックスラッシュは使えません。"
}

$distDir = Join-Path $RepoRoot "keiba-blog\dist"
$nextDir = "${remoteDir}.next"
$prevDir = "${remoteDir}.prev"
$sshIdentityArgs = @()
if (-not [string]::IsNullOrWhiteSpace($sshKey)) {
    if (-not (Test-Path -LiteralPath $sshKey)) {
        throw "XSERVER_SSH_KEY のファイルがありません: $sshKey"
    }
    $sshIdentityArgs = @("-i", $sshKey)
}

function Invoke-Remote {
    param([string] $Command)
    $sshArgs = @("-p", $port) + $sshIdentityArgs + @(
        "-o", "StrictHostKeyChecking=accept-new",
        "${userName}@${hostName}",
        $Command
    )
    Write-Host ("ssh " + ($sshArgs -join " "))
    if ($DryRun) {
        return
    }
    & ssh @sshArgs
    if ($LASTEXITCODE -ne 0) {
        throw "ssh に失敗しました。"
    }
}

function Copy-DistWithoutGitkeep {
    param(
        [Parameter(Mandatory = $true)][string] $Source,
        [Parameter(Mandatory = $true)][string] $Destination
    )
    $sourceRoot = (Resolve-Path -LiteralPath $Source).Path.TrimEnd("\", "/")
    Get-ChildItem -LiteralPath $sourceRoot -Recurse -Force -File | Where-Object {
        $_.Name -ne ".gitkeep"
    } | ForEach-Object {
        $relative = $_.FullName.Substring($sourceRoot.Length).TrimStart("\", "/")
        $destPath = Join-Path $Destination $relative
        $destParent = Split-Path -Parent $destPath
        if (-not (Test-Path -LiteralPath $destParent)) {
            New-Item -ItemType Directory -Path $destParent | Out-Null
        }
        Copy-Item -LiteralPath $_.FullName -Destination $destPath
    }
}

if (-not $SkipBuild) {
    Write-Host "docker compose up -d"
    if (-not $DryRun) {
        docker compose up -d
        if ($LASTEXITCODE -ne 0) {
            throw "docker compose up -d に失敗しました。"
        }
    }

    $buildCmd = 'cd keiba-blog && npm run build'
    Write-Host "docker compose exec -T node sh -c `"$buildCmd`""
    if (-not $DryRun) {
        docker compose exec -T node sh -c $buildCmd
        if ($LASTEXITCODE -ne 0) {
            throw "npm run build に失敗しました。"
        }
    }
}
else {
    Write-Host "ビルドをスキップします (-SkipBuild)"
}

if (-not $DryRun) {
    $indexHtml = Join-Path $distDir "index.html"
    if (-not (Test-Path -LiteralPath $indexHtml)) {
        throw "keiba-blog/dist/index.html がありません。先にビルドしてください。"
    }
}

$prepRemote = "rm -rf -- '$nextDir' && mkdir -p -- '$nextDir' && chmod 755 -- '$nextDir'"
$chmodRemote = "find '$nextDir' -type d -exec chmod 755 {} \; ; find '$nextDir' -type f -exec chmod 644 {} \;"
$swapRemote = "rm -rf -- '$prevDir'; if [ -e '$remoteDir' ]; then mv -- '$remoteDir' '$prevDir'; fi; if mv -- '$nextDir' '$remoteDir'; then rm -rf -- '$prevDir'; else if [ -e '$prevDir' ]; then mv -- '$prevDir' '$remoteDir'; fi; exit 1; fi"

$scpSourceDir = $distDir
$stageDir = $null
Write-Host ".gitkeep は転送しません"

try {
    if (-not $DryRun) {
        $stageDir = Join-Path ([System.IO.Path]::GetTempPath()) ("keiba-blog-dist-" + [guid]::NewGuid().ToString("N"))
        New-Item -ItemType Directory -Path $stageDir | Out-Null
        Copy-DistWithoutGitkeep -Source $distDir -Destination $stageDir
        $scpSourceDir = $stageDir
    }

    $scpArgs = @("-P", $port) + $sshIdentityArgs + @(
        "-o", "StrictHostKeyChecking=accept-new",
        "-r",
        (Join-Path $scpSourceDir "."),
        "${userName}@${hostName}:${nextDir}/"
    )

    Invoke-Remote $prepRemote

    Write-Host ("scp " + ($scpArgs -join " "))
    if (-not $DryRun) {
        & scp @scpArgs
        if ($LASTEXITCODE -ne 0) {
            throw "scp による転送に失敗しました。"
        }
    }

    Invoke-Remote $chmodRemote
    Invoke-Remote $swapRemote
}
finally {
    if ($stageDir -and (Test-Path -LiteralPath $stageDir)) {
        Remove-Item -LiteralPath $stageDir -Recurse -Force
    }
}

if ($DryRun) {
    Write-Host "DryRun のため転送しません。"
    exit 0
}

Write-Host "デプロイ完了: ${userName}@${hostName}:${remoteDir}/"
