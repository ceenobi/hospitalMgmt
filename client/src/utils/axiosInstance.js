import axios from "axios";

const BASEURL = import.meta.env.VITE_CLINICARE_BASE_URL;
const TIMEOUTMSG = "Waiting for too long...Aborted!";
const timeout = 10000;

const config = {
  baseURL: BASEURL,
  timeoutErrorMessage: TIMEOUTMSG,
  timeout,
  withCredentials: true,
};

const axiosInstance = axios.create(config);

export default axiosInstance;
