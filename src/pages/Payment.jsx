import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CreditCard,
  DollarSignIcon as PaypalLogo,
  Smartphone,
} from "lucide-react";
import API_BASE_URL from "../config/apiConfig";

export default function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    name: "",
    email: "",
    paypalEmail: "",
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [carPrice, setCarPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCarPrice = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/listings/listings/${id}`
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        if (data && data.price?.$numberDecimal) {
          const price = parseFloat(data.price.$numberDecimal);
          setCarPrice(price);
        } else {
          throw new Error("Invalid price data");
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCarPrice();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        <p>Error: {error}</p>
      </div>
    );

  if (!carPrice)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Car not found or price unavailable</p>
      </div>
    );

  const taxRate = 0.08;
  const totalPrice = carPrice + carPrice * taxRate + 300;
  const bookingPrice = (totalPrice.toFixed(2) * 25) / 100;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (paymentMethod === "credit") {
      if (!/^\d{16}$/.test(formData.cardNumber)) {
        newErrors.cardNumber = "Invalid card number";
      }
      if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = "Invalid expiry date (MM/YY)";
      }
      if (!/^\d{3}$/.test(formData.cvv)) {
        newErrors.cvv = "Invalid CVV";
      }
      if (formData.name.trim().length < 3) {
        newErrors.name = "Name is required";
      }
    } else if (paymentMethod === "paypal") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.paypalEmail)) {
        newErrors.paypalEmail = "Invalid email address";
      }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const userId = localStorage.getItem("id");
  const purpose = localStorage.getItem("paymentPurpose") || "buy";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsProcessing(true);
      setTimeout(async () => {
        const paymentMethodMapping = {
          credit: "credit_card",
          paypal: "paypal",
        };

        const mappedPaymentMethod = paymentMethodMapping[paymentMethod];

        const payload = {
          user_id: String(userId),
          transaction_id: `TR${Date.now()}`,
          amount: bookingPrice,
          payment_method: mappedPaymentMethod,
          payment_status: "success",
          formData,
        };

        try {
          // Make payment API call
          const response = await fetch(`${API_BASE_URL}/payments`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          const data = await response.json();

          if (response.ok) {
            // Update car status to "sold"
            const carStatusResponse = await fetch(
              `${API_BASE_URL}/api/listings/listings/${id}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ listing_status: "sold" }),
              }
            );

            if (carStatusResponse.ok) {
              // Create booking record in the booking collection
              const bookingPayload = {
                listing_id: id,
                user_id: String(userId),
                car_id: Number(id), // Using the ID from URL params
                transaction_id: payload.transaction_id, // Using the same transaction ID
                booking_start_date: new Date().toISOString(),
                booking_end_date: new Date().toISOString(),
                total_price: totalPrice.toFixed(2),
                paid_price: bookingPrice.toFixed(2),
                booking_status: "confirmed",
                payment_status: "paid",
                purpose,
              };

              const bookingResponse = await fetch(
                `${API_BASE_URL}/api/bookings/`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(bookingPayload),
                }
              );

              if (bookingResponse.ok) {
                // Remove the 'paymentPurpose' from localStorage after successful booking
                localStorage.removeItem("paymentPurpose");

                setStep(2);
              } else {
                console.error("Failed to create booking record");
                alert("Payment succeeded, but booking record creation failed.");
              }
            } else {
              console.error("Failed to update car status");
              alert("Payment succeeded, but car status update failed.");
            }
          } else {
            console.error("Payment failed:", data);
            alert(`Payment failed: ${data.error}`);
          }
        } catch (error) {
          console.error("Network or processing error:", error);
          alert("An unexpected error occurred. Please try again later.");
        } finally {
          setIsProcessing(false);
        }
      }, 5000);
    }
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        {step === 1 ? (
          <div className="p-8">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Complete Your Booking
            </h1>
            <div className="text-center mb-8">
              <p className="text-4xl font-bold text-green-600">
                ₹{totalPrice.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Total Price (Including {(taxRate * 100).toFixed(0)}% tax)
              </p>
              <p className="text-2xl font-semibold text-black mt-4">
                ₹{bookingPrice.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Booking Amount (25% of total)
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center space-x-4 mb-6">
                {["credit", "paypal"].map((method) => (
                  <label
                    key={method}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={handlePaymentMethodChange}
                      className="form-radio text-green-600"
                    />
                    <span className="text-gray-700 capitalize">{method}</span>
                    {method === "credit" && (
                      <CreditCard className="w-5 h-5 text-gray-600" />
                    )}
                    {method === "paypal" && (
                      <PaypalLogo className="w-5 h-5 text-gray-600" />
                    )}
                  </label>
                ))}
              </div>

              {paymentMethod === "credit" && (
                <>
                  <div>
                    <label
                      htmlFor="cardNumber"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Card Number
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 1234 5678"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                    {errors.cardNumber && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.cardNumber}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="expiryDate"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                      {errors.expiryDate && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.expiryDate}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="cvv"
                        className="block text-sm font-medium text-gray-700"
                      >
                        CVV
                      </label>
                      <input
                        type="password"
                        id="cvv"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                      {errors.cvv && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.cvv}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>
                </>
              )}

              {paymentMethod === "paypal" && (
                <div>
                  <label
                    htmlFor="paypalEmail"
                    className="block text-sm font-medium text-gray-700"
                  >
                    PayPal Email
                  </label>
                  <input
                    type="email"
                    id="paypalEmail"
                    name="paypalEmail"
                    value={formData.paypalEmail}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                  {errors.paypalEmail && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.paypalEmail}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contact Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isProcessing
                    ? "bg-gray-400"
                    : "bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  "Confirm Payment"
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
              Thank You for Your Booking!
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              We will get back to you soon!
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Your payment of ₹{bookingPrice.toFixed(2)} has been successfully
              processed.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              We appreciate your business and hope you enjoy your new car! A
              confirmation email has been sent to your provided email address.
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Go to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
