import { useEffect, useState } from "react";
import { getCurrent, getLogs, getInsights } from "@/services/api";

export function useWeather() {
    const [weather, setWeather] = useState(null);
    const [logs, setLogs] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [insights, setInsights] = useState(null);

    useEffect(() => {
        async function load() {
            const w = await getCurrent();
            const l = await getLogs();
            const i = await getInsights();

            setWeather(w);
            setLogs(l);
            setChartData(l.map((x: any) => ({ time: x.timestamp, temp: x.temperature })));
            setInsights(i);
        }

        load();
    }, []);

    return { weather, logs, chartData, insights };
}
