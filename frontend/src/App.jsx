import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./components/AuthContext";
import ProtectedRoute from "./components/ProtectedRoutes";

import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import Services from "./pages/services";
import ServiceDetails from "./pages/serviceDetails";
import MyBookings from "./pages/myBookings";
import VendorDashboard from "./pages/vendorDashboard";
import AdminDashboard from "./pages/adminDashboard";
import VendorApproval from "./pages/vendor-Approval";
import Booking from "./pages/Booking";
import Profile from "./pages/profile";
import Payment from "./pages/payment";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/services" element={<Services />} />

          <Route
            path="/service-details/:serviceId"
            element={<ServiceDetails />}
          />

          <Route
            path="/booking/:serviceId"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <Booking />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute allowedRoles={["customer", "vendor"]}>
                <MyBookings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/vendor-dashboard"
            element={
              <ProtectedRoute allowedRoles={["vendor"]}>
                <VendorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/vendor-approval"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <VendorApproval />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["customer", "vendor", "admin"]}>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <Payment />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

