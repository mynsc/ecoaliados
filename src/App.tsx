import { MainLayout } from "@/components/layout";
import { MissionsProvider } from "@/contexts";

export default function App() {
  return (
    <MissionsProvider>
      <MainLayout />
    </MissionsProvider>
  );
}