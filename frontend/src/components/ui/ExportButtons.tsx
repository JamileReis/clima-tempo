import React from "react";

export function ExportButtons() {
  return (
    <div className="flex gap-4">
      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
        Exportar CSV
      </button>
      <button className="px-4 py-2 bg-green-600 text-white rounded-lg">
        Exportar PDF
      </button>
    </div>
  );
}
