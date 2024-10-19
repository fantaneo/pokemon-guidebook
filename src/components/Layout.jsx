import React from "react";
import Header from "./Header";
import SideMenu from "./SideMenu";
import PokemonTitle from "./PokemonTitle";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <PokemonTitle />
      <Header />
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r lg:block">
          <SideMenu />
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
