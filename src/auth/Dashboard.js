import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Key,
  LogOut,
  X,
  Car,
  Wrench,
  CreditCard,
  TestTube2,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Car as CarIcon,
  Settings,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react";
import API_BASE_URL from "../config/apiConfig";

function Dashboard() {
  const [name, setName] = useState("");
  const [greeting, setGreeting] = useState("");
  const [userData, setUserData] = useState({
    bookings: [],
    payments: [],
    testDrives: [],
    serviceBookings: [],
  });
  const [activeTab, setActiveTab] = useState("bookings");
  const [expandedItems, setExpandedItems] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const isStaff = localStorage.getItem("role") === "staff";

  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem("name");

    if (!storedName) {
      navigate("/Login");
    } else if (storedName.toLowerCase() === "admin") {
      navigate("/admin/dashboard");
    } else {
      setName(toTitleCase(storedName));
      setGreeting(getGreeting());
      fetchUserData();
    }

    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000);

    return () => clearInterval(interval);
  }, [navigate]);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const userId = localStorage.getItem("id");
      const userRole = localStorage.getItem("role"); // You need to save role when logging in.

      const bookingsURL =
        userRole === "staff"
          ? `${API_BASE_URL}/api/bookings`
          : `${API_BASE_URL}/api/bookings/uid?user_id=${userId}`;

      const paymentsURL =
        userRole === "staff"
          ? `${API_BASE_URL}/payments`
          : `${API_BASE_URL}/payments/userID?user_id=${userId}`;

      const testDrivesURL =
        userRole === "staff"
          ? `${API_BASE_URL}/api/listings/test-drives`
          : `${API_BASE_URL}/api/listings/test-drives/user/${userId}`;

      const serviceBookingsURL =
        userRole === "staff"
          ? `${API_BASE_URL}/api/bookings//ViewServiceBookings/:booking_id`
          : `${API_BASE_URL}/api/bookings/ViewServiceBookings/user/${userId}`;

      const [bookingsRes, paymentsRes, testDrivesRes, serviceBookingsRes] =
        await Promise.all([
          fetch(bookingsURL),
          fetch(paymentsURL),
          fetch(testDrivesURL),
          fetch(serviceBookingsURL),
        ]);

      const [bookings, payments, testDrives, serviceBookings] =
        await Promise.all([
          bookingsRes.ok ? bookingsRes.json() : [],
          paymentsRes.ok ? paymentsRes.json() : [],
          testDrivesRes.ok ? testDrivesRes.json() : [],
          serviceBookingsRes.ok ? serviceBookingsRes.json() : [],
        ]);

      setUserData({
        bookings: transformDecimalFields(bookings),
        payments: transformDecimalFields(payments),
        testDrives,
        serviceBookings,
      });
    } catch (err) {
      console.error("Error fetching user data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const transformDecimalFields = (data) => {
    return data.map((item) => {
      const transformed = { ...item };
      for (const key in transformed) {
        if (transformed[key]?.$numberDecimal) {
          transformed[key] = transformed[key].$numberDecimal;
        }
      }
      return transformed;
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatDateOnly = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const formatTimeOnly = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatCurrency = (amount) => {
    if (!amount) return "$0.00";
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(num);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const toTitleCase = (str) =>
    str ? str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()) : "";

  const toggleExpandItem = (type, id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [`${type}-${id}`]: !prev[`${type}-${id}`],
    }));
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        icon: <Clock className="w-3 h-3" />,
      },
      confirmed: {
        color: "bg-blue-100 text-blue-800",
        icon: <CheckCircle className="w-3 h-3" />,
      },
      completed: {
        color: "bg-green-100 text-green-800",
        icon: <CheckCircle className="w-3 h-3" />,
      },
      canceled: {
        color: "bg-red-100 text-red-800",
        icon: <X className="w-3 h-3" />,
      },
      cancelled: {
        color: "bg-red-100 text-red-800",
        icon: <X className="w-3 h-3" />,
      },
      paid: {
        color: "bg-green-100 text-green-800",
        icon: <CheckCircle className="w-3 h-3" />,
      },
      success: {
        color: "bg-green-100 text-green-800",
        icon: <CheckCircle className="w-3 h-3" />,
      },
      failed: {
        color: "bg-red-100 text-red-800",
        icon: <AlertCircle className="w-3 h-3" />,
      },
      refunded: {
        color: "bg-purple-100 text-purple-800",
        icon: <DollarSign className="w-3 h-3" />,
      },
      Pending: {
        color: "bg-yellow-100 text-yellow-800",
        icon: <Clock className="w-3 h-3" />,
      },
      Confirmed: {
        color: "bg-blue-100 text-blue-800",
        icon: <CheckCircle className="w-3 h-3" />,
      },
      Completed: {
        color: "bg-green-100 text-green-800",
        icon: <CheckCircle className="w-3 h-3" />,
      },
      Cancelled: {
        color: "bg-red-100 text-red-800",
        icon: <X className="w-3 h-3" />,
      },
    };

    const config = statusMap[status] || {
      color: "bg-gray-100 text-gray-800",
      icon: <Info className="w-3 h-3" />,
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${config.color}`}
      >
        {config.icon}
        {status}
      </span>
    );
  };

  const renderTabContent = () => {
    const data = userData[activeTab];

    if (isLoading) {
      return (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (!data || data.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">
            No {activeTab.replace(/([A-Z])/g, " $1").toLowerCase()} found
          </p>
          <p className="text-sm mt-2">
            You don't have any{" "}
            {activeTab.replace(/([A-Z])/g, " $1").toLowerCase()} yet
          </p>
        </div>
      );
    }

    switch (activeTab) {
      case "bookings":
        return data.map((booking) => (
          <div
            key={booking.booking_id}
            className="border border-gray-200 rounded-lg overflow-hidden mb-4"
          >
            <div
              className="p-4 bg-white hover:bg-gray-50 cursor-pointer flex justify-between items-center"
              onClick={() => toggleExpandItem("booking", booking.booking_id)}
            >
              <div className="flex items-center gap-3">
                <CarIcon className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium">Booking #{booking.booking_id}</p>
                  <p className="text-sm text-gray-500">
                    {formatDateOnly(booking.booking_start_date)} -{" "}
                    {formatDateOnly(booking.booking_end_date)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(booking.booking_status)}
                {expandedItems[`booking-${booking.booking_id}`] ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>

            {expandedItems[`booking-${booking.booking_id}`] && (
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Car ID</p>
                    <p className="font-medium">{booking.car_id}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Car Type</p>
                    <p className="font-medium">
                      {booking.carDetails?.carType || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Car Model</p>
                    <p className="font-medium">
                      {booking.carDetails?.model || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Fuel Type</p>
                    <p className="font-medium">
                      {booking.carDetails?.fuelType || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Start Date</p>
                    <p className="font-medium">
                      {formatDate(booking.booking_start_date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">End Date</p>
                    <p className="font-medium">
                      {formatDate(booking.booking_end_date)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Total Price</p>
                    <p className="font-medium">
                      {formatCurrency(booking.total_price)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Paid Amount</p>
                    <p className="font-medium">
                      {formatCurrency(booking.paid_price)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Booking Status</p>
                    <div className="mt-1">
                      {getStatusBadge(booking.booking_status)}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Payment Status</p>
                    <div className="mt-1">
                      {getStatusBadge(booking.payment_status)}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Purpose of booking</p>
                    <p className="font-bold ">{booking.purpose}</p>
                  </div>

                  {isStaff && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Booked By</p>
                        <p className="font-medium">
                          {booking.userDetails?.name || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">User Email</p>
                        <p className="font-medium">
                          {booking.userDetails?.email || "N/A"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {booking.transaction_id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">Transaction ID</p>
                    <p className="font-mono text-sm">
                      {booking.transaction_id}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ));

      case "payments":
        return data.map((payment) => (
          <div
            key={payment.transaction_id}
            className="border border-gray-200 rounded-lg overflow-hidden mb-4"
          >
            <div
              className="p-4 bg-white hover:bg-gray-50 cursor-pointer flex justify-between items-center"
              onClick={() =>
                toggleExpandItem("payment", payment.transaction_id)
              }
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium">
                    Payment #{payment.transaction_id}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(payment.date_of_payment)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(payment.payment_status)}
                {expandedItems[`payment-${payment.transaction_id}`] ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>

            {expandedItems[`payment-${payment.transaction_id}`] && (
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Amount</p>
                    <p className="font-medium">
                      {formatCurrency(payment.amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Method</p>
                    <p className="capitalize">
                      {payment.payment_method.replace("_", " ")}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="font-medium">
                      {formatDate(payment.date_of_payment)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <div className="mt-1">
                      {getStatusBadge(payment.payment_status)}
                    </div>
                  </div>
                </div>

                {/* ➡️ Only show this if staff */}
                {isStaff && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Payment By</p>
                      <p className="font-medium">
                        {payment.userDetails?.name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">User Email</p>
                      <p className="font-medium">
                        {payment.userDetails?.email || "N/A"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ));

      case "testDrives":
        return data.map((testDrive) => (
          <div
            key={testDrive.test_drive_id}
            className="border border-gray-200 rounded-lg overflow-hidden mb-4"
          >
            <div
              className="p-4 bg-white hover:bg-gray-50 cursor-pointer flex justify-between items-center"
              onClick={() =>
                toggleExpandItem("testDrive", testDrive.test_drive_id)
              }
            >
              <div className="flex items-center gap-3">
                <TestTube2 className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="font-medium">
                    Test Drive #{testDrive.test_drive_id}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDateOnly(testDrive.preferred_date)} at{" "}
                    {testDrive.preferred_time}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(testDrive.status)}
                {expandedItems[`testDrive-${testDrive.test_drive_id}`] ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>

            {expandedItems[`testDrive-${testDrive.test_drive_id}`] && (
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                {/* car and date info */}
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Car ID</p>
                    <p className="font-medium">{testDrive.car_id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Car Type</p>
                    <p className="font-medium">
                      {testDrive.carDetails?.carType}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Car Model</p>
                    <p className="font-medium">{testDrive.carDetails?.model}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <div className="mt-1">
                      {getStatusBadge(testDrive.status)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="font-medium">
                      {formatDateOnly(testDrive.preferred_date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Time</p>
                    <p className="font-medium">{testDrive.preferred_time}</p>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-xs text-gray-500">Location</p>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <p className="font-medium">
                      {testDrive.preferred_location}
                    </p>
                  </div>
                </div>

                {/* ➡️ Only show this if staff */}
                {isStaff && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">User Name</p>
                      <p className="font-medium">
                        {testDrive.userDetails?.name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">User Email</p>
                      <p className="font-medium">
                        {testDrive.userDetails?.email || "N/A"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ));

      case "serviceBookings":
        return data.map((service) => (
          <div
            key={service._id}
            className="border border-gray-200 rounded-lg overflow-hidden mb-4"
          >
            <div
              className="p-4 bg-white hover:bg-gray-50 cursor-pointer flex justify-between items-center"
              onClick={() => toggleExpandItem("service", service._id)}
            >
              <div className="flex items-center gap-3">
                <Wrench className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="font-medium">{service.serviceType}</p>
                  <p className="text-sm text-gray-500">
                    {formatDateOnly(service.preferredDate)} at{" "}
                    {service.preferredTime}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge(service.status)}
                {expandedItems[`service-${service._id}`] ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>

            {expandedItems[`service-${service._id}`] && (
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Vehicle</p>
                    <p className="font-medium">
                      {service.vehicleBrand} {service.vehicleModel}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">License Plate</p>
                    <p className="font-mono">{service.licensePlate}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="font-medium">
                      {formatDateOnly(service.preferredDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Time</p>
                    <p className="font-medium">{service.preferredTime}</p>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-xs text-gray-500">Service Type</p>
                  <p className="font-medium">{service.serviceType}</p>
                </div>

                {service.additionalNotes && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500">Additional Notes</p>
                    <p className="text-sm">{service.additionalNotes}</p>
                  </div>
                )}

                {/* Show User Details only for Staff */}
                {isStaff && (
                  <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Booked By</p>
                      <p className="font-medium">
                        {service.userDetails?.name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">User Email</p>
                      <p className="font-medium">
                        {service.userDetails?.email || "N/A"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ));

      default:
        return null;
    }
  };
  const logout = () => {
    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();

    window.location.href = "/Login";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {greeting}, {name}
            </h1>
            <p className="text-gray-600">
              Here's an overview of your activities
            </p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1 space-y-4">
            <Link
              to="/Profile"
              className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <User className="w-5 h-5 text-blue-500" />
              <span className="font-medium">My Profile</span>
            </Link>

            <Link
              to="/ChangePassword"
              className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <Key className="w-5 h-5 text-green-500" />
              <span className="font-medium">Change Password</span>
            </Link>

            {/* Quick Stats */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-medium mb-3">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500"> Bookings</span>
                  <span className="font-medium">
                    {userData.bookings.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Test Drives Bookings
                  </span>
                  <span className="font-medium">
                    {userData.testDrives.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Servicing</span>
                  <span className="font-medium">
                    {userData.serviceBookings.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Panel */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab("bookings")}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center gap-2 ${
                      activeTab === "bookings"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Car className="w-4 h-4" />
                    Bookings
                  </button>
                  <button
                    onClick={() => setActiveTab("payments")}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center gap-2 ${
                      activeTab === "payments"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    Payments
                  </button>
                  <button
                    onClick={() => setActiveTab("testDrives")}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center gap-2 ${
                      activeTab === "testDrives"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <TestTube2 className="w-4 h-4" />
                    Test Drive Bookings
                  </button>
                  <button
                    onClick={() => setActiveTab("serviceBookings")}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center gap-2 ${
                      activeTab === "serviceBookings"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    Servicing
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-4">{renderTabContent()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
