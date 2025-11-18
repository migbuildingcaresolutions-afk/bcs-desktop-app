import React from "react";

export default function DocumentActions({ id, type }) {
  const API =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"\;

  const openPDF = () => {
    if (!id || !type) return alert("Missing document ID or type.");
    window.open(`${API}/${type}s/${id}/pdf`, "_blank");
  };

  const openEmail = () => {
    if (!id || !type) return alert("Missing document ID or type.");
    window.open(`${API}/${type}s/${id}/email`, "_blank");
  };

  return (
    <div className="flex gap-2 mt-3">
      <button
        onClick={openPDF}
        className="px-3 py-1 rounded bg-blue-600 text-white text-sm"
      >
        📄 PDF
      </button>

      <button
        onClick={openEmail}
        className="px-3 py-1 rounded bg-green-600 text-white text-sm"
      >
        ✉️ Email
      </button>
    </div>
  );
}
