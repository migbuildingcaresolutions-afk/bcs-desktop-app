import { useState, useEffect } from "react";
import DocumentActions from "../components/DocumentActions";
import { generatePrintDocument, printDocument, LEGAL_DISCLAIMERS } from '../utils/printTemplates';

export default function MoistureLogsView() {
  const API =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

  const [selectedJob, setSelectedJob] = useState("");
  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [newLog, setNewLog] = useState({
    work_order_id: "",
    log_date: "",
    technician: "",
    outsideTemp: "",
    outsideRH: "",
    insideTemp: "",
    insideRH: "",
    equipmentNotes: "",
    notes: "",
    rooms: [{ id: 1, name: "Living Room", material: "Drywall", reading: "" }],
  });

  // Load from backend
  const loadLogs = async () => {
    try {
      const res = await fetch(`${API}/moisture-logs`);
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error("Failed to load moisture logs:", err);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const updateRoom = (id, field, value) => {
    setNewLog((prev) => ({
      ...prev,
      rooms: prev.rooms.map((r) =>
        r.id === id ? { ...r, [field]: value } : r
      ),
    }));
  };

  const addRoom = () => {
    setNewLog((prev) => ({
      ...prev,
      rooms: [
        ...prev.rooms,
        {
          id: prev.rooms.length + 1,
          name: "",
          material: "",
          reading: "",
        },
      ],
    }));
  };

  const handleChange = (e) => {
    setNewLog((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const saveLog = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/moisture-logs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLog),
      });

      if (res.ok) {
        loadLogs();
        alert("Moisture log saved!");
      }
    } catch (err) {
      console.error("Failed to save log:", err);
    }
  };

  const handleViewLog = (log) => {
    setSelectedLog(log);
    setIsViewModalOpen(true);
  };

  const handlePrint = () => {
    if (!selectedLog) return;

    const rooms = selectedLog.rooms ? JSON.parse(selectedLog.rooms) : [];

    const content = `
      <div class="document-info">
        <div class="info-box">
          <h3>🌡️ Environmental Conditions</h3>
          <p><span class="info-label">Outside Temp:</span> ${selectedLog.outsideTemp || 'N/A'}°F</p>
          <p><span class="info-label">Outside RH:</span> ${selectedLog.outsideRH || 'N/A'}%</p>
          <p><span class="info-label">Inside Temp:</span> ${selectedLog.insideTemp || 'N/A'}°F</p>
          <p><span class="info-label">Inside RH:</span> ${selectedLog.insideRH || 'N/A'}%</p>
        </div>

        <div class="info-box">
          <h3>Log Information</h3>
          <p><span class="info-label">Date:</span> ${selectedLog.log_date}</p>
          <p><span class="info-label">Technician:</span> ${selectedLog.technician}</p>
          <p><span class="info-label">Work Order:</span> ${selectedLog.work_order_id || 'N/A'}</p>
        </div>
      </div>

      ${rooms.length > 0 ? `
      <div class="details-section">
        <h3>💧 Room Moisture Readings</h3>
        <table>
          <thead>
            <tr>
              <th>Room Name</th>
              <th>Material</th>
              <th>Moisture Reading (%)</th>
            </tr>
          </thead>
          <tbody>
            ${rooms.map(r => `
              <tr>
                <td>${r.name}</td>
                <td>${r.material}</td>
                <td><strong>${r.reading}%</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      ` : ''}

      ${selectedLog.equipmentNotes ? `
      <div class="details-section">
        <h3>🔧 Equipment Notes</h3>
        <div class="details-content">${selectedLog.equipmentNotes}</div>
      </div>
      ` : ''}

      ${selectedLog.notes ? `
      <div class="details-section">
        <h3>📝 Additional Notes</h3>
        <div class="details-content">${selectedLog.notes}</div>
      </div>
      ` : ''}

      <div class="signature-section">
        <div class="signature-box">
          <p><strong>Technician Signature</strong></p>
          <p>${selectedLog.technician}</p>
          <p>Date: ${selectedLog.log_date}</p>
        </div>
        <div class="signature-box">
          <p><strong>Property Owner/Manager</strong></p>
          <p>_____________________</p>
          <p>Date: _________________</p>
        </div>
      </div>
    `;

    const html = generatePrintDocument('moisturelog', {
      documentTitle: 'MOISTURE LOG',
      documentNumber: `LOG-${selectedLog.id || new Date(selectedLog.log_date).getTime()}`,
      date: selectedLog.log_date,
      content: content,
      disclaimer: LEGAL_DISCLAIMERS.moistureLog
    });

    printDocument(html);
  };

  const handleEmail = () => {
    if (!selectedLog) return;

    const roomReadings = selectedLog.rooms
      ? JSON.parse(selectedLog.rooms).map(r => `${r.name}: ${r.material} - ${r.reading}%`).join('\n')
      : 'No room data';

    const subject = encodeURIComponent(`Moisture Log - ${selectedLog.log_date} - Building Care Solutions`);
    const body = encodeURIComponent(`Moisture Log Report

Date: ${selectedLog.log_date}
Technician: ${selectedLog.technician}
Work Order: ${selectedLog.work_order_id || 'N/A'}

ENVIRONMENTAL CONDITIONS:
Outside - Temp: ${selectedLog.outsideTemp || 'N/A'}°F, RH: ${selectedLog.outsideRH || 'N/A'}%
Inside - Temp: ${selectedLog.insideTemp || 'N/A'}°F, RH: ${selectedLog.insideRH || 'N/A'}%

ROOM READINGS:
${roomReadings}

EQUIPMENT NOTES:
${selectedLog.equipmentNotes || 'N/A'}

ADDITIONAL NOTES:
${selectedLog.notes || 'N/A'}

---
Building Care Solutions
8889 Caminito Plaza Centro, San Diego, CA 92122
858-573-7849 | m19u3l@sd-bcs.com
    `);

    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleSMS = async () => {
    if (!selectedLog) return;

    const message = `Moisture Log from ${selectedLog.log_date}. Outside: ${selectedLog.outsideTemp}°F/${selectedLog.outsideRH}% RH. Inside: ${selectedLog.insideTemp}°F/${selectedLog.insideRH}% RH. Technician: ${selectedLog.technician}`;

    const phoneNumber = prompt('Enter phone number (with country code, e.g., +12345678900):');
    if (!phoneNumber) return;

    try {
      const response = await fetch(`${API}/sms/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: phoneNumber,
          message: message
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      if (result.success) {
        alert('✅ SMS sent successfully to ' + phoneNumber);
      } else {
        alert('❌ Failed to send SMS: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('SMS Error:', error);
      alert('❌ Error sending SMS: ' + error.message + '\n\nMake sure the backend server is running and Twilio is configured.');
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Moisture Logs</h1>
          {selectedLog && (
            <DocumentActions id={selectedLog.id} type="moisturelog" />
          )}
          <p className="text-gray-600 mt-1">
            Track psychrometric data, daily readings, and drying conditions.
          </p>
        </div>
      </div>

      {/* Job Input */}
      <div className="bg-white shadow rounded-xl p-4 border mb-6">
        <label className="block text-sm font-medium mb-1">
          Job / Work Order
        </label>
        <input
          value={selectedJob}
          onChange={(e) => setSelectedJob(e.target.value)}
          placeholder="Type job number or name"
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />
      </div>

      {/* New Moisture Log */}
      <form
        onSubmit={saveLog}
        className="bg-white border rounded-xl shadow p-6 mb-8"
      >
        <h2 className="text-xl font-semibold mb-4">New Moisture Log</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm">Log Date</label>
            <input
              type="date"
              name="log_date"
              value={newLog.log_date}
              onChange={handleChange}
              className="w-full border rounded-lg px-2 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="text-sm">Technician</label>
            <input
              name="technician"
              value={newLog.technician}
              onChange={handleChange}
              className="w-full border rounded-lg px-2 py-2 text-sm"
            />
          </div>
        </div>

        {/* Rooms */}
        <h3 className="text-lg font-semibold mt-6 mb-3">Rooms</h3>

        {newLog.rooms.map((room) => (
          <div key={room.id} className="grid grid-cols-3 gap-3 mb-3">
            <input
              value={room.name}
              onChange={(e) =>
                updateRoom(room.id, "name", e.target.value)
              }
              placeholder="Room Name"
              className="border rounded px-2 py-1"
            />
            <input
              value={room.material}
              onChange={(e) =>
                updateRoom(room.id, "material", e.target.value)
              }
              placeholder="Material"
              className="border rounded px-2 py-1"
            />
            <input
              value={room.reading}
              onChange={(e) =>
                updateRoom(room.id, "reading", e.target.value)
              }
              placeholder="Reading %"
              className="border rounded px-2 py-1"
            />
          </div>
        ))}

        <button
          type="button"
          onClick={addRoom}
          className="mt-2 px-4 py-2 bg-gray-200 rounded"
        >
          + Add Room
        </button>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            Save Log
          </button>
        </div>
      </form>

      {/* Display Logs */}
      <div className="bg-white border rounded-xl shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Existing Logs</h2>
        </div>

        {logs.length === 0 ? (
          <p className="p-4 text-gray-500">No logs available.</p>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="p-4 border-b cursor-pointer hover:bg-gray-50"
              onClick={() => handleViewLog(log)}
            >
              <p className="font-semibold">
                {log.log_date} — Tech: {log.technician}
              </p>
              <p className="text-xs text-gray-500">{log.notes}</p>
            </div>
          ))
        )}
      </div>

      {/* View Modal */}
      {isViewModalOpen && selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setIsViewModalOpen(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">💧 Moisture Log Details</h2>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-3xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Log Date: {selectedLog.log_date}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">Technician: {selectedLog.technician}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">🌡️ Outside Conditions</label>
                  <p className="text-gray-900 dark:text-gray-100">Temp: {selectedLog.outsideTemp || 'N/A'}°F</p>
                  <p className="text-gray-900 dark:text-gray-100">RH: {selectedLog.outsideRH || 'N/A'}%</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">🏠 Inside Conditions</label>
                  <p className="text-gray-900 dark:text-gray-100">Temp: {selectedLog.insideTemp || 'N/A'}°F</p>
                  <p className="text-gray-900 dark:text-gray-100">RH: {selectedLog.insideRH || 'N/A'}%</p>
                </div>
              </div>

              {selectedLog.rooms && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">📍 Room Readings</label>
                  <div className="space-y-2">
                    {JSON.parse(selectedLog.rooms).map((room, idx) => (
                      <div key={idx} className="flex justify-between border-b border-gray-300 dark:border-gray-600 pb-1">
                        <span className="font-medium text-gray-900 dark:text-gray-100">{room.name}</span>
                        <span className="text-gray-700 dark:text-gray-300">{room.material}: {room.reading}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedLog.equipmentNotes && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">🔧 Equipment Notes</label>
                  <p className="text-gray-900 dark:text-gray-100">{selectedLog.equipmentNotes}</p>
                </div>
              )}

              {selectedLog.notes && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">📝 Additional Notes</label>
                  <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">{selectedLog.notes}</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-3">
              <button onClick={handlePrint} className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium">
                🖨️ Print
              </button>
              <button onClick={handleEmail} className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
                📧 Email
              </button>
              <button onClick={handleSMS} className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                💬 SMS
              </button>
              <button onClick={() => setIsViewModalOpen(false)} className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


