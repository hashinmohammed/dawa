import { Link } from "react-router-dom";
import { PATH } from "../../constants/path";
import { Header } from "../../shared/ui/Header";

export function Admin() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <p className="mb-4">Welcome to the admin area.</p>
        <nav>
          <Link
            to={PATH.HOME}
            className="text-indigo-600 hover:text-indigo-800"
          >
            Go to Home
          </Link>
        </nav>
      </div>
    </div>
  );
}
