import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/tasks";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const getTasks = async () => {
  const { data } = await api.get("/");
  return data;
};

export const createTask = async (task) => {
  const { data } = await api.post("/", task);
  return data;
};

export const updateTask = async (id, task) => {
  const { data } = await api.put(`/${id}`, task);
  return data;
};

export const toggleTask = async (id) => {
  const { data } = await api.patch(`/${id}/toggle`);
  return data;
};

export const deleteTask = async (id) => {
  await api.delete(`/${id}`);
};
