import React, { useContext, useEffect } from 'react';
import './Verify.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios'; // Ensure axios is imported
import { StoreContext } from '../../context/StoreContext';

const Verify = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const { url } = useContext(StoreContext);
  const navigate = useNavigate();

  // Log parameters to confirm they're available
  console.log("Success:", success);
  console.log("Order ID:", orderId);

  // Function to verify payment
  const verifyPayment = async () => {
    try {
      // Sending payment verification request to backend
      const response = await axios.post(url + '/api/order/verify', { success, orderId });
      console.log("Payment verification response:", response.data);

      if (response.data.success) {
        navigate('/myorders');  // Redirect to orders if success
      } else {
        navigate('/');  // Redirect to home if error
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      navigate('/');  // Redirect to home in case of error
    }
  };

  useEffect(() => {
    // Run payment verification on component mount
    verifyPayment();
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div className='verify'>
      <div className="spinner">
        {/* Add loading spinner or any other indication for verification */}
      </div>
    </div>
  );
}

export default Verify;
