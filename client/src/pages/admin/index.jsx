import { Link } from "react-router-dom";
import { PATH } from "../../constants/path";

export function Admin() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p className="mb-4">Welcome to the admin area.</p>
      <nav>
        <Link to={PATH.HOME} className="text-indigo-600 hover:text-indigo-800">
          Go to Home
        </Link>
      </nav>
    </div>
  );
}
