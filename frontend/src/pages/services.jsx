

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          "https://bookease-ya30.onrender.com/api/v1/services"
        );

        console.log("Services response:", response.data);

        // We'll confirm the exact response structure
        // after checking your backend response.
        setServices(response.data.services || []);
      } catch (error) {
        console.error("Error fetching services:", error);

        setError(
          error.response?.data?.message ||
          "Failed to load services."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-20 text-xl">
        Loading services...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-20 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">
          BookEase
        </h1>

        <div className="flex gap-6">
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-8">
        <h2 className="text-3xl font-bold mb-2">
          Our Services
        </h2>

        <p className="text-gray-600 mb-8">
          Explore our available home services.
        </p>

        {services.length === 0 ? (
          <p className="text-center text-gray-500">
            No services available currently.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service._id}
                className="bg-white rounded-lg shadow p-6"
              >
                <h3 className="text-xl font-bold mb-2">
                  {service.name}
                </h3>

                <p className="text-gray-600 mb-3">
                  {service.description}
                </p>

                <p className="text-sm text-gray-500 mb-2">
                  Category: {service.category}
                </p>

                <p className="text-2xl font-bold text-blue-600 mb-4">
                  ₹{service.price}
                </p>

                <Link
                  to={`/service-details/${service._id}`}
                  className="block text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Services;
