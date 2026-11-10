
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

function ServiceDetails() {
  const { serviceId } = useParams();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/services/${serviceId}`
        );

        console.log("Service details:", response.data);

        setService(response.data.service);
      } catch (error) {
        console.error(error);
        setError(
          error.response?.data?.message ||
          "Failed to load service details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  if (loading) {
    return <p className="text-center mt-20">Loading service...</p>;
  }

  if (error) {
    return <p className="text-center mt-20 text-red-600">{error}</p>;
  }

  if (!service) {
    return <p className="text-center mt-20">Service not found.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow px-8 py-4 flex justify-between">
        <h1 className="text-2xl font-bold text-blue-600">
          BookEase
        </h1>

        <div className="flex gap-6">
          <Link to="/">Home</Link>
          <Link to="/services">Services</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-3xl font-bold mb-4">
            {service.name}
          </h2>

          <p className="text-gray-600 mb-4">
            {service.description}
          </p>

          <p className="mb-3">
            <strong>Category:</strong> {service.category}
          </p>

          <p className="mb-3">
            <strong>Duration:</strong> {service.duration} minutes
          </p>

          <p className="text-2xl font-bold text-blue-600 mb-6">
            ₹{service.price}
          </p>

          <Link
            to={`/booking/${service._id}`}
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Book Service
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ServiceDetails;

