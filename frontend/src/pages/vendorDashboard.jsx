
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = "https://bookease-ya30.onrender.com/api/v1";

const initialServiceData = {
  name: "",
  description: "",
  category: "",
  price: "",
  duration: "",
  image: "",
};

const initialAvailability = {
  dayOfWeek: "Monday",
  startTime: "09:00",
  endTime: "18:00",
  slotDuration: 60,
  isAvailable: true,
};

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function VendorDashboard() {
  // Booking states
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // Service states
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [serviceError, setServiceError] = useState("");
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [savingService, setSavingService] = useState(false);
  const [serviceData, setServiceData] = useState(initialServiceData);

  // Availability states
  const [availability, setAvailability] = useState([]);
  const [availabilityForm, setAvailabilityForm] = useState(initialAvailability);
  const [availabilityLoading, setAvailabilityLoading] = useState(true);
  const [availabilitySaving, setAvailabilitySaving] = useState(false);
  const [availabilityError, setAvailabilityError] = useState("");

  // =====================================
  // FETCH BOOKINGS
  // =====================================

  const fetchBookings = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/bookings/vendor-bookings`,
        { withCredentials: true }
      );

      setBookings(response.data.bookings || []);
      setError("");
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

  // =====================================
  // FETCH SERVICES
  // =====================================

  const fetchServices = async () => {
    try {
      setServicesLoading(true);
      setServiceError("");

      const response = await axios.get(
        `${API_URL}/services/my-services`,
        { withCredentials: true }
      );

      setServices(response.data.services || []);
    } catch (error) {
      console.error("Fetch services error:", error);

      setServiceError(
        error.response?.data?.message ||
        "Failed to fetch your services."
      );
    } finally {
      setServicesLoading(false);
    }
  };

  // =====================================
  // FETCH AVAILABILITY
  // =====================================

  const fetchAvailability = async () => {
    try {
      setAvailabilityLoading(true);
      setAvailabilityError("");

      const response = await axios.get(
        `${API_URL}/availability`,
        { withCredentials: true }
      );

      setAvailability(response.data.availability || []);
    } catch (error) {
      console.error("Fetch availability error:", error);

      setAvailabilityError(
        error.response?.data?.message ||
        "Failed to fetch availability."
      );
    } finally {
      setAvailabilityLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchServices();
    fetchAvailability();
  }, []);

  // =====================================
  // UPDATE BOOKING STATUS
  // =====================================

  const updateStatus = async (bookingId, status) => {
    try {
      setUpdatingId(bookingId);
      setError("");

      const response = await axios.patch(
        `${API_URL}/bookings/${bookingId}/status`,
        { status },
        { withCredentials: true }
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

  // =====================================
  // SERVICE FORM HANDLING
  // =====================================

  const handleServiceChange = (e) => {
    const { name, value } = e.target;

    setServiceData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openCreateForm = () => {
    setEditingServiceId(null);
    setServiceData(initialServiceData);
    setServiceError("");
    setShowServiceForm(true);
  };

  const openEditForm = (service) => {
    setEditingServiceId(service._id);

    setServiceData({
      name: service.name || "",
      description: service.description || "",
      category: service.category || "",
      price: service.price ?? "",
      duration: service.duration ?? "",
      image: service.image || "",
    });

    setServiceError("");
    setShowServiceForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================
  // CREATE / UPDATE SERVICE
  // =====================================

  const handleServiceSubmit = async (e) => {
    e.preventDefault();

    try {
      setSavingService(true);
      setServiceError("");

      const payload = {
        ...serviceData,
        price: Number(serviceData.price),
        duration: Number(serviceData.duration),
      };

      if (editingServiceId) {
        const response = await axios.patch(
          `${API_URL}/services/${editingServiceId}`,
          payload,
          { withCredentials: true }
        );

        alert(response.data.message || "Service updated successfully!");
      } else {
        const response = await axios.post(
          `${API_URL}/services`,
          payload,
          { withCredentials: true }
        );

        alert(response.data.message || "Service created successfully!");
      }

      setServiceData(initialServiceData);
      setEditingServiceId(null);
      setShowServiceForm(false);

      await fetchServices();
    } catch (error) {
      console.error("Save service error:", error);

      setServiceError(
        error.response?.data?.message ||
        "Unable to save service."
      );
    } finally {
      setSavingService(false);
    }
  };

  // =====================================
  // DELETE SERVICE
  // =====================================

  const handleDeleteService = async (serviceId) => {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate this service?"
    );

    if (!confirmed) return;

    try {
      setServiceError("");

      const response = await axios.delete(
        `${API_URL}/services/${serviceId}`,
        { withCredentials: true }
      );

      alert(response.data.message || "Service deactivated successfully!");

      await fetchServices();
    } catch (error) {
      console.error("Delete service error:", error);

      setServiceError(
        error.response?.data?.message ||
        "Unable to delete service."
      );
    }
  };

  // =====================================
  // AVAILABILITY FORM HANDLING
  // =====================================

  const handleAvailabilityChange = (e) => {
    const { name, value, type, checked } = e.target;

    setAvailabilityForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =====================================
  // SAVE AVAILABILITY
  // =====================================

  const handleAvailabilitySubmit = async (e) => {
    e.preventDefault();

    try {
      setAvailabilitySaving(true);
      setAvailabilityError("");

      const payload = {
        ...availabilityForm,
        slotDuration: Number(availabilityForm.slotDuration),
      };

      const response = await axios.put(
        `${API_URL}/availability`,
        payload,
        { withCredentials: true }
      );

      alert(response.data.message || "Availability saved successfully!");

      await fetchAvailability();
    } catch (error) {
      console.error("Save availability error:", error);

      setAvailabilityError(
        error.response?.data?.message ||
        "Unable to save availability."
      );
    } finally {
      setAvailabilitySaving(false);
    }
  };

  // =====================================
  // EDIT AVAILABILITY
  // =====================================

  const editAvailability = (day) => {
    setAvailabilityForm({
      dayOfWeek: day.dayOfWeek,
      startTime: day.startTime || "09:00",
      endTime: day.endTime || "18:00",
      slotDuration: day.slotDuration || 60,
      isAvailable: day.isAvailable,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================
  // BOOKING STATISTICS
  // =====================================

  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending"
  ).length;

  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed"
  ).length;

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <p className="text-center mt-20">
        Loading vendor dashboard...
      </p>
    );
  }

  // =====================================
  // MAIN DASHBOARD
  // =====================================

  return (
    <div className="min-h-screen bg-gray-100">

      {/* NAVBAR */}
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

      <div className="max-w-6xl mx-auto p-8">

        <h2 className="text-3xl font-bold mb-2">
          Vendor Dashboard
        </h2>

        <p className="text-gray-600 mb-8">
          Manage your services, availability and customer bookings.
        </p>

        {/* ================================= */}
        {/* BOOKING STATISTICS */}
        {/* ================================= */}

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

        {error && (
          <p className="text-red-600 mb-4">
            {error}
          </p>
        )}

        {/* ================================= */}
        {/* MY SERVICES */}
        {/* ================================= */}

        <div className="bg-white rounded-lg shadow p-6 mb-8">

          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">
              My Services
            </h3>

            <button
              onClick={openCreateForm}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              + Add New Service
            </button>
          </div>

          {/* SERVICE FORM */}

          {showServiceForm && (
            <form
              onSubmit={handleServiceSubmit}
              className="bg-gray-50 border rounded-lg p-6 mb-8"
            >

              <h4 className="text-lg font-bold mb-5">
                {editingServiceId ? "Edit Service" : "Create New Service"}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <label className="block mb-2 font-medium">
                    Service Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={serviceData.name}
                    onChange={handleServiceChange}
                    placeholder="e.g. Home Cleaning"
                    required
                    className="w-full border rounded-md p-3"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    Category
                  </label>

                  <input
                    type="text"
                    name="category"
                    value={serviceData.category}
                    onChange={handleServiceChange}
                    placeholder="e.g. Cleaning"
                    required
                    className="w-full border rounded-md p-3"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    Price (₹)
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={serviceData.price}
                    onChange={handleServiceChange}
                    min="1"
                    placeholder="Enter price"
                    required
                    className="w-full border rounded-md p-3"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    Duration (minutes)
                  </label>

                  <input
                    type="number"
                    name="duration"
                    value={serviceData.duration}
                    onChange={handleServiceChange}
                    min="1"
                    placeholder="e.g. 60"
                    required
                    className="w-full border rounded-md p-3"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-2 font-medium">
                    Image URL (optional)
                  </label>

                  <input
                    type="url"
                    name="image"
                    value={serviceData.image}
                    onChange={handleServiceChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full border rounded-md p-3"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-2 font-medium">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={serviceData.description}
                    onChange={handleServiceChange}
                    placeholder="Describe your service..."
                    rows="4"
                    required
                    className="w-full border rounded-md p-3"
                  />
                </div>

              </div>

              {serviceError && (
                <p className="text-red-600 mt-4">
                  {serviceError}
                </p>
              )}

              <div className="flex gap-3 mt-6">

                <button
                  type="submit"
                  disabled={savingService}
                  className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {savingService
                    ? "Saving..."
                    : editingServiceId
                    ? "Update Service"
                    : "Create Service"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowServiceForm(false);
                    setEditingServiceId(null);
                    setServiceData(initialServiceData);
                    setServiceError("");
                  }}
                  className="bg-gray-300 px-5 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>

              </div>

            </form>
          )}

          {/* SERVICE LIST */}

          {serviceError && !showServiceForm && (
            <p className="text-red-600 mb-4">
              {serviceError}
            </p>
          )}

          {servicesLoading ? (
            <p className="text-center py-8 text-gray-500">
              Loading your services...
            </p>
          ) : services.length === 0 ? (
            <p className="text-center py-8 text-gray-500">
              You haven't created any services yet.
            </p>
          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {services.map((service) => (

                <div
                  key={service._id}
                  className="border rounded-lg p-5 flex flex-col"
                >

                  {service.image && (
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-44 object-cover rounded-md mb-4"
                    />
                  )}

                  <h4 className="text-lg font-bold">
                    {service.name}
                  </h4>

                  <p className="text-sm text-blue-600 mt-1">
                    {service.category}
                  </p>

                  <p className="text-gray-600 text-sm mt-3">
                    {service.description}
                  </p>

                  <div className="flex justify-between mt-4 font-medium">
                    <span>₹{service.price}</span>
                    <span>{service.duration} minutes</span>
                  </div>

                  <p className={`text-sm mt-3 ${
                    service.isActive
                      ? "text-green-600"
                      : "text-red-600"
                  }`}>
                    {service.isActive ? "Active" : "Inactive"}
                  </p>

                  <div className="flex gap-3 mt-5">

                    <button
                      onClick={() => openEditForm(service)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Edit
                    </button>

                    {service.isActive && (
                      <button
                        onClick={() => handleDeleteService(service._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                      >
                        Delete
                      </button>
                    )}

                  </div>

                </div>

              ))}

            </div>
          )}

        </div>

        {/* ================================= */}
        {/* MANAGE AVAILABILITY */}
        {/* ================================= */}

        <div className="bg-white rounded-lg shadow p-6 mb-8">

          <h3 className="text-xl font-bold mb-2">
            Manage Availability
          </h3>

          <p className="text-gray-500 mb-6">
            Set your working days and available time slots.
          </p>

          {availabilityError && (
            <p className="text-red-600 mb-4">
              {availabilityError}
            </p>
          )}

          {/* AVAILABILITY FORM */}

          <form
            onSubmit={handleAvailabilitySubmit}
            className="bg-gray-50 border rounded-lg p-5 mb-8"
          >

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <label className="block font-medium mb-2">
                  Select Day
                </label>

                <select
                  name="dayOfWeek"
                  value={availabilityForm.dayOfWeek}
                  onChange={handleAvailabilityChange}
                  className="w-full border rounded-md p-3"
                >
                  {DAYS.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium mb-2">
                  Slot Duration
                </label>

                <select
                  name="slotDuration"
                  value={availabilityForm.slotDuration}
                  onChange={handleAvailabilityChange}
                  className="w-full border rounded-md p-3"
                >
                  <option value="30">30 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="90">90 minutes</option>
                  <option value="120">120 minutes</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-2">
                  Start Time
                </label>

                <input
                  type="time"
                  name="startTime"
                  value={availabilityForm.startTime}
                  onChange={handleAvailabilityChange}
                  disabled={!availabilityForm.isAvailable}
                  required={availabilityForm.isAvailable}
                  className="w-full border rounded-md p-3 disabled:bg-gray-200"
                />
              </div>

              <div>
                <label className="block font-medium mb-2">
                  End Time
                </label>

                <input
                  type="time"
                  name="endTime"
                  value={availabilityForm.endTime}
                  onChange={handleAvailabilityChange}
                  disabled={!availabilityForm.isAvailable}
                  required={availabilityForm.isAvailable}
                  className="w-full border rounded-md p-3 disabled:bg-gray-200"
                />
              </div>

            </div>

            <label className="flex items-center gap-2 mt-5">
              <input
                type="checkbox"
                name="isAvailable"
                checked={availabilityForm.isAvailable}
                onChange={handleAvailabilityChange}
              />

              <span className="font-medium">
                Available on this day
              </span>
            </label>

            <button
              type="submit"
              disabled={availabilitySaving}
              className="mt-5 bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {availabilitySaving
                ? "Saving..."
                : "Save Availability"}
            </button>

          </form>

          {/* WEEKLY SCHEDULE */}

          <h4 className="font-bold text-lg mb-4">
            Your Weekly Schedule
          </h4>

          {availabilityLoading ? (
            <p className="text-gray-500">
              Loading availability...
            </p>
          ) : availability.length === 0 ? (
            <p className="text-gray-500">
              No availability configured yet.
            </p>
          ) : (

            <div className="space-y-3">

              {availability.map((day) => (

                <div
                  key={day._id || day.dayOfWeek}
                  className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-3"
                >

                  <div>
                    <p className="font-semibold">
                      {day.dayOfWeek}
                    </p>

                    <p className="text-sm text-gray-500">
                      {day.isAvailable
                        ? `${day.startTime} - ${day.endTime} | ${day.slotDuration} min slots`
                        : "Unavailable"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">

                    <span
                      className={`text-sm font-medium ${
                        day.isAvailable
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {day.isAvailable ? "Available" : "Unavailable"}
                    </span>

                    <button
                      type="button"
                      onClick={() => editAvailability(day)}
                      className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300"
                    >
                      Edit
                    </button>

                  </div>

                </div>

              ))}

            </div>
          )}

        </div>

        {/* ================================= */}
        {/* CUSTOMER BOOKINGS */}
        {/* ================================= */}

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
