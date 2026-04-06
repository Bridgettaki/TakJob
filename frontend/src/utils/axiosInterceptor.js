import axios from "axios";
import store from "../redux/store";
import { setUser } from "../redux/authSlice";
import { persistor } from "../main";

axios.defaults.baseURL = "http://localhost:10000";

axios.defaults.withCredentials = true;

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error?.response?.status === 401) {
            store.dispatch(setUser(null));
            await persistor.purge();
        }
        return Promise.reject(error);
    }
);

export default axios;