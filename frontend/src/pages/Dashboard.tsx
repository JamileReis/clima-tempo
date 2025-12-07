import {WeatherCard} from "@/components/ui/WeatherCard";
import {WeatherChart} from "@/components/ui/WeatherChart";
import {WeatherTable} from "@/components/ui/WeatherTable";
import {InsightsCard} from "@/components/ui/InsightsCard";
import {ExportButtons} from "@/components/ui/ExportButtons";
import { useWeather } from "@/hooks/useWeather";
import React from "react";

export default function Dashboard() {
    const { weather, logs, chartData, insights } = useWeather();

    if (!weather) return <p className="p-6">Carregando...</p>;

    return (
        <div className="p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <WeatherCard title="Temperatura" value={`${weather.temp ?? "?"}°C`} />
                <WeatherCard title="Umidade" value={`${weather.humidity ?? "?"}%`} />
                <WeatherCard title="Vento" value={`${weather.wind ?? "?"} km/h`} />
                <WeatherCard title="Condição" value={weather.condition ?? "?"} />
            </div>

            <WeatherChart data={chartData ?? []} />
            <InsightsCard insight={insights?.main ?? "Sem dados"} />
            <WeatherTable logs={logs ?? []} />
            <ExportButtons />
        </div>
    );
}
