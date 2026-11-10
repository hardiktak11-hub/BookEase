
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/bookings/my-bookings",
        {
          withCredentials: true,
        }
      );

      console.log("My Bookings:", response.data);

      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error("Fetch bookings error:", error);

      setError(
        error.response?.data?.message ||
        "Failed to fetch bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    try {
      await axios.patch(
        `http://localhost:8000/api/v1/bookings/${bookingId}/cancel`,
        {},
        {
          withCredentials: true,
        }
      );

      alert("Booking cancelled successfully!");

      fetchBookings();
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Unable to cancel booking."
      );
    }
  };

  if (loading) {
    return <p className="text-center mt-20">Loading bookings...</p>;
  }

  if (error) {
    return <p className="text-center mt-20 text-red-600">{error}</p>;
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
          <Link to="/profile">Profile</Link>
        </div>
      </nav>

      <div className="bg-blue-50 p-8">
        <h2 className="text-3xl font-bold">
          My Bookings
        </h2>

        <p className="text-gray-600 mt-2">
          View and manage your service bookings.
        </p>
      </div>

      <div className="max-w-7xl mx-auto p-8">

        {bookings.length === 0 ? (
          <p className="text-center text-gray-500">
            You haven't made any bookings yet.
          </p>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">

            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr className="border-b">
                  <th className="p-4">Service</th>
                  <th className="p-4">Vendor</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Time</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id} className="border-b">

                    <td className="p-4 font-medium">
                      {booking.serviceId?.name || "Service"}
                    </td>

                    <td className="p-4">
                      {booking.vendorId?.businessName || "Vendor"}
                    </td>

                    <td className="p-4">
                      {booking.bookingDate}
                    </td>

                    <td className="p-4">
                      {booking.startTime} - {booking.endTime}
                    </td>

                    <td className="p-4 font-bold">
                      ₹{booking.totalPrice}
                    </td>

                    <td className="p-4 capitalize">
                      {booking.status}
                    </td>

                    <td className="p-4">
                      {["pending", "confirmed"].includes(booking.status) && (
                        <button
                          onClick={() => handleCancel(booking._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Cancel
                        </button>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        )}

      </div>
    </div>
  );
}

export default MyBookings;
