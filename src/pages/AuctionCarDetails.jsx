import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config/apiConfig";

function AuctionCarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [message, setMessage] = useState("");
  const [highestBid, setHighestBid] = useState(null);
  const [auctionEndTime, setAuctionEndTime] = useState(null);

  useEffect(() => {
    const fetchCar = async () => {
      if (isNaN(id)) {
        navigate("/");
        return;
      }
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/listings/listings/${id}`
        );
        setCar(response.data);
        setAuctionEndTime(response.data.auctionEndTime);
      } catch (error) {
        console.error("Error fetching car:", error);
      }
    };
    const checkAuctionEnd = async () => {
      if (car?.auctionEndTime && new Date() > new Date(car.auctionEndTime)) {
        try {
          const response = await axios.post(
            `${API_BASE_URL}/api/bids/finalize-auction/${id}`
          );
          console.log("Auction finalized:", response.data);
          if (response.data.winner) {
            setCar((prev) => ({
              ...prev,
              winner: response.data.winner,
            }));
          }
        } catch (error) {
          console.error("Error finalizing auction:", error);
        }
      }
    };
    const fetchHighestBid = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/bids/highest/${id}`
        );
        setHighestBid(response.data.highestBid);
      } catch (error) {
        console.error("Error fetching highest bid:", error);
      }
    };

    fetchCar();
    fetchHighestBid();
    // Set interval for polling
    const interval = setInterval(fetchHighestBid, 5000); // every 5 seconds
    checkAuctionEnd(); // call this here
    return () => clearInterval(interval); // cleanup on unmount
  }, [id, car?.auctionEndTime, navigate]);

  const handleBid = async () => {
    const userId = localStorage.getItem("id");

    if (!userId) {
      setMessage("Please login to place a bid.");
      return;
    }

    if (!bidAmount || parseFloat(bidAmount) <= 0) {
      setMessage("Please enter a valid bid amount.");
      return;
    }

    if (
      parseFloat(bidAmount) <=
      parseFloat(highestBid || car?.price?.$numberDecimal)
    ) {
      setMessage(
        `Bid should be higher than ₹${parseFloat(
          highestBid || car?.price?.$numberDecimal || 0
        ).toLocaleString()}`
      );
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/bids/place`, {
        listing_id: id,
        user_id: userId,
        bidAmount: parseFloat(bidAmount),
      });

      // ✅ Update highest bid on UI
      setHighestBid(response.data.highestBid);

      setMessage("✅ Bid placed successfully!");
      setBidAmount("");
    } catch (error) {
      console.error("Error placing bid:", error);
      setMessage("❌ Failed to place bid.");
    }
  };

  if (!car) {
    return <p className="text-center mt-10">Loading car details...</p>;
  }

  const { make, model, fuelType, transmission, carType, price, images } = car;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="grid md:grid-cols-2 gap-10">
        <img
          src={
            images?.[0]?.url?.startsWith("http")
              ? images[0].url
              : `${API_BASE_URL}${images?.[0]?.url}`
          }
          alt={`${make} ${model}`}
          className="w-full h-96 object-cover rounded-xl shadow-md"
        />

        <div>
          <h1 className="text-3xl font-bold mb-4">
            {make} {model}
          </h1>
          <p className="text-gray-600 text-lg mb-2">
            {carType} • {transmission} • {fuelType}
          </p>
          <p className="text-xl font-semibold text-green-700 mb-2">
            Starting Price: ₹
            {parseFloat(price?.$numberDecimal || 0).toLocaleString()}
          </p>

          {auctionEndTime && new Date() > new Date(auctionEndTime) ? (
            car.winner?.user_id ? (
              <div className="mb-4 text-green-700 font-medium">
                🏁 Auction Ended
                <br />
                🚗 Sold to User ID: <strong>{car.winner.user_id.name}</strong>
                <br />
                💰 Winning Bid: ₹
                {parseFloat(car.winner.bidAmount).toLocaleString()}
              </div>
            ) : (
              <p className="text-red-600 mb-4">
                Auction Ended. No valid winner found.
              </p>
            )
          ) : (
            <p className="text-sm text-gray-600 mb-4">
              Auction Ends: {new Date(auctionEndTime).toLocaleString()}
            </p>
          )}
          {(new Date() < new Date(auctionEndTime) || !car.winner) &&
            (!highestBid || isNaN(parseFloat(highestBid)) ? (
              <p className="text-md font-medium text-gray-500 mb-2">
                No bids have been placed
              </p>
            ) : (
              <p className="text-md font-medium text-blue-700 mb-2">
                Current Highest Bid: ₹{parseFloat(highestBid).toLocaleString()}
              </p>
            ))}

          <div className="mt-6">
            <label className="block mb-1 font-medium">Your Bid (₹)</label>
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mb-3"
              placeholder="Enter bid amount"
              disabled={new Date() > new Date(auctionEndTime)}
            />
            <button
              onClick={handleBid}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
              disabled={new Date() > new Date(auctionEndTime)}
            >
              Place Bid
            </button>

            {message && <p className="mt-3 text-blue-600">{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuctionCarDetails;
