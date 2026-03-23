import axios from "axios";
import React, { useState, useEffect } from "react";
import API_BASE_URL from "../config/apiConfig";

const ViewServiceBookings = () => {
  const [serviceBookings, setServiceBookings] = useState([]);

  useEffect(() => {
    const fetchServiceBookings = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/bookings/ViewServiceBookings/:booking_id`
        );
        console.log("Service Bookings:", response.data);
        setServiceBookings(response.data);
      } catch (error) {
        console.error("Error fetching service bookings:", error.message);
        console.error(
          "Error details:",
          error.response ? error.response.data : "No response data"
        );
      }
    };

    fetchServiceBookings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
        Service Bookings
      </h1>
      {serviceBookings.length === 0 ? (
        <p className="text-center text-gray-500">No bookings available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceBookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {booking.fullName}
              </h2>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Vehicle Model:</span>{" "}
                {booking.vehicleModel}
              </p>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">License Plate:</span>{" "}
                {booking.licensePlate}
              </p>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Preferred Date:</span>{" "}
                {new Date(booking.preferredDate).toLocaleDateString()}
              </p>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Preferred Time:</span>{" "}
                {booking.preferredTime}
              </p>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Service Type:</span>{" "}
                {booking.serviceType}
              </p>
              <p className="mt-4">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    booking.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : booking.status === "Confirmed"
                      ? "bg-green-100 text-green-800"
                      : booking.status === "Completed"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {booking.status}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewServiceBookings;
