import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
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
        <SheetContent side="left" className="w-[240px] sm:w-[300px]">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b px-4 py-2">
              <h2 className="text-lg font-semibold">メニュー</h2>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-6 w-6" />
                  <span className="sr-only">メニューを閉じる</span>
                </Button>
              </SheetTrigger>
            </div>
            <SideMenu />
          </div>
        </SheetContent>
      </Sheet>
      <h1 className="ml-4 text-lg font-semibold">マイアプリ</h1>
    </header>
  );
}
