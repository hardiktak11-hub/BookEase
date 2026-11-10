
import { useState } from "react";
import axios from "axios";

function Register() {
  const [role, setRole] = useState("customer");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    businessName: "",
    experience: "",
    description: "",
  });

  const [message, setMessage] = useState("");

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    try {
      const endpoint =
        role === "customer"
          ? "http://localhost:8000/api/v1/auth/register/customer"
          : "http://localhost:8000/api/v1/auth/register/vendor";

      const response = await axios.post(endpoint, formData, {
        withCredentials: true,
      });

      setMessage(response.data.message || "Registration successful!");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Registration failed."
      );
    }
  }

  return (
    <div className="min-h-screen flex bg-white">

      {/* Left Section */}
      <div className="w-1/2 bg-blue-50 p-10 flex flex-col justify-between">

        <h2 className="text-3xl font-bold text-blue-700">
          🏠 BookEase
        </h2>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Create an Account
          </h1>

          <p className="mt-3 text-gray-600">
            Join BookEase to book or offer home services.
          </p>
        </div>

        <div className="text-9xl text-center">
          🏡
        </div>

      </div>

      {/* Right Section */}
      <div className="w-1/2 flex items-center justify-center p-10">

        <div className="w-full max-w-sm">

          <h2 className="text-2xl font-bold text-gray-900 mb-5">
            Register
          </h2>

          {/* Role Selection */}
          <div className="flex gap-3 mb-5">

            <button
              type="button"
              onClick={() => setRole("customer")}
              className={`w-1/2 py-2 rounded-full ${
                role === "customer"
                  ? "bg-blue-700 text-white"
                  : "border border-gray-300"
              }`}
            >
              Customer
            </button>

            <button
              type="button"
              onClick={() => setRole("vendor")}
              className={`w-1/2 py-2 rounded-full ${
                role === "vendor"
                  ? "bg-blue-700 text-white"
                  : "border border-gray-300"
              }`}
            >
              Vendor
            </button>

          </div>

          <form onSubmit={handleSubmit} className="space-y-3">

            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              required
              className="w-full border border-gray-300 rounded-md p-3"
            />

            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full border border-gray-300 rounded-md p-3"
            />

            <input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              required
              className="w-full border border-gray-300 rounded-md p-3"
            />

            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full border border-gray-300 rounded-md p-3"
            />

            {/* Vendor-specific fields */}
            {role === "vendor" && (
              <>
                <input
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="Business Name"
                  required
                  className="w-full border border-gray-300 rounded-md p-3"
                />

                <input
                  name="experience"
                  type="number"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Experience (years)"
                  required
                  className="w-full border border-gray-300 rounded-md p-3"
                />

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Business Description"
                  required
                  className="w-full border border-gray-300 rounded-md p-3"
                />
              </>
            )}

            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-3 rounded-md hover:bg-blue-800"
            >
              Register as {role === "customer" ? "Customer" : "Vendor"}
            </button>

          </form>

          {message && (
            <p className="text-center mt-4 text-sm text-blue-700">
              {message}
            </p>
          )}

          <p className="text-sm text-center mt-5">
            Already have an account?{" "}
            <a href="/login" className="text-blue-700 font-semibold">
              Login
            </a>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Register;
