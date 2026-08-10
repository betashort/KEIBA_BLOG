import { Link } from "react-router-dom";
import { SITE_NAME } from "../utils/site";

interface HeaderProps {
  navOpen?: boolean;
  onMenuClick?: () => void;
}

export default function Header({ navOpen = false, onMenuClick }: HeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4">
        <Link to="/" className="text-lg font-bold text-gray-900">
          {SITE_NAME}
        </Link>
        <button
          type="button"
          className="rounded p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          aria-label={navOpen ? "メニューを閉じる" : "メニューを開く"}
          aria-expanded={navOpen}
          aria-controls="side-nav"
          onClick={onMenuClick}
        >
          <span aria-hidden="true" className="flex w-5 flex-col gap-1">
            <span className="block h-0.5 bg-current" />
            <span className="block h-0.5 bg-current" />
            <span className="block h-0.5 bg-current" />
          </span>
        </button>
      </div>
    </header>
  );
}
