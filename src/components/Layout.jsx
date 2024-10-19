import React from "react";
import Header from "./Header";
import SideMenu from "./SideMenu";

export default function Layout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-pale-yellow">
      {" "}
      {/* カスタムカラーを使用 */}
      {/* サイドバー */}
      <aside className="hidden lg:block w-64 overflow-y-auto">
        <SideMenu />
      </aside>
      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
