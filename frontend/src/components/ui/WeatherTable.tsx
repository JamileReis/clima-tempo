import React from "react";

interface WeatherLog {
  time: string;
  temp: number;
  humidity: number;
  wind: number;
}

interface TableProps {
  logs: WeatherLog[];
}

export function WeatherTable({ logs }: TableProps) {
  return (
    <table className="w-full bg-white shadow rounded-xl overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 text-left">Hora</th>
          <th className="p-2 text-left">Temp (°C)</th>
          <th className="p-2 text-left">Umidade (%)</th>
          <th className="p-2 text-left">Vento (km/h)</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log, index) => (
          <tr key={index} className="border-t">
            <td className="p-2">{log.time}</td>
            <td className="p-2">{log.temp}</td>
            <td className="p-2">{log.humidity}</td>
            <td className="p-2">{log.wind}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
