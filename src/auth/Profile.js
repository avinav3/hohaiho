import axios from "axios";
import React, { useEffect, useState } from "react";
import API_BASE_URL from "./apiConfig";
import { User, Mail, Phone, Calendar, Clock, Edit, X } from "lucide-react";

function Profile() {
  const [mydata, setData] = useState({
    name: "",
    email: "",
    mobile: "",
    createdAt: "",
    lastLogin: "",
  });

  const [id, setId] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    const storedId = localStorage.getItem("id");

    if (storedId) {
      setId(storedId);

      axios
        .get(`${API_BASE_URL}/get-profile`, {
          params: { id: storedId },
        })
        .then((response) => {
          const userData = response.data;

          if (userData) {
            setData({
              name: userData.name || "",
              email: userData.email || "",
              mobile: userData.mobile || "",
              createdAt: formatDate(userData.createdAt),
              lastLogin: formatDate(userData.lastLogin),
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching profile data", error);
        });
    }
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const onChange = (event) => {
    setData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  };

  const submitValue = (event) => {
    event.preventDefault();

    const data = {
      id: id,
      name: mydata.name,
      email: mydata.email,
      mobile: mydata.mobile,
    };

    axios
      .post(`${API_BASE_URL}/update-profile`, data)
      .then((response) => {
        if (response.data.flag === "1") {
          localStorage.setItem("name", mydata.name);
          alert(response.data.message);
          setIsEditOpen(false);
        } else {
          alert(response.data.message);
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50 flex items-center justify-center p-6">
      {/* Profile Card */}
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-yellow-500 p-8 text-center text-white">
          <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={40} />
          </div>

          <h2 className="text-2xl font-bold">{mydata.name}</h2>
          <p className="opacity-90">{mydata.email}</p>
        </div>

        {/* Profile Info */}
        <div className="p-8 space-y-4">
          <div className="flex items-center gap-3 text-gray-700">
            <Phone size={18} className="text-amber-500" />
            <span>{mydata.mobile}</span>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <Calendar size={18} className="text-amber-500" />
            <span>Created: {mydata.createdAt}</span>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <Clock size={18} className="text-amber-500" />
            <span>Last Login: {mydata.lastLogin}</span>
          </div>

          {/* Edit Button */}
          <button
            onClick={() => setIsEditOpen(true)}
            className="mt-6 w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:scale-105 transition-all"
          >
            <Edit size={18} />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-[fadeIn_.3s]">
            <button
              onClick={() => setIsEditOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              <X />
            </button>

            <h3 className="text-xl font-bold mb-6 text-center">Edit Profile</h3>

            <form onSubmit={submitValue} className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={mydata.name}
                  onChange={onChange}
                  className="w-full pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-amber-400 outline-none"
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  name="email"
                  value={mydata.email}
                  onChange={onChange}
                  className="w-full pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-amber-400 outline-none"
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="number"
                  name="mobile"
                  value={mydata.mobile}
                  onChange={onChange}
                  className="w-full pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-amber-400 outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="w-full border rounded-lg py-2 hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="w-full bg-amber-500 text-white rounded-lg py-2 hover:bg-amber-600"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
