import React, { useState, useEffect } from 'react';

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const eventTypes = {
    reminder: { label: 'Reminder', color: 'bg-blue-500', icon: '🔔' },
    quote: { label: 'Send Quote', color: 'bg-purple-500', icon: '📄' },
    invoice: { label: 'Send Invoice', color: 'bg-green-500', icon: '💰' },
    job: { label: 'Job Scheduled', color: 'bg-orange-500', icon: '🏗️' },
    meeting: { label: 'Meeting', color: 'bg-indigo-500', icon: '👥' },
    followup: { label: 'Follow-up', color: 'bg-cyan-500', icon: '📞' },
  };

  const BCS_SIGNATURE = `

---
Building Care Solutions
"We Take the Stress Out of Restoration"

📍 8889 Caminito Plaza Centro, San Diego, CA 92122
📞 858-573-7849
📧 m19u3l@sd-bcs.com
🌐 www.sd-bcs.com

Water Remediation • Mold Clearance • Full Reconstruction
Serving All of San Diego County
`;

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    const stored = localStorage.getItem('bcs_calendar_events');
    if (stored) {
      setEvents(JSON.parse(stored));
    }
  };

  const saveEvents = (newEvents) => {
    setEvents(newEvents);
    localStorage.setItem('bcs_calendar_events', JSON.stringify(newEvents));
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startingDayOfWeek = firstDay.getDay();
    return { daysInMonth, startingDayOfWeek };
  };

  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const openNewEventModal = (date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setShowEventModal(true);
  };

  const openEditEventModal = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const sendEventNotification = (event) => {
    const message = `${event.title}

Date: ${new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
Time: ${new Date(event.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}

${event.description || ''}
${BCS_SIGNATURE}`;

    // This would integrate with your email/SMS service
    console.log('Sending notification:', message);
    alert('Notification sent with BCS signature!');
  };

  const EventModal = () => {
    const [formData, setFormData] = useState(
      selectedEvent || {
        title: '',
        date: (selectedDate || new Date()).toISOString(),
        time: '09:00',
        type: 'reminder',
        category: 'general',
        clientId: '',
        jobId: '',
        description: '',
        notifications: { email: true, sms: false },
      }
    );

    const handleSubmit = (e) => {
      e.preventDefault();
      const dateTime = new Date(`${formData.date.split('T')[0]}T${formData.time}`);

      const eventData = {
        ...formData,
        id: selectedEvent?.id || Date.now().toString(),
        date: dateTime.toISOString(),
      };

      if (selectedEvent) {
        saveEvents(events.map(e => e.id === selectedEvent.id ? eventData : e));
      } else {
        saveEvents([...events, eventData]);
      }

      if (formData.notifications.email || formData.notifications.sms) {
        sendEventNotification(eventData);
      }

      setShowEventModal(false);
    };

    const handleDelete = () => {
      if (confirm('Delete this event?')) {
        saveEvents(events.filter(e => e.id !== selectedEvent.id));
        setShowEventModal(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {selectedEvent ? 'Edit Event' : 'New Event'}
            </h2>
            <button
              onClick={() => setShowEventModal(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-3xl leading-none"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter event title"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Event Type</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                  >
                    {Object.entries(eventTypes).map(([key, val]) => (
                      <option key={key} value={key}>{val.icon} {val.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="general">General</option>
                    <option value="dry-out">Dry-out</option>
                    <option value="remediation">Remediation</option>
                    <option value="reconstruction">Reconstruction</option>
                    <option value="estimate">Estimate</option>
                    <option value="inspection">Inspection</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.date.split('T')[0]}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time</label>
                  <input
                    type="time"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.time}
                    onChange={e => setFormData({...formData, time: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client ID</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.clientId}
                    onChange={e => setFormData({...formData, clientId: e.target.value})}
                    placeholder="CLI-XXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job ID</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.jobId}
                    onChange={e => setFormData({...formData, jobId: e.target.value})}
                    placeholder="JOB-XXX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Send Notifications</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.notifications.email}
                      onChange={e => setFormData({...formData, notifications: {...formData.notifications, email: e.target.checked}})}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">📧 Email</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.notifications.sms}
                      onChange={e => setFormData({...formData, notifications: {...formData.notifications, sms: e.target.checked}})}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">📱 SMS</span>
                  </label>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  ✉️ All notifications include Building Care Solutions signature
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              {selectedEvent && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  🗑️ Delete
                </button>
              )}
              <div className="flex gap-3 ml-auto">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  💾 Save Event
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
    const today = new Date();
    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="bg-gray-50/50 dark:bg-gray-800/50 min-h-[100px] md:min-h-[120px] border border-gray-200 dark:border-gray-700"></div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const isToday = date.toDateString() === today.toDateString();

      days.push(
        <div
          key={day}
          onClick={() => openNewEventModal(date)}
          className={`min-h-[100px] md:min-h-[120px] border border-gray-200 dark:border-gray-700 p-2 cursor-pointer transition-all hover:bg-blue-50/50 dark:hover:bg-blue-900/20 ${
            isToday ? 'bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-400' : 'bg-white dark:bg-gray-800'
          }`}
        >
          <div className={`text-2xl font-bold mb-2 ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-800 dark:text-gray-200'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 3).map(event => {
              const type = eventTypes[event.type];
              const time = new Date(event.date).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              });
              return (
                <div
                  key={event.id}
                  onClick={(e) => { e.stopPropagation(); openEditEventModal(event); }}
                  className={`${type.color} text-white text-xs px-2 py-1 rounded truncate hover:opacity-80 transition-opacity`}
                  title={`${time} - ${event.title}`}
                >
                  {time} {event.title}
                </div>
              );
            })}
            {dayEvents.length > 3 && (
              <div className="text-xs text-gray-500 dark:text-gray-400 px-2">
                +{dayEvents.length - 3} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="p-6 md:p-8 space-y-6 md:space-y-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-xl p-8 md:p-10 text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">📅 Calendar & Reminders</h1>
        <p className="text-blue-100 text-lg font-medium leading-relaxed">Building Care Solutions - Professional Scheduling System</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <button onClick={previousMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <span className="text-2xl dark:text-gray-300">‹</span>
          </button>
          <div className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 min-w-[200px] text-center">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </div>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <span className="text-2xl dark:text-gray-300">›</span>
          </button>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button onClick={goToToday} className="flex-1 md:flex-none px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:text-gray-200">
            Today
          </button>
          <button onClick={() => openNewEventModal(new Date())} className="flex-1 md:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            ➕ New Event
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 gap-0">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-3 text-center font-semibold text-sm text-gray-700 dark:text-gray-200">
              {day}
            </div>
          ))}
          {renderCalendar()}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 md:p-6">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">Event Types</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(eventTypes).map(([key, val]) => (
            <div key={key} className="flex items-center gap-2">
              <div className={`${val.color} w-4 h-4 rounded`}></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">{val.icon} {val.label}</span>
            </div>
          ))}
        </div>
      </div>

      {showEventModal && <EventModal />}
    </div>
  );
};

export default CalendarView;
