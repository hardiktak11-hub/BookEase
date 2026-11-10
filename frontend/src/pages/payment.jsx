
import { Link, useNavigate } from "react-router-dom";

function Payment() {
  const navigate = useNavigate();

  const booking = {
    service: "Home Cleaning",
    vendor: "Clean Home Services",
    date: "15 November 2026",
    time: "10:00 AM",
    amount: 499,
  };

  const handlePayment = () => {
    alert("Razorpay payment integration will be added later.");

    navigate("/my-bookings");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">
          BookEase
        </h1>

        <div className="flex gap-6">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>

          <Link to="/my-bookings" className="hover:text-blue-600">
            My Bookings
          </Link>
        </div>
      </nav>

      {/* Payment Content */}
      <div className="max-w-3xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-3xl font-bold mb-2">
            Complete Your Payment
          </h2>

          <p className="text-gray-600 mb-8">
            Review your booking details before proceeding.
          </p>

          {/* Booking Summary */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-blue-700 mb-4">
              Booking Summary
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Service</span>
                <span className="font-medium">
                  {booking.service}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Vendor</span>
                <span className="font-medium">
                  {booking.vendor}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Date</span>
                <span className="font-medium">
                  {booking.date}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Time</span>
                <span className="font-medium">
                  {booking.time}
                </span>
              </div>

              <div className="border-t pt-4 flex justify-between">
                <span className="text-lg font-bold">
                  Total Amount
                </span>

                <span className="text-2xl font-bold text-blue-600">
                  ₹{booking.amount}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <button
            onClick={handlePayment}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
          >
            Pay ₹{booking.amount}
          </button>

          <Link
            to="/my-bookings"
            className="block text-center mt-4 text-gray-600 hover:text-blue-600"
          >
            Cancel Payment
          </Link>

          <p className="text-center text-sm text-gray-500 mt-6">
            Secure payment integration powered by Razorpay will be added later.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Payment;
