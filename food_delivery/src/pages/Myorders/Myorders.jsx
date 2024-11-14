import React, { useContext, useEffect, useState } from 'react';
import './Myorders.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';

const Myorders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  const fetchOrders = async () => {
    try {
      const response = await axios.post(`${url}/api/order/userorders`, {}, { headers: { token } });
      setData(response.data.data);
      console.log("Order data:", response.data.data);
    } catch (error) {
      setError("Failed to fetch orders. Please try again later.");
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="container">
        {data.map((order,index)=>{
          return (
            <div key={index} className="my-orders-order">
              <img src={assets.parcel_icon} alt="" />
              <p>{order.items.map((item,index)=>{
                if(index===order.items.length-1){
                  return item.name+"x"+item.quantity;
                }
                else{
                  return item.name+"x"+item.quantity+",";
                }
              })}</p>
              <p>${order.amount}.00</p>
              <p>Items:{order.items.length}</p>
              <p><span>&#x25cf;</span> <b>{order.status}</b></p>
              <button onClick={fetchOrders}>Track Order</button>
            </div>
          )
        })}
      </div>
      {/* {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="order-list">
          {data.length > 0 ? (
            data.map((order) => (
              <div key={order._id} className="order-item">
                <p>Order ID: {order._id}</p>
                <p>Amount: ${order.amount}</p>
                <p>Items: {order.items.length}</p>
              </div>
            ))
          ) : (
            <p>No orders found.</p>
          )}
        </div>
      )} */}
      
    </div>
  );
};

export default Myorders;
