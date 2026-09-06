import { useCallback, useState, type ReactNode } from "react";
import Footer from "./Footer";
import Header from "./Header";
import SideNav from "./SideNav";

interface AppShellProps {
  children: ReactNode;
}

/** 共通レイアウト: Header + SideNav + Main + Footer（UI_design/common.md） */
export default function AppShell({ children }: AppShellProps) {
  const [navOpen, setNavOpen] = useState(false);
  const openNav = useCallback(() => setNavOpen(true), []);
  const closeNav = useCallback(() => setNavOpen(false), []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header navOpen={navOpen} onMenuClick={navOpen ? closeNav : openNav} />
      <SideNav open={navOpen} onClose={closeNav} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
