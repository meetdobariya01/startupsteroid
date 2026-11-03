import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const createOrder = async () => {
  const { data } = await axios.post(`${API}/api/payment/create-order`, {
    amount: 1179882, // ₹11,798.82 in paise
    currency: "INR",
  });
  return data;
};

export const verifyPayment = async (payload) => {
  const { data } = await axios.post(
    `${API}/api/payment/verify-payment`,
    payload
  );
  return data;
};