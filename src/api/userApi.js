import client from "./client";

export const getAllHotels = () =>
  client.get("/users/hotels").then((r) => r.data);

export const searchByCity = (params) =>
  client.get("/users/search", { params }).then((r) => r.data);

export const createBooking = (payload) =>
  client.post("/users/booking/create", payload).then((r) => r.data);

export const confirmPayment = (payload) =>
  client.post("/users/booking/confirmBooking", payload).then((r) => r.data);

export const cancelBooking = (bookingId) =>
  client.put(`/users/booking/cancel/${bookingId}`).then((r) => r.data);

export const getMyBookings = () =>
  client.get("/users/booking/myBookings").then((r) => r.data);
