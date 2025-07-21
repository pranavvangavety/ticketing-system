import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:8080"
});

let hasShownSessionExpiredAlert = false;

export function resetSessionAlertFlag() {
    hasShownSessionExpiredAlert = false;
}

instance.interceptors.request.use(
    config => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

instance.interceptors.response.use(
    response => response,
    error => {
        const res = error.response;

        if (
            localStorage.getItem("token") &&
            res?.status === 403 &&
            res?.data?.message?.toLowerCase().includes("logged out")
        ) {
            if (!hasShownSessionExpiredAlert) {
                hasShownSessionExpiredAlert = true;
                const event = new CustomEvent("sessionExpired");
                window.dispatchEvent(event);
            }
        }

        return Promise.reject(error);
    }
);

export default instance;
