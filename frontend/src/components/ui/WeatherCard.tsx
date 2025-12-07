import React from "react";

interface WeatherCardProps {
  title: string;
  value: string | number;
}

export function WeatherCard({ title, value }: WeatherCardProps) {
  return (
    <div className="p-4 rounded-xl shadow bg-white">
      <h2 className="text-sm text-gray-600">{title}</h2>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
