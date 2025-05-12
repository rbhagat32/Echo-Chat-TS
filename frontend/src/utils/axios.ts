import axios from "axios";

const BACKEND_URL = import.meta.env.DEV
  ? import.meta.env.VITE_BACKEND_URL
  : "https://chat.void9.space/api";

const instance = axios.create({
  baseURL: BACKEND_URL as string,
  withCredentials: true,
});

export { instance as axios };
