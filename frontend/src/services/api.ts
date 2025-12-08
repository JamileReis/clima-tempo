import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api"
})

const DEFAULT_LOCATION = "Araci,BR";

export async function getCurrent(location = DEFAULT_LOCATION) {
    const { data } = await api.get(`/weather/current`, {
        params: { location }
    });
    return data;
}

export async function getLogs(location = DEFAULT_LOCATION) {
    const { data } = await api.get(`/weather/logs`, {
        params: { location }
    });
    return data;
}

export async function getInsights(location = DEFAULT_LOCATION) {
    const { data } = await api.get(`/weather/insights`, {
        params: { location }
    });
    return data;
}
