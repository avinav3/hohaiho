import React, { useMemo, useState } from "react";
import {
  Bell,
  CheckCircle2,
  Car,
  CalendarDays,
  CreditCard,
  Wrench,
  ShieldCheck,
  Trash2,
  ArrowLeft,
  Filter,
  Clock3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const initialNotifications = [
  {
    id: 1,
    title: "Booking Confirmed",
    message:
      "Your booking for Toyota Land Cruiser has been confirmed successfully.",
    time: "2 min ago",
    category: "booking",
    unread: true,
  },
  {
    id: 2,
    title: "Payment Successful",
    message: "Your payment of NPR 15,000 for car rental has been received.",
    time: "10 min ago",
    category: "payment",
    unread: true,
  },
  {
    id: 3,
    title: "Service Appointment Reminder",
    message:
      "Your vehicle servicing appointment is scheduled for tomorrow at 10:00 AM.",
    time: "1 hour ago",
    category: "service",
    unread: false,
  },
  {
    id: 4,
    title: "New Car Listed",
    message: "A new Hyundai Creta has been added to the RENTGO marketplace.",
    time: "3 hours ago",
    category: "car",
    unread: false,
  },
  {
    id: 5,
    title: "Booking Cancelled",
    message:
      "Your booking request for Mahindra Scorpio was cancelled by the owner.",
    time: "Yesterday",
    category: "booking",
    unread: true,
  },
  {
    id: 6,
    title: "Security Alert",
    message:
      "A new login to your RENTGO account was detected from a new device.",
    time: "Yesterday",
    category: "system",
    unread: false,
  },
];

function NotificationIcon({ category }) {
  const iconClass = "w-5 h-5";

  switch (category) {
    case "booking":
      return <CalendarDays className={iconClass} />;
    case "payment":
      return <CreditCard className={iconClass} />;
    case "service":
      return <Wrench className={iconClass} />;
    case "car":
      return <Car className={iconClass} />;
    case "system":
      return <ShieldCheck className={iconClass} />;
    default:
      return <Bell className={iconClass} />;
  }
}

export default function NotificationPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeFilter, setActiveFilter] = useState("all");

  const unreadCount = useMemo(
    () => notifications.filter((item) => item.unread).length,
    [notifications],
  );

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "all") return notifications;
    if (activeFilter === "unread") {
      return notifications.filter((item) => item.unread);
    }
    return notifications.filter((item) => item.category === activeFilter);
  }, [notifications, activeFilter]);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, unread: false } : item)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((item) => ({ ...item, unread: false })),
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  const filters = [
    { key: "all", label: "All" },
    { key: "unread", label: "Unread" },
    { key: "booking", label: "Bookings" },
    { key: "payment", label: "Payments" },
    { key: "service", label: "Service" },
    { key: "car", label: "Cars" },
    { key: "system", label: "System" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="p-2 rounded-full bg-white dark:bg-gray-900 shadow hover:scale-105 transition"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-white" />
            </button>

            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Bell className="w-7 h-7" />
                Notifications
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Stay updated with your bookings, payments, services, and account
                activity.
              </p>
            </div>
          </div>

          <button
            onClick={markAllAsRead}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-black text-white dark:bg-white dark:text-black px-5 py-3 text-sm font-semibold hover:opacity-90 transition"
          >
            <CheckCircle2 className="w-4 h-4" />
            Mark all as read
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-5 border border-gray-100 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Notifications
            </p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {notifications.length}
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-5 border border-gray-100 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">Unread</p>
            <h2 className="text-3xl font-bold text-red-500 mt-2">
              {unreadCount}
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-5 border border-gray-100 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {unreadCount > 0 ? "Needs Attention" : "All Clear"}
            </h2>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow border border-gray-100 dark:border-gray-800 p-4 mb-6">
          <div className="flex items-center gap-2 mb-4 text-gray-700 dark:text-gray-300 font-semibold">
            <Filter className="w-4 h-4" />
            Filter Notifications
          </div>

          <div className="flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  activeFilter === filter.key
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((item) => (
              <div
                key={item.id}
                className={`rounded-2xl shadow border p-5 transition hover:shadow-md ${
                  item.unread
                    ? "bg-white dark:bg-gray-900 border-l-4 border-l-red-500 border-t-gray-100 border-r-gray-100 border-b-gray-100 dark:border-t-gray-800 dark:border-r-gray-800 dark:border-b-gray-800"
                    : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        item.unread
                          ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                    >
                      <NotificationIcon category={item.category} />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {item.title}
                        </h3>
                        {item.unread && (
                          <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 font-medium">
                            New
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                        {item.message}
                      </p>

                      <div className="flex items-center gap-2 mt-3 text-xs text-gray-500 dark:text-gray-400">
                        <Clock3 className="w-4 h-4" />
                        {item.time}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 md:flex-col md:items-end">
                    {item.unread && (
                      <button
                        onClick={() => markAsRead(item.id)}
                        className="px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition"
                      >
                        Mark Read
                      </button>
                    )}

                    <button
                      onClick={() => deleteNotification(item.id)}
                      className="px-4 py-2 rounded-xl bg-red-100 text-red-600 text-sm font-medium hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 transition inline-flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow border border-gray-100 dark:border-gray-800 p-12 text-center">
              <Bell className="w-14 h-14 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                No notifications found
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                There are no notifications in this category right now.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
