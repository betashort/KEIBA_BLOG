import type { Club } from "../data/hitokuchiHorses";

interface ClubMarkProps {
  club: Club;
}

/** 所属クラブマーク。画像は未用意のため文字プレースホルダを表示する */
export default function ClubMark({ club }: ClubMarkProps) {
  return (
    <span
      className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold text-white"
      style={{ backgroundColor: club.color }}
      title={club.name}
      aria-label={club.name}
    >
      {club.code}
    </span>
  );
}
