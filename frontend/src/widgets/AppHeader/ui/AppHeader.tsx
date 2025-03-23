import { ProfileDropdown } from "@/entities/Self";
import { AiWizardButton } from "@/features/AIWizard";
import { Header } from "@/shared/ui/header";

export function AppHeader() {
  return (
    <Header>
      <div className="ml-auto flex items-center space-x-4">
        <AiWizardButton />
        <ProfileDropdown />
      </div>
    </Header>
  );
}
