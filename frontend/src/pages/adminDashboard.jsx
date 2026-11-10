
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000/api/v1/admin/dashboard";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API_URL, {
        withCredentials: true,
      });

      setStats(response.data.stats);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to fetch dashboard data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const cards = stats
    ? [
        {
          title: "Total Users",
          value: stats.totalUsers,
          color: "text-blue-600",
        },
        {
          title: "Total Customers",
          value: stats.totalCustomers,
          color: "text-indigo-600",
        },
        {
          title: "Total Vendors",
          value: stats.totalVendors,
          color: "text-purple-600",
        },
        {
          title: "Pending Approvals",
          value: stats.pendingVendors,
          color: "text-yellow-600",
        },
        {
          title: "Approved Vendors",
          value: stats.approvedVendors,
          color: "text-green-600",
        },
        {
          title: "Total Bookings",
          value: stats.totalBookings,
          color: "text-blue-600",
        },
        {
          title: "Pending Bookings",
          value: stats.pendingBookings,
          color: "text-orange-600",
        },
        {
          title: "Completed Bookings",
          value: stats.completedBookings,
          color: "text-green-600",
        },
        {
          title: "Cancelled Bookings",
          value: stats.cancelledBookings,
          color: "text-red-600",
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-gray-500">
              Monitor and manage your BookEase platform.
            </p>
          </div>

          <button
            onClick={fetchDashboard}
            className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <div
                key={card.title}
                className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <p className="text-sm font-medium text-gray-500">
                  {card.title}
                </p>

                <h2
                  className={`mt-3 text-3xl font-bold ${card.color}`}
                >
                  {card.value}
                </h2>
              </div>
            ))}
          </div>
        )}

        {/* Vendor Management */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800">
            Vendor Management
          </h2>

          <p className="mt-2 text-gray-500">
            Review vendor applications and manage vendor approvals.
          </p>

          <button
            onClick={() =>
              (window.location.href = "/vendor-approval")
            }
            className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
          >
            Manage Vendors
          </button>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;
