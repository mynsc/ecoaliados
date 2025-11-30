import { MainLayout } from "@/components/layout";
import { MissionsProvider, ProfileProvider } from "@/contexts";

export default function App() {
  return (
    <ProfileProvider>
      <MissionsProvider>
        <MainLayout />
      </MissionsProvider>
    </ProfileProvider>
  );
}