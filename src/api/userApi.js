import client from "./client";

export const getAllHotels = () =>
  client.get("/api/users/hotels").then((r) => r.data);

export const searchByCity = (params) =>
  client.get("/api/users/search", { params }).then((r) => r.data);

export const createBooking = (payload) =>
  client.post("/api/users/booking/create", payload).then((r) => r.data);

export const confirmPayment = (payload) =>
  client.post("/api/users/booking/confirmBooking", payload).then((r) => r.data);

export const cancelBooking = (bookingId) =>
  client.put(`/api/users/booking/cancel/${bookingId}`).then((r) => r.data);

export const getMyBookings = () =>
  client.get("/api/users/booking/myBookings").then((r) => r.data);
