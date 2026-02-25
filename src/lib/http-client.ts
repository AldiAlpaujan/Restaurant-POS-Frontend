import axios from "axios";
import authToken from "./auth-token";

const client = () => {
  return axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    headers: {
      Authorization: authToken.getToken() && `Bearer ${authToken.getToken()}`,
    },
  });
};

export const api = {
  // Auth
  login: "/login",
  logout: "/logout",
  profile: "/profile",

  // Tables
  getTables: "/tables",

  // Food Items
  getFoodItems: "/food-items",
  getFoodCategories: "/food-items/categories",
  createFoodItem: "/food-items",
  getFoodItemDetail: (id: number) => `/food-items/${id}`,
  updateFoodItem: (id: number) => `/food-items/${id}`,
  deleteFoodItem: (id: number) => `/food-items/${id}`,

  // Orders
  getOrders: "/orders",
  createOrder: "/orders",
  getOrderDetail: (id: number) => `/orders/${id}`,
  getOrderFromTable: (idTable: number) =>
    `/orders/${idTable}/get-detail-from-table`,
  closeOrder: (id: number) => `/orders/${id}/close`,
  getOrderReceipt: (id: number) => `/orders/${id}/receipt`,

  // Order Items
  addOrderItems: (id: number) => `/api/orders/${id}/items`,
};
export default client;
