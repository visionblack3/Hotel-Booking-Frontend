import client from "./client";

export const createHotel = (payload) =>
  client.post("/api/admin/hotel/add", payload).then((r) => r.data);

export const updateHotel = (hotelId, payload) =>
  client.put(`/api/admin/hotel/update/${hotelId}`, payload).then((r) => r.data);

export const deleteHotel = (hotelId) =>
  client.delete(`/api/admin/hotel/delete/${hotelId}`).then((r) => r.data);

export const createRoom = (payload) =>
  client.post("/api/admin/room/add", payload).then((r) => r.data);

export const deleteRoom = (hotelId, roomNo) =>
  client.delete(`/api/admin/room/${hotelId}/${roomNo}`).then((r) => r.data);

export const getHotelDashboard = (hotelId) =>
  client.get(`/api/admin/hotel/${hotelId}/dashboard`).then((r) => r.data);

export const getHotelStats = (hotelId) =>
  client.get(`/api/admin/hotel/${hotelId}/stats`).then((r) => r.data);

export const getHotelBookings = (hotelId) =>
  client.get(`/api/admin/hotel/${hotelId}/bookings`).then((r) => r.data);

export const getHotelGuests = (hotelId) =>
  client.get(`/api/admin/hotel/${hotelId}/guests`).then((r) => r.data);

export const getHotelPayments = (hotelId) =>
  client.get(`/api/admin/hotel/${hotelId}/payments`).then((r) => r.data);
