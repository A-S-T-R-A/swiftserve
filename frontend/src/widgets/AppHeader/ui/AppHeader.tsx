import { ProfileDropdown } from "@/entities/Self";
import { Button } from "@/shared/ui/button";
import { Header } from "@/shared/ui/header";
// import { mockLinks } from "../const/mock";
// import { TopNav } from "./TopNav";

export function AppHeader() {
  return (
    <Header>
      {/* <TopNav links={mockLinks} /> */}
      <div className="ml-auto flex items-center space-x-4">
        <Button variant="cosmicOutline" className="cursor-pointer" size="sm">
          AI Wizard
        </Button>
        <ProfileDropdown />
      </div>
    </Header>
  );
}
