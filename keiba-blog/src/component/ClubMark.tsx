import type { Club } from "../data/hitokuchiHorses";

interface ClubMarkProps {
  club: Club;
}

function silkBackground(club: Club): string | undefined {
  if (!club.silkPattern || !club.secondaryColor) return undefined;

  const outer = club.color;
  const inner = club.secondaryColor;

  switch (club.silkPattern) {
    case "vertical-thirds":
      return `linear-gradient(to right, ${outer} 0 33.333%, ${inner} 33.333% 66.667%, ${outer} 66.667% 100%)`;
    case "horizontal-thirds":
      return `linear-gradient(to bottom, ${outer} 0 33.333%, ${inner} 33.333% 66.667%, ${outer} 66.667% 100%)`;
  }
}

/** 所属クラブマーク。勝負服風の模様の上にクラブコードを重ねる */
export default function ClubMark({ club }: ClubMarkProps) {
  const backgroundImage = silkBackground(club);

  return (
    <span
      className="inline-flex h-5 min-w-7 shrink-0 items-center justify-center overflow-hidden rounded px-0.5 text-[8px] font-bold tracking-tighter text-white [text-shadow:0_0_2px_rgba(0,0,0,0.9),0_1px_1px_rgba(0,0,0,0.75)]"
      style={{
        backgroundColor: club.color,
        backgroundImage,
      }}
      title={club.name}
      aria-label={club.name}
    >
      {club.code}
    </span>
  );
}
