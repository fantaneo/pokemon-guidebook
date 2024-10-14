import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";

export default function SideMenu() {
  const menuItems = [
    { name: "ポケモン", href: "/pokemons" },
    { name: "お気に入り", href: "/favorites" },
  ];

  return (
    <ScrollArea className="h-full py-6 pl-6 pr-6">
      <h2 className="mb-4 text-lg font-semibold">メニュー</h2>
      <nav className="flex flex-col space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className="rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </ScrollArea>
  );
}
