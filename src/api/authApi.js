import client from "./client";

export const registerUser = (payload) =>
  client.post("/api/users/registerUser", payload).then((r) => r.data);

export const registerAdmin = (payload) =>
  client.post("/api/admin/registerAdmin", payload).then((r) => r.data);

export const login = (payload) =>
  client.post("/api/users/login", payload).then((r) => r.data);

export const getUserById = (id) =>
  client.get(`/api/users/${id}`).then((r) => r.data);
