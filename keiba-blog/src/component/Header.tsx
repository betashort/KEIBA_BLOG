import { Link, NavLink } from "react-router-dom";
import { SITE_NAME } from "../utils/site";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 text-sm ${isActive ? "font-semibold text-blue-700" : "text-gray-700 hover:text-blue-600"}`;

const navItems = [
  { to: "/blog", label: "ブログ" },
  { to: "/study", label: "競馬研究" },
  { to: "/analysis", label: "レース分析" },
  { to: "/predict", label: "レース予想" },
  { to: "/profile", label: "プロフィール" },
] as const;

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/" className="text-lg font-bold text-gray-900">
          {SITE_NAME}
        </Link>
        <nav aria-label="メインナビゲーション">
          <ul className="flex flex-wrap gap-1">
            {navItems.map(({ to, label }) => (
              <li key={to}>
                <NavLink to={to} className={navLinkClass}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
