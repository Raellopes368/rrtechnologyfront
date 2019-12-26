import axios from "axios";

const api = axios.create({
  baseURL: "https://backend-realtime.herokuapp.com/"
});

export default api;
