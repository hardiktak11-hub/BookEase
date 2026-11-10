
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function VendorDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/bookings/vendor-bookings",
        {
          withCredentials: true,
        }
      );

      console.log("Vendor bookings:", response.data);

      setBookings(response.data.bookings || []);
      setError("");
    } catch (error) {
      console.error("Fetch vendor bookings error:", error);

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

  const updateStatus = async (bookingId, status) => {
    try {
      setUpdatingId(bookingId);
      setError("");

      const response = await axios.patch(
        `http://localhost:8000/api/v1/bookings/${bookingId}/status`,
        { status },
        {
          withCredentials: true,
        }
      );

      alert(response.data.message || "Booking status updated!");

      await fetchBookings();
    } catch (error) {
      console.error("Update booking error:", error);

      setError(
        error.response?.data?.message ||
        "Unable to update booking status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending"
  ).length;

  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed"
  ).length;

  if (loading) {
    return (
      <p className="text-center mt-20">
        Loading vendor dashboard...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">
          BookEase
        </h1>

        <div className="flex gap-6">
          <Link to="/">Home</Link>
          <Link to="/services">Services</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/login">Logout</Link>
        </div>
      </nav>

      {/* Dashboard */}
      <div className="max-w-6xl mx-auto p-8">

        <h2 className="text-3xl font-bold mb-2">
          Vendor Dashboard
        </h2>

        <p className="text-gray-600 mb-8">
          Manage your customer bookings.
        </p>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500">
              Total Bookings
            </h3>

            <p className="text-3xl font-bold mt-2">
              {totalBookings}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500">
              Pending Bookings
            </h3>

            <p className="text-3xl font-bold text-yellow-500 mt-2">
              {pendingBookings}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500">
              Completed Bookings
            </h3>

            <p className="text-3xl font-bold text-green-600 mt-2">
              {completedBookings}
            </p>
          </div>

        </div>

        {/* Error */}
        {error && (
          <p className="text-red-600 mb-4">
            {error}
          </p>
        )}

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow p-6">

          <h3 className="text-xl font-bold mb-6">
            Customer Bookings
          </h3>

          {bookings.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No bookings received yet.
            </p>
          ) : (

            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="p-3">Customer</th>
                    <th className="p-3">Service</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Time</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {bookings.map((booking) => (

                    <tr key={booking._id} className="border-b">

                      <td className="p-3">
                        <p className="font-medium">
                          {booking.customerId?.username || "Customer"}
                        </p>

                        <p className="text-sm text-gray-500">
                          {booking.customerId?.email}
                        </p>
                      </td>

                      <td className="p-3">
                        {booking.serviceId?.name || "Service"}
                      </td>

                      <td className="p-3">
                        {booking.bookingDate}
                      </td>

                      <td className="p-3">
                        {booking.startTime} - {booking.endTime}
                      </td>

                      <td className="p-3 font-medium">
                        ₹{booking.totalPrice}
                      </td>

                      <td className="p-3 capitalize">
                        {booking.status}
                      </td>

                      <td className="p-3">

                        {booking.status === "pending" && (
                          <div className="flex gap-2">

                            <button
                              disabled={updatingId === booking._id}
                              onClick={() =>
                                updateStatus(booking._id, "confirmed")
                              }
                              className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
                            >
                              Accept
                            </button>

                            <button
                              disabled={updatingId === booking._id}
                              onClick={() =>
                                updateStatus(booking._id, "cancelled")
                              }
                              className="bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50"
                            >
                              Reject
                            </button>

                          </div>
                        )}

                        {booking.status === "confirmed" && (
                          <button
                            disabled={updatingId === booking._id}
                            onClick={() =>
                              updateStatus(booking._id, "completed")
                            }
                            className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
                          >
                            Mark Completed
                          </button>
                        )}

                        {booking.status === "completed" && (
                          <span className="text-green-600">
                            Completed
                          </span>
                        )}

                        {booking.status === "cancelled" && (
                          <span className="text-red-600">
                            Cancelled
                          </span>
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
    </div>
  );
}

export default VendorDashboard;
