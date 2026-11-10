
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Check logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "https://bookease-ya30.onrender.com/api/v1/auth/me",
          { withCredentials: true }
        );

        setUser(response.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Logout
  const handleLogout = async () => {
    try {
      await axios.post(
        "https://bookease-ya30.onrender.com/api/v1/auth/logout",
        {},
        { withCredentials: true }
      );

      setUser(null);
      setError("");
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Logout failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <nav className="flex flex-wrap items-center justify-between gap-4 border-b px-6 py-5 md:px-10">

        <Link to="/" className="text-2xl font-bold text-blue-700">
          🏠 BookEase
        </Link>

        <div className="flex flex-wrap items-center gap-4 text-gray-700 md:gap-6">

          <Link to="/" className="hover:text-blue-700">
            Home
          </Link>

          <Link to="/services" className="hover:text-blue-700">
            Services
          </Link>

          {!loading && (
            <>
              {/* Logged out */}
              {!user && (
                <>
                  <Link to="/login" className="hover:text-blue-700">
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="rounded-md bg-blue-700 px-5 py-2 text-white hover:bg-blue-800"
                  >
                    Register
                  </Link>
                </>
              )}

              {/* Customer */}
              {user?.role === "customer" && (
                <Link
                  to="/my-bookings"
                  className="hover:text-blue-700"
                >
                  My Bookings
                </Link>
              )}

              {/* Vendor */}
              {user?.role === "vendor" && (
                <>
                  <Link
                    to="/vendor-dashboard"
                    className="hover:text-blue-700"
                  >
                    Vendor Dashboard
                  </Link>

                  <Link
                    to="/my-bookings"
                    className="hover:text-blue-700"
                  >
                    My Bookings
                  </Link>
                </>
              )}

              {/* Admin */}
              {user?.role === "admin" && (
                <>
                  <Link
                    to="/admin-dashboard"
                    className="hover:text-blue-700"
                  >
                    Admin Dashboard
                  </Link>

                  <Link
                    to="/vendor-approval"
                    className="hover:text-blue-700"
                  >
                    Vendor Approval
                  </Link>
                </>
              )}

              {/* Logged-in users */}
              {user && (
                <>
                  <Link
                    to="/profile"
                    className="hover:text-blue-700"
                  >
                    Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="rounded-md bg-red-600 px-5 py-2 text-white hover:bg-red-700"
                  >
                    Logout
                  </button>
                </>
              )}
            </>
          )}

          {loading && (
            <span className="text-sm text-gray-400">
              Loading...
            </span>
          )}

        </div>
      </nav>

      {error && (
        <p className="bg-red-100 p-3 text-center text-red-700">
          {error}
        </p>
      )}

      {/* Hero Section */}
      <section className="bg-blue-50 px-10 py-20 text-center">

        <h1 className="text-4xl font-bold text-gray-900">
          Book Trusted Home Services
        </h1>

        <p className="mt-4 text-lg text-gray-600">
          Find reliable professionals for all your home service needs.
        </p>

        <Link
          to="/services"
          className="mt-8 inline-block rounded-md bg-blue-700 px-8 py-3 text-white hover:bg-blue-800"
        >
          Explore Services
        </Link>

      </section>

      {/* Service Categories */}
      <section className="px-10 py-16">

        <h2 className="mb-10 text-center text-2xl font-bold text-gray-900">
          Our Services
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {[
            { name: "Cleaning", icon: "🧹" },
            { name: "Plumbing", icon: "🔧" },
            { name: "Electrical", icon: "⚡" },
            { name: "Painting", icon: "🎨" },
          ].map((service) => (
            <div
              key={service.name}
              className="rounded-lg border p-8 text-center transition hover:shadow-md"
            >
              <div className="mb-4 text-5xl">
                {service.icon}
              </div>

              <h3 className="text-lg font-semibold">
                {service.name}
              </h3>
            </div>
          ))}

        </div>

      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-6 text-center text-gray-600">
        © 2026 BookEase. All rights reserved.
      </footer>

    </div>
  );
}

export default Home;
