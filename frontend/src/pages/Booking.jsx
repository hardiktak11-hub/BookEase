
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function Booking() {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/services/${serviceId}`
        );

        setService(response.data.service);
      } catch (error) {
        setError(
          error.response?.data?.message ||
          "Unable to load service."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const response = await axios.post(
        "http://localhost:8000/api/v1/bookings",
        {
          serviceId,
          bookingDate,
          startTime,
        },
        {
          withCredentials: true,
        }
      );

      alert(
        response.data.message || "Booking created successfully!"
      );

      navigate("/my-bookings");
    } catch (error) {
      console.error("Booking error:", error);

      setError(
        error.response?.data?.message ||
        "Booking failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-20">Loading...</p>;
  }

  if (!service) {
    return (
      <p className="text-center mt-20 text-red-600">
        {error || "Service not found."}
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow px-8 py-4 flex justify-between">
        <h1 className="text-2xl font-bold text-blue-600">
          BookEase
        </h1>

        <Link to="/services">Services</Link>
      </nav>

      <div className="max-w-3xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-3xl font-bold mb-6">
            Book Your Service
          </h2>

          <div className="bg-blue-50 p-5 rounded-lg mb-8">
            <h3 className="text-xl font-bold text-blue-700">
              {service.name}
            </h3>

            <p className="text-gray-600 mt-2">
              {service.description}
            </p>

            <p className="text-2xl font-bold text-blue-600 mt-3">
              ₹{service.price}
            </p>

            <p className="text-gray-600 mt-1">
              Duration: {service.duration} minutes
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-medium mb-2">
                Booking Date
              </label>

              <input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                min={new Date().toLocaleDateString("en-CA")}
                required
                className="w-full border rounded-lg px-4 py-3"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Start Time
              </label>

              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="w-full border rounded-lg px-4 py-3"
              />
            </div>

            {error && (
              <p className="text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? "Booking..." : "Confirm Booking"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Booking;
