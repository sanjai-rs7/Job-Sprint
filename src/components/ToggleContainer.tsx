import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MainRoutes } from "@/lib/helper";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { NavLink } from "react-router-dom";

const ToggleContainer = () => {
  return (
    <div>
      <Sheet>
        <SheetTrigger className="block md:hidden">
          <Menu />
        </SheetTrigger>
        <SheetContent>
          <nav>
            <ul className="flex flex-col items-start gap-4">
              {MainRoutes.map((route) => (
                <NavLink
                  className={({ isActive }) =>
                    cn(
                      "text-base text-neutral-600",
                      isActive && "text-neutral-900 font-semibold"
                    )
                  }
                  key={route.href}
                  to={route.href}
                >
                  {route.label}
                </NavLink>
              ))}
            </ul>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ToggleContainer;
