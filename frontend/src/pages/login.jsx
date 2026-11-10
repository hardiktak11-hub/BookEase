
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        "http://localhost:8000/api/v1/auth/login",
        formData,
        {
          withCredentials: true,
        }
      );

      console.log("Login successful:", response.data);

      alert("Login successful!");

      navigate("/");
    } catch (error) {
      console.error("Login error:", error);

      setError(
        error.response?.data?.message ||
        "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">

      {/* Left Section */}
      <div className="w-1/2 bg-blue-50 p-10 flex flex-col justify-between">

        <h2 className="text-3xl font-bold text-blue-700">
          🏠 BookEase
        </h2>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome Back!
          </h1>

          <p className="mt-3 text-gray-600">
            Login to book services and manage
            your bookings.
          </p>
        </div>

        <div className="text-9xl text-center">
          🏡
        </div>

      </div>

      {/* Right Section */}
      <div className="w-1/2 flex items-center justify-center p-10">

        <div className="w-full max-w-sm">

          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-3"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-3"
            />

            {error && (
              <p className="text-red-600 text-sm">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 text-white py-3 rounded-md hover:bg-blue-800 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          <p className="text-sm text-center mt-5">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-700 font-semibold"
            >
              Register
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;
