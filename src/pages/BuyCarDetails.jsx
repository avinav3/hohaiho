import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ChevronRight,
  Heart,
  Share2,
  ChevronLeft,
  Maximize,
  Check,
  CircleAlert,
  CheckCircle2,
  Clock,
  DollarSign,
  Shield,
  Truck,
  CheckCircle,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import API_BASE_URL from "../config/apiConfig";

export default function CarDetails() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [downPayment, setDownPayment] = useState(5000);
  const [loanTerm, setLoanTerm] = useState(60);
  const [interestRate, setInterestRate] = useState(3.5);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCarDetails = async () => {
      // 👇 ADD this check first
      if (isNaN(id)) {
        navigate("/");
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/listings/listings/${id}`
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        if (!data) throw new Error("No data received");

        // ✅ Same rest of your code
        let parsedExtraFeatures = {};
        if (typeof data.extraFeatures === "string") {
          try {
            parsedExtraFeatures = JSON.parse(data.extraFeatures);
          } catch (e) {
            console.error("Failed to parse extraFeatures:", e);
            parsedExtraFeatures = {};
          }
        } else {
          parsedExtraFeatures = data.extraFeatures || {};
        }

        const transformedCar = {
          id: data.listing_id,
          make: data.make || "NA",
          location: data.location || "NA",
          model: data.model || "NA",
          year: data.year || new Date().getFullYear(),
          price: data.price?.$numberDecimal
            ? parseFloat(data.price.$numberDecimal)
            : 0,
          mileage: data.mileage || 0,
          carType: data.carType || "NA",
          images:
            data.images && data.images.length > 0
              ? data.images.map((image) => `${API_BASE_URL}${image.url}`)
              : ["/placeholder-car-image.jpg"],
          engine: data.engine || "NA",
          transmission: data.transmission || "NA",
          fuelType: data.fuelType || "NA",
          seatingCapacity: data.seatingCapacity || "NA",
          exteriorColor: data.exteriorColor || "NA",
          interiorColor: data.interiorColor || "NA",
          certificationReport: data.certificationReport || "NA",
          extraFeatures: {
            gps: parsedExtraFeatures.gps || false,
            sunroof: parsedExtraFeatures.sunroof || false,
            leatherSeats: parsedExtraFeatures.leatherSeats || false,
            backupCamera: parsedExtraFeatures.backupCamera || false,
          },
        };

        setCar(transformedCar);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCarDetails();

    if (id) {
      sessionStorage.setItem("currentListingId", id);
    }
  }, [id]);

  const handleProceedToPayment = (carId) => {
    const userId = localStorage.getItem("id");
    if (!userId) {
      toast.error("You need to login to pay.");
    } else {
      localStorage.setItem("paymentPurpose", "buy"); // <-- 👈 Set purpose here
      navigate(`/payment/${car.id}`);
    }
  };

  const calculateMonthlyPayment = () => {
    if (!car) return "0";
    const principal = car.price - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm;
    const monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    return monthlyPayment.toFixed(2);
  };

  const taxRate = 0.08;
  const registrationFee = 300;

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading car details...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        <p>Error: {error}</p>
      </div>
    );

  if (!car)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Car not found</p>
      </div>
    );

  const totalCost = car.price + car.price * taxRate + registrationFee;

  const toggleBreakdown = () => {
    setShowBreakdown(!showBreakdown);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: document.title,
          url: window.location.href,
        })
        .catch((error) => console.error("Error sharing:", error));
    } else {
      // Fallback for browsers that do not support the Share API
      const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        window.location.href
      )}&text=${encodeURIComponent(document.title)}`;
      window.open(shareUrl, "_blank");
    }
  };

  const handleScheduleTestDrive = async (e) => {
    e.preventDefault();

    const form = e.target;
    const date = form.date.value;
    const time = form.time.value;
    const location = form.location.value;

    const userId = localStorage.getItem("id");

    if (!userId) {
      alert("You need to login first to schedule a test drive.");
      return; // Stop further execution
    }

    const requestBody = { date, time, location, user_id: userId };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/listings/test-drives/schedule/${id}`,
        requestBody
      );

      console.log("Test drive response:", response.data);
      alert(response.data.message || "Test drive scheduled successfully!");

      form.reset(); // Reset the form after successful submission
    } catch (error) {
      console.error("Error scheduling test drive:", error);
      alert(error.response?.data?.error || "Failed to schedule test drive.");
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 flex justify-center">
      <main className="container max-w-[88%] px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <nav
            className="flex text-sm text-gray-600 dark:text-gray-400"
            aria-label="Breadcrumb"
          >
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <a
                  href="/"
                  className="hover:text-gray-900 dark:hover:text-gray-200"
                >
                  Home
                </a>
              </li>
              <ChevronRight className="w-4 h-4 mx-1" />
              <li className="inline-flex items-center">
                <a
                  href="/buy"
                  className="hover:text-gray-900 dark:hover:text-gray-200"
                >
                  Buy
                </a>
              </li>
              <ChevronRight className="w-4 h-4 mx-1" />
              <li>
                <span className="text-gray-400 dark:text-gray-500">
                  {car.make}
                </span>
              </li>
              <ChevronRight className="w-4 h-4 mx-1" />
              <li>
                <span className="text-black dark:text-gray-100 font-semibold">
                  {car.model}
                </span>
              </li>
            </ol>
          </nav>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
          <div className="p-8 space-y-12">
            <div className="flex justify-between items-center">
              <h1 className="text-5xl font-bold text-primary dark:text-gray-100">
                {car.year} {car.make} {car.model}
              </h1>
              <div className="flex space-x-4">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition duration-300 transform hover:scale-110"
                >
                  <Heart
                    className={`w-8 h-8 ${
                      isWishlisted ? "text-red-500 fill-current" : ""
                    }`}
                  />
                </button>
                <button
                  className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition duration-300 transform hover:scale-110"
                  onClick={handleShare}
                >
                  <Share2 className="w-8 h-8" />
                </button>
              </div>
            </div>

            <div className="space-y-4 justify-center">
              {/* Main Image Viewer */}
              <div className="flex justify-center items-center w-full px-4">
                <div className="relative aspect-video w-full max-w-4xl rounded-3xl overflow-hidden">
                  <div className="relative w-full h-full">
                    <img
                      alt={`Car ${car.make} ${car.model}`}
                      src={car.images[currentImageIndex]}
                      className="absolute inset-0 w-full h-full object-contain rounded-2xl"
                    />
                    {car.images.length > 1 && (
                      <>
                        <button
                          onClick={() =>
                            setCurrentImageIndex(
                              (prev) =>
                                (prev - 1 + car.images.length) %
                                car.images.length
                            )
                          }
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition duration-300"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={() =>
                            setCurrentImageIndex(
                              (prev) => (prev + 1) % car.images.length
                            )
                          }
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition duration-300"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="flex justify-center mt-4">
                <div className="grid grid-cols-4 gap-4 w-full max-w-xl">
                  {car.images.slice(0, 4).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative aspect-video rounded-xl overflow-hidden transition duration-300 ${
                        index === currentImageIndex
                          ? "ring-4 ring-primary dark:ring-primary-dark"
                          : "hover:opacity-75"
                      }`}
                    >
                      <img
                        alt={`Car ${car.make} ${car.model} - View ${index + 1}`}
                        src={image}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-12">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-3xl p-8">
                  <h2 className="text-3xl font-bold mb-6 text-primary dark:text-gray-100">
                    Vehicle Specifications
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { label: "Make", value: car.make },
                      { label: "Model", value: car.model },
                      { label: "Year", value: car.year },
                      { label: "Location", value: car.location },
                      {
                        label: "Mileage",
                        value: `${car.mileage.toLocaleString()} miles`,
                      },
                      { label: "Engine", value: car.engine },
                      { label: "Transmission", value: car.transmission },
                      { label: "Fuel Type", value: car.fuelType },
                      { label: "Seating Capacity", value: car.seatingCapacity },
                      { label: "Exterior Color", value: car.exteriorColor },
                      { label: "Interior Color", value: car.interiorColor },
                      { label: "Car Type", value: car.carType },
                    ].map((spec, index) => (
                      <div key={index} className="flex flex-col">
                        <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          {spec.label}
                        </span>
                        <span className="font-medium text-lg dark:text-gray-200">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                    {car.extraFeatures && (
                      <div className="mt-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          Extra Features:
                        </span>
                        <ul className="list-disc list-inside">
                          {Object.entries(car.extraFeatures)
                            .filter(
                              ([_, value]) => value === true || value === "true"
                            )
                            .map(([key]) => (
                              <li
                                key={key}
                                className="font-medium text-lg dark:text-gray-200"
                              >
                                {key
                                  .replace(/([A-Z])/g, " $1")
                                  .replace(/^./, (str) => str.toUpperCase())}
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-3xl p-8">
                  <h2 className="text-3xl font-bold mb-6 text-primary dark:text-gray-100">
                    Vehicle Overview
                  </h2>
                  <div className="space-y-6">
                    {[
                      {
                        icon: CircleAlert,
                        title: "Ownership",
                        description: "Brand new vehicle – no previous owners",
                      },
                      {
                        icon: CheckCircle2,
                        title: "Accident History",
                        description: "No accidents – fresh from manufacturer",
                      },
                      {
                        icon: CheckCircle2,
                        title: "Service Records",
                        description:
                          "Factory-verified pre-delivery inspection completed",
                      },
                      {
                        icon: Clock,
                        title: "Showroom Arrival",
                        description: "Just arrived this week",
                      },
                    ].map((item, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <item.icon className="w-8 h-8 text-accent dark:text-accent-dark" />
                        <div>
                          <h3 className="font-semibold text-lg dark:text-gray-200">
                            {item.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-3xl p-8">
                  <h2 className="text-3xl font-bold mb-6 text-primary dark:text-gray-100">
                    Condition Summary
                  </h2>
                  <div className="flex items-center mb-4">
                    <CheckCircle className="w-6 h-6 text-green-500 dark:text-green-400 mr-2" />
                    <span className="font-semibold text-2xl dark:text-gray-200">
                      Brand New Condition
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg">
                    This showroom vehicle is in pristine, brand-new condition.
                    It meets all manufacturer standards and is ready for
                    immediate delivery.
                  </p>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 text-lg font-medium">
                    <li>Zero mileage</li>
                    <li>No prior ownership</li>
                    <li>Manufacturer warranty included</li>
                    <li>Full factory inspection completed</li>
                    <li>Ready for registration and delivery</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-8">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-3xl p-8">
                  <h2 className="text-3xl font-bold mb-6 text-primary dark:text-gray-100">
                    Pricing
                  </h2>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-600 rounded-2xl p-6 shadow-md">
                      <p className="text-4xl font-bold text-primary dark:text-gray-100">
                        ₹{car.price.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Starting at ₹{calculateMonthlyPayment()}/month with ₹
                        {downPayment.toLocaleString()} down for {loanTerm}{" "}
                        months
                      </p>
                      <button
                        onClick={toggleBreakdown}
                        className="text-lg font-bold text-primary dark:text-primary-dark underline mt-4"
                      >
                        {showBreakdown
                          ? "Hide Pricing Breakdown"
                          : "Show Pricing Breakdown"}
                      </button>
                      {showBreakdown && (
                        <div className="mt-4 text-base">
                          <p>
                            <strong>Base Price:</strong> ₹
                            {car.price.toLocaleString()}
                          </p>
                          <p>
                            <strong>Taxes (8%):</strong> ₹{car.price * 0.08}
                          </p>
                          <p>
                            <strong>Registration Fee:</strong> ₹300
                          </p>
                          <p>
                            {/* <strong>Total:</strong> ₹{car.price + car.price * 0.08 + 300} */}
                            <strong>Total:</strong> ₹{totalCost}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <button
                        onClick={() => handleProceedToPayment(car.id)}
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-white bg-black dark:bg-gray-200 dark:text-gray-800 hover:bg-primary/90 dark:hover:bg-gray-300 h-10 px-4 py-2 w-full btn-primary"
                      >
                        <DollarSign className="w-5 h-5 mr-2" />
                        Proceed to Payment
                      </button>

                      <Link to="/contact" className="block">
                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background dark:bg-gray-700 hover:bg-accent hover:text-accent-foreground dark:hover:bg-gray-600 h-10 px-4 py-2 w-full btn-secondary">
                          Contact Us
                        </button>
                      </Link>
                    </div>
                    <div className="pt-6 border-t border-gray-200 dark:border-gray-600 space-y-4">
                      <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                        <Shield className="w-5 h-5 text-secondary dark:text-secondary-dark" />
                        <span>30-day money-back guarantee</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                        <Truck className="w-5 h-5 text-secondary dark:text-secondary-dark" />
                        <span>Free delivery within 50km</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h2 className="text-2xl font-semibold mb-4 dark:text-gray-100">
                    Schedule a Test Drive
                  </h2>
                  <form
                    onSubmit={handleScheduleTestDrive}
                    autoComplete="off"
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="date"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Preferred Date
                        </label>
                        <input
                          className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-gray-600 dark:text-gray-100 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          id="date"
                          type="date"
                          name="date"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="time"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Preferred Time
                        </label>
                        <select
                          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background dark:bg-gray-600 dark:text-gray-100 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          id="time"
                          name="time"
                        >
                          <option value="">Select a time slot</option>
                          <option value="morning">Morning (9AM - 12PM)</option>
                          <option value="afternoon">
                            Afternoon (12PM - 3PM)
                          </option>
                          <option value="evening">Evening (3PM - 6PM)</option>
                        </select>
                      </div>
                    </div>
                    <input
                      name="location"
                      type="text"
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background dark:bg-gray-600 dark:text-gray-100 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter your location"
                      required
                    />
                    <button
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-black text-white dark:bg-white dark:text-primary-foreground-dark hover:bg-primary/90 dark:hover:bg-primary-dark/90 h-10 px-4 py-2 w-full"
                      type="submit"
                    >
                      Schedule Test Drive
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
