import client from "./client";

export const registerUser = (payload) =>
  client.post("/users/registerUser", payload).then((r) => r.data);

export const registerAdmin = (payload) =>
  client.post("/admin/registerAdmin", payload).then((r) => r.data);

export const login = (payload) =>
  client.post("/users/login", payload).then((r) => r.data);

export const getUserById = (id) =>
  client.get(`/users/${id}`).then((r) => r.data);
