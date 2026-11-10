
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://bookease-ya30.onrender.com/api/v1/vendors";

function VendorApproval() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState("");

  // Fetch all vendors
  const fetchVendors = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API_URL, {
        withCredentials: true,
      });

      setVendors(response.data.vendors || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch vendors"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // Approve, reject or suspend vendor
  const handleAction = async (vendorId, action) => {
    try {
      setActionLoading(vendorId + action);
      setError("");

      await axios.patch(
        `${API_URL}/${vendorId}/${action}`,
        {},
        { withCredentials: true }
      );

      await fetchVendors();
    } catch (err) {
      setError(
        err.response?.data?.message || "Action failed"
      );
    } finally {
      setActionLoading("");
    }
  };

  // Filter vendors
  const filteredVendors =
    filter === "all"
      ? vendors
      : vendors.filter((vendor) => vendor.status === filter);

  const getStatusStyle = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "suspended":
        return "bg-gray-200 text-gray-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const pendingCount = vendors.filter(
    (vendor) => vendor.status === "pending"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Vendor Approval
            </h1>
            <p className="mt-2 text-gray-500">
              Review and manage vendor applications.
            </p>
          </div>

          <button
            onClick={fetchVendors}
            className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>

        {/* Summary */}
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Vendors</p>
            <h2 className="mt-2 text-3xl font-bold text-gray-800">
              {vendors.length}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Pending Approvals</p>
            <h2 className="mt-2 text-3xl font-bold text-yellow-600">
              {pendingCount}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Approved Vendors</p>
            <h2 className="mt-2 text-3xl font-bold text-green-600">
              {vendors.filter(
                (vendor) => vendor.status === "approved"
              ).length}
            </h2>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          {["all", "pending", "approved", "rejected", "suspended"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`rounded-lg px-4 py-2 text-sm font-medium capitalize ${
                  filter === status
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 shadow-sm hover:bg-gray-100"
                }`}
              >
                {status}
              </button>
            )
          )}
        </div>

        {/* Vendor List */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="border-b p-5">
            <h2 className="text-xl font-semibold text-gray-800">
              Vendor Applications
            </h2>
          </div>

          {loading ? (
            <p className="p-8 text-center text-gray-500">
              Loading vendors...
            </p>
          ) : filteredVendors.length === 0 ? (
            <p className="p-8 text-center text-gray-500">
              No vendors found.
            </p>
          ) : (
            <div className="divide-y">
              {filteredVendors.map((vendor) => (
                <div
                  key={vendor._id}
                  className="flex flex-col justify-between gap-5 p-6 lg:flex-row lg:items-center"
                >
                  {/* Vendor Information */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {vendor.businessName}
                    </h3>

                    <p className="text-sm text-gray-600">
                      Owner: {vendor.userId?.username || "N/A"}
                    </p>

                    <p className="text-sm text-gray-600">
                      Email: {vendor.userId?.email || "N/A"}
                    </p>

                    <p className="text-sm text-gray-600">
                      Experience: {vendor.experience ?? 0} years
                    </p>

                    {vendor.description && (
                      <p className="max-w-xl text-sm text-gray-500">
                        {vendor.description}
                      </p>
                    )}

                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                        vendor.status
                      )}`}
                    >
                      {vendor.status}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    {vendor.status === "pending" && (
                      <>
                        <button
                          disabled={actionLoading !== ""}
                          onClick={() =>
                            handleAction(vendor._id, "approve")
                          }
                          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                        >
                          {actionLoading === vendor._id + "approve"
                            ? "Processing..."
                            : "Approve"}
                        </button>

                        <button
                          disabled={actionLoading !== ""}
                          onClick={() =>
                            handleAction(vendor._id, "reject")
                          }
                          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          {actionLoading === vendor._id + "reject"
                            ? "Processing..."
                            : "Reject"}
                        </button>
                      </>
                    )}

                    {vendor.status === "approved" && (
                      <button
                        disabled={actionLoading !== ""}
                        onClick={() =>
                          handleAction(vendor._id, "suspend")
                        }
                        className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                      >
                        {actionLoading === vendor._id + "suspend"
                          ? "Processing..."
                          : "Suspend"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VendorApproval;
