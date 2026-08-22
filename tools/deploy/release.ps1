#Requires -Version 5.1
<#
.SYNOPSIS
  Docker で本番ビルドし、keiba-blog/dist の中身を Xserver へ転送する。
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

$envFile = Join-Path $RepoRoot ".env.deploy"
if (-not (Test-Path -LiteralPath $envFile)) {
    throw ".env.deploy がありません。tools/deploy/.env.deploy.example をリポジトリルートへコピーして記入してください。"
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

$distDir = Join-Path $RepoRoot "keiba-blog\dist"
$sshIdentityArgs = @()
if (-not [string]::IsNullOrWhiteSpace($sshKey)) {
    if (-not (Test-Path -LiteralPath $sshKey)) {
        throw "XSERVER_SSH_KEY のファイルがありません: $sshKey"
    }
    $sshIdentityArgs = @("-i", $sshKey)
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

$scpArgs = @("-P", $port) + $sshIdentityArgs + @(
    "-o", "StrictHostKeyChecking=accept-new",
    "-r",
    (Join-Path $distDir "."),
    "${userName}@${hostName}:${remoteDir}/"
)

Write-Host ("scp " + ($scpArgs -join " "))
if ($DryRun) {
    Write-Host "DryRun のため転送しません。"
    exit 0
}

& scp @scpArgs
if ($LASTEXITCODE -ne 0) {
    throw "scp による転送に失敗しました。"
}

Write-Host "デプロイ完了: ${userName}@${hostName}:${remoteDir}/"
