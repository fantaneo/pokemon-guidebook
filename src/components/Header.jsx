import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState } from "react";
import SideMenu from "./SideMenu";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex h-14 items-center border-b px-4 lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">メニューを開く</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full flex-col w-64">
            <SideMenu />
          </div>
        </SheetContent>
      </Sheet>
      <h1 className="ml-4 text-lg font-semibold">ポケモン図鑑</h1>
    </header>
  );
}
