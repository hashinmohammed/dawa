import { Link } from "react-router-dom";
import { useStore } from "../../shared/store/useStore";

export function Home() {
  const { user, login, logout, isAuthenticated } = useStore();

  return (
    <div>
      <h1>Home Page</h1>
      <p>User: {user ? user.name : "Guest"}</p>
      <p>Status: {isAuthenticated ? "Logged In" : "Logged Out"}</p>

      {!isAuthenticated ? (
        <button onClick={() => login({ name: "Test User" })}>Login</button>
      ) : (
        <button onClick={logout}>Logout</button>
      )}

      <nav>{/* Navigation links can go here */}</nav>
    </div>
  );
}
