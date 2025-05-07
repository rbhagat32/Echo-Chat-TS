import axios from "axios";

const serverUrl = "https://chat.void9.space/api";

const instance = axios.create({
  baseURL: `${serverUrl}`,
  withCredentials: true,
});

export { instance as axios };
