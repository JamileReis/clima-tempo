import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface ChartProps {
  data: Array<{ time: string; temp: number }>;
}

export function WeatherChart({ data }: ChartProps) {
  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <LineChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="temp" stroke="#2563eb" strokeWidth={2} />
      </LineChart>
    </div>
  );
}
