
import { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "https://bookease-ya30.onrender.com/api/v1/auth/me",
        { withCredentials: true }
      );

      setUser(response.data.user);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to fetch profile"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-5 py-12">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-sm">

        <div className="mb-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-3xl font-bold text-blue-600">
            {user?.username?.charAt(0)?.toUpperCase()}
          </div>

          <h1 className="mt-4 text-2xl font-bold text-gray-800">
            My Profile
          </h1>

          <p className="mt-1 text-gray-500">
            Manage your account information
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-500">
              Username
            </label>
            <p className="mt-1 rounded-lg bg-gray-50 p-3 text-gray-800">
              {user?.username || "Not available"}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">
              Email
            </label>
            <p className="mt-1 rounded-lg bg-gray-50 p-3 text-gray-800">
              {user?.email || "Not available"}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">
              Account Role
            </label>
            <p className="mt-1 rounded-lg bg-gray-50 p-3 capitalize text-gray-800">
              {user?.role || "Not available"}
            </p>
          </div>
        </div>

        <button
          onClick={fetchProfile}
          className="mt-8 w-full rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700"
        >
          Refresh Profile
        </button>

      </div>
    </div>
  );
}

export default Profile;
