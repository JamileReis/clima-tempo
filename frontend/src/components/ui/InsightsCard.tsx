import React from "react";

interface InsightsCardProps {
  insight: string;
}

export function InsightsCard({ insight }: InsightsCardProps) {
  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-2">Insights</h2>
      <p>{insight}</p>
    </div>
  );
}
