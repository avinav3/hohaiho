import React, { useState, useEffect } from "react";
import Home from "./main/Home";
import Login from "./auth/Login";
import Dashboard from "./auth/Dashboard";
import Signup from "./auth/Signup";
import ForgotPassword from "./auth/ForgotPassword";
import ChangePassword from "./auth/ChangePassword";
import Profile from "./auth/Profile";
import AboutUs from "./AboutUs";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Error from "./main/Error";
import Navbar from "./main/Navbar";
import Loader from "./main/Loader";
import CarExplore from "./pages/CarExplore";
import BuyCarDetails from "./pages/BuyCarDetails";
import RentCarDetails from "./pages/RentCarDetails";
import ListCar from "./pages/ListCar";
import Payment from "./pages/Payment";
import ComingSoon from "./ComingSoon";
import AuctionCarDetails from "./pages/AuctionCarDetails";
import AdminDashboard from "./admin/AdminDashboard";
import BookingManagement from "./admin/BookingManagement";
import CarManagement from "./admin/CarManagement";
import PaymentManagement from "./admin/PaymentManagement";
import UserManagement from "./admin/UserManagement";
import AdminLogin from "./admin/AdminLogin";
import ReportDesign from "./admin/ReportDesign";
import "./ScrollToTopButton.css";
import { ArrowBigUpDash } from "lucide-react";
import BookServicing from "./pages/BookServicing";
import ViewServiceBookings from "./pages/ViewServiceBookings";
import NotificationPage from "./pages/NotificationPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContactUs from "./ContactUs";
import PublicRoute from "./route/publicRoute";
import ProtectedRoute from "./route/protectedRoute";
import AdminRoute from "./route/adminRoute";

function App() {
  const [loading, setLoading] = useState(true);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const ConditionalNavbar = () => {
    const location = useLocation();

    const noNavbarRoutes = [
      "/AdminDashboard",
      "/CarManagement",
      "/BookingManagement",
      "/PaymentManagement",
      "/UserManagement",
      "/AdminLogin",
      "/ReportDesign",
      "/login",
      "/Login",
      "/signup",
      "/Signup",
      "/Error",
      "/CarExplore",
    ];

    return !noNavbarRoutes.includes(location.pathname) ? <Navbar /> : null;
  };

  useEffect(() => {
    const initialLoadTimeout = setTimeout(() => {
      setLoading(false);
    }, 2500);

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      setShowScrollToTop(scrollPosition > windowHeight * 0.4);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(initialLoadTimeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Router>
        {loading && <Loader />}
        <ConditionalNavbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/AboutUs" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/Contact" element={<ContactUs />} />
          <Route path="/ComingSoon" element={<ComingSoon />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />

          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/Signup" element={<Signup />} />
            <Route path="/AdminLogin" element={<AdminLogin />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/ChangePassword" element={<ChangePassword />} />
            <Route path="/CarExplore" element={<CarExplore />} />
            <Route path="/BuyCarDetails" element={<BuyCarDetails />} />
            <Route path="/RentCarDetails" element={<RentCarDetails />} />
            <Route path="/ListCar" element={<ListCar />} />
            <Route path="/BookServicing" element={<BookServicing />} />
            <Route
              path="/ViewServiceBookings"
              element={<ViewServiceBookings />}
            />
            <Route path="/Notification" element={<NotificationPage />} />
            <Route path="/auction-car/:id" element={<AuctionCarDetails />} />
            <Route path="/buy-car/:id" element={<BuyCarDetails />} />
            <Route path="/buy-car-details/:id" element={<BuyCarDetails />} />
            <Route path="/rent-car/:id" element={<RentCarDetails />} />
            <Route path="/payment/:id" element={<Payment />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/AdminDashboard" element={<AdminDashboard />} />
            <Route path="/CarManagement" element={<CarManagement />} />
            <Route path="/BookingManagement" element={<BookingManagement />} />
            <Route path="/PaymentManagement" element={<PaymentManagement />} />
            <Route path="/UserManagement" element={<UserManagement />} />
            <Route path="/ReportDesign" element={<ReportDesign />} />
          </Route>

          <Route path="/*" element={<Error />} />
        </Routes>
      </Router>

      {showScrollToTop && (
        <div className="scroll-to-top" onClick={scrollToTop}>
          <ArrowBigUpDash />
        </div>
      )}
    </>
  );
}

export default App;
