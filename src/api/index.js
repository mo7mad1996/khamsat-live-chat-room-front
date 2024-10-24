import { toast } from "vue3-toastify";
import axios from "axios";

const axiosIns = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosIns.interceptors.response.use(
  (response) => response, // Success case
  (error) => {
    // Handle error case here
    toast.error(error.response?.data);
    console.error("An error occurred:", error);
    return Promise.reject(error); // Return the error to handle it elsewhere
  }
);

export default axiosIns;
