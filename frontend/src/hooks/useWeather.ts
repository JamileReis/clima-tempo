import { useEffect, useState } from "react";

export function useWeather() {
  const [weather, setWeather] = useState<any>(null);
  const [logs, setLogs] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [insights, setInsights] = useState({ main: "Carregando..." });

  useEffect(() => {
    fetch("http://localhost:3000/weather")
      .then((res) => res.json())
      .then((data) => {
        setWeather(data.weather);
        setLogs(data.logs);
        setChartData(data.chartData);
        setInsights(data.insights);
      });
  }, []);

  return { weather, logs, chartData, insights };
}
