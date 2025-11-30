import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  login: (data) => API.post("/auth/login", data),
  signup: (data) => API.post("/auth/signup", data),
};

export const boardsAPI = {
  getBoards: () => API.get("/boards"),
  createBoard: (title) => API.post("/boards", { title }),
  updateBoard: (id, title) => API.put(`/boards/${id}`, { title }),
  deleteBoard: (id) => API.delete(`/boards/${id}`),
  getBoardFull: (id) => API.get(`/boards/${id}/full`),
};

export const listsAPI = {
  createList: (boardId, title) => API.post("/lists", { boardId, title }),
  updateList: (id, title) => API.put(`/lists/${id}`, { title }),
  deleteList: (id) => API.delete(`/lists/${id}`),
  moveList: (id, newPosition) => API.put(`/lists/${id}/move`, { newPosition }),
  getLists: (boardId) => API.get(`/lists/${boardId}`),
};

export const tasksAPI = {
  createTask: (listId, title, description) => API.post("/tasks", { listId, title, description }),
  updateTask: (id, data) => API.put(`/tasks/${id}`, data),
  deleteTask: (id) => API.delete(`/tasks/${id}`),
  moveTask: (id, newListId, newPosition) => API.put(`/tasks/${id}/move`, { newListId, newPosition }),
};
