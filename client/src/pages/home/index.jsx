import { Header } from "../../shared/ui/Header";
import { useStore } from "../../shared/store/useStore";
import { RegistrationForm } from "../../features/patients/components/RegistrationForm";

export function Home() {
  const { isAuthenticated } = useStore();

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <RegistrationForm isAuthenticated={isAuthenticated} />
      </main>
    </div>
  );
}
