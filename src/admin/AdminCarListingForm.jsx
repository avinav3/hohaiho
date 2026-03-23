import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config/apiConfig";

const AdminCarListingForm = () => {
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [formData, setFormData] = useState({
    listing_status: "active",
    user_id: "",
    owner: "",
    RentList: "Rent",
    make: "",
    model: "",
    year: "",
    mileage: "",
    price: "",
    location: "",
    condition: "Excellent",
    certified: false,
    engine: "",
    transmission: "",
    fuelType: "",
    seatingCapacity: "",
    interiorColor: "",
    exteriorColor: "",
    carType: "",
    vin: "",
    description: "",
    images: [],
  });
  const [selectedFile, setSelectedFile] = useState(null);

  // Handle form data input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file selection for images
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files);
  };

  // Handle form submission to add a new listing
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== "images") data.append(key, formData[key]);
    });

    if (selectedFile && selectedFile.length > 0) {
      for (let i = 0; i < selectedFile.length; i++) {
        data.append("images", selectedFile[i]);
      }
    } else {
      alert("At least one image is required.");
      return; // Prevent submission if no images are selected
    }

    try {
      await axios.post(`${API_BASE_URL}/api/listings/listings`, data); // Post to add a new listing
      alert("Listing added successfully!");

      // Optionally, clear the form after successful submission
      setFormData({
        listing_status: "active",
        RentList: "Rent",
        make: "",
        model: "",
        year: "",
        mileage: "",
        price: "",
        location: "",
        condition: "Excellent",
        certified: false,
        engine: "",
        transmission: "",
        fuelType: "",
        seatingCapacity: "",
        interiorColor: "",
        exteriorColor: "",
        carType: "",
        vin: "",
        description: "",
        images: [],
      });
      setSelectedFile(null); // Clear selected file
    } catch (error) {
      console.error("Error adding listing:", error.response || error.message);
      alert("Error adding listing");
    }
  };

  return (
    <div className="p-3 mx-auto">
      {/* Form */}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Listing Status */}
        <div className="mb-4">
          <label className="block text-gray-700">Listing Status</label>
          <select
            name="listing_status"
            value={formData.listing_status}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
          >
            <option value="active">Active</option>
            <option value="sold">Sold</option>
            <option value="rented">Rented</option>
            <option value="requested">Requested</option>
          </select>
        </div>

        {/* Rent or List */}
        <div className="mb-4">
          <label className="block text-gray-700">Rent or List</label>
          <select
            name="RentList"
            value={formData.RentList}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
          >
            <option value="Rent">Rent</option>
            <option value="List">List</option>
          </select>
        </div>

        {/* Make, Model, Year */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-gray-700">Make</label>
            <input
              type="text"
              name="make"
              value={formData.make}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Car make"
            />
          </div>
          <div>
            <label className="block text-gray-700">Model</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Car model"
            />
          </div>
          <div>
            <label className="block text-gray-700">Year</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Year"
            />
          </div>
        </div>

        {/* Mileage and Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700">Mileage</label>
            <input
              type="number"
              name="mileage"
              value={formData.mileage}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Mileage"
            />
          </div>
          <div>
            <label className="block text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Price"
            />
          </div>
        </div>

        {/* Images */}
        <div className="mb-4">
          <label className="block text-gray-700">Images</label>
          <input
            type="file"
            name="images"
            multiple
            onChange={handleFileChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Add Listing
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCarListingForm;
