import { useEffect } from "react";
import { NavLink } from "react-router-dom";

const navItems: { to: string; label: string; end?: boolean }[] = [
  { to: "/", label: "ホーム", end: true },
  { to: "/blog", label: "ブログ" },
  { to: "/study", label: "競馬研究" },
  { to: "/analysis", label: "レース分析" },
  { to: "/predict", label: "レース予想" },
  { to: "/profile", label: "プロフィール" },
];

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `block px-4 py-3 text-sm ${
    isActive
      ? "bg-blue-50 font-semibold text-blue-700"
      : "text-gray-800 hover:bg-gray-50"
  }`;

interface SideNavProps {
  open: boolean;
  onClose: () => void;
}

export default function SideNav({ open, onClose }: SideNavProps) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-40 ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="ナビを閉じる"
        className={`absolute inset-0 bg-black/40 transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        tabIndex={open ? 0 : -1}
      />
      <nav
        id="side-nav"
        aria-label="サイドナビゲーション"
        className={`absolute inset-y-0 right-0 flex w-72 max-w-[85vw] flex-col bg-white shadow-xl transition-transform duration-200 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <p className="text-sm font-semibold text-gray-900">メニュー</p>
          <button
            type="button"
            aria-label="閉じる"
            className="rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            onClick={onClose}
          >
            <span aria-hidden="true" className="block text-xl leading-none">
              ×
            </span>
          </button>
        </div>
        <ul className="py-2">
          {navItems.map(({ to, label, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={navLinkClass}
                onClick={onClose}
                tabIndex={open ? 0 : -1}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
