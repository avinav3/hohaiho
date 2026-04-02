import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { getStoredUser } from "../utils/auth";

function ChangePassword() {
    const [mydata, setData] = useState({});
    const [id, setId] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = getStoredUser();
        const storedId = storedUser?.id || storedUser?.user_id || '';
        if (storedId) {
            setId(storedId);
        }
    }, []);

    const onChange = (event) => {
        setData((prevData) => ({
            ...prevData,
            [event.target.name]: event.target.value
        }));
    };

    const submitValue = (event) => {
        event.preventDefault();
        
        const data = {
            id: id,
            opass: mydata.password,
            npass: mydata.npassword,
            cpass: mydata.cpassword
        };

        api.post(`/change-password`, data)
		
        .then((response) => {
            if (response.data.flag === "1") {
                alert(response.data.message);
                navigate('/Dashboard', { replace: true });
            } else {
                alert(response.data.message);
            }
        })
        .catch((error) => {
            console.error('There was an error!', error);
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
        <div className="w-full max-w-md bg-white shadow-2xl rounded-lg">
          <form onSubmit={submitValue} className="space-y-6 p-8">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Change Password</h1>
            <input 
              type="text" 
              name="id" 
              placeholder="Enter ID" 
              value={id} 
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
            <input 
              type="password" 
              name="password" 
              placeholder="Enter Old Password" 
              onChange={onChange} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
            <input 
              type="password" 
              name="npassword" 
              placeholder="Enter New Password" 
              onChange={onChange} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
            <input 
              type="password" 
              name="cpassword" 
              placeholder="Enter Confirm Password" 
              onChange={onChange} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button 
              type="submit" 
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              Change Password
            </button>
          </form>
        </div>
      </div>
    );
}

export default ChangePassword;
