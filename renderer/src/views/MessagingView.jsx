import { useState, useEffect } from 'react';
import { clientsAPI, messagingAPI } from '../api-client';

export default function MessagingView() {
  const [clients, setClients] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);
  const [templates, setTemplates] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Form state
  const [messageType, setMessageType] = useState('email'); // 'email', 'sms', 'both'
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [smsMessage, setSmsMessage] = useState('');

  // Load clients and templates on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [clientsData, templatesData] = await Promise.all([
        clientsAPI.getAll(),
        messagingAPI.getTemplates()
      ]);
      setClients(clientsData || []);
      setTemplates(templatesData || {});
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  // Load template
  const handleTemplateSelect = (templateKey) => {
    setSelectedTemplate(templateKey);
    if (templateKey && templates[templateKey]) {
      const template = templates[templateKey];
      setEmailSubject(template.subject);
      setEmailMessage(template.message);
    }
  };

  // Toggle client selection
  const toggleClient = (clientId) => {
    setSelectedClients(prev =>
      prev.includes(clientId)
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  // Select/deselect all clients
  const toggleSelectAll = () => {
    if (selectedClients.length === clients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(clients.map(c => c.id));
    }
  };

  // Send messages
  const handleSend = async () => {
    if (selectedClients.length === 0) {
      alert('Please select at least one client');
      return;
    }

    if (messageType === 'email' && (!emailSubject || !emailMessage)) {
      alert('Please provide email subject and message');
      return;
    }

    if (messageType === 'sms' && !smsMessage) {
      alert('Please provide SMS message');
      return;
    }

    if (messageType === 'both' && (!emailSubject || !emailMessage || !smsMessage)) {
      alert('Please provide both email and SMS messages');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      let response;

      if (messageType === 'email') {
        response = await messagingAPI.sendBulkEmail({
          clientIds: selectedClients,
          subject: emailSubject,
          message: emailMessage
        });
      } else if (messageType === 'sms') {
        response = await messagingAPI.sendBulkSMS({
          clientIds: selectedClients,
          message: smsMessage
        });
      } else {
        response = await messagingAPI.sendBulkMessage({
          clientIds: selectedClients,
          emailSubject,
          emailMessage,
          smsMessage,
          sendEmail: true,
          sendSMS: true
        });
      }

      setResult(response);
      alert(`Successfully sent! ${response.sent} sent, ${response.failed} failed`);
    } catch (error) {
      console.error('Error sending messages:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const allSelected = selectedClients.length === clients.length && clients.length > 0;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <span className="text-4xl mr-3">💬</span>
          Bulk Messaging
        </h1>
        <p className="text-gray-600 mt-2">Send marketing, promotions, and updates to your clients</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT: Client Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Select Recipients</h2>
              <button
                onClick={toggleSelectAll}
                className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
              >
                {allSelected ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-semibold text-blue-800">
                {selectedClients.length} of {clients.length} clients selected
              </p>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {clients.map(client => (
                <label
                  key={client.id}
                  className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedClients.includes(client.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedClients.includes(client.id)}
                    onChange={() => toggleClient(client.id)}
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                  <div className="ml-3 flex-1">
                    <p className="font-semibold text-gray-800">{client.name}</p>
                    {client.company && (
                      <p className="text-sm text-gray-500">{client.company}</p>
                    )}
                    {client.email && (
                      <p className="text-xs text-gray-400">📧 {client.email}</p>
                    )}
                    {client.phone && (
                      <p className="text-xs text-gray-400">📱 {client.phone}</p>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Message Composition */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6">

            {/* Message Type Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Message Type</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => setMessageType('email')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                    messageType === 'email'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  📧 Email Only
                </button>
                <button
                  onClick={() => setMessageType('sms')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                    messageType === 'sms'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  💬 SMS Only
                </button>
                <button
                  onClick={() => setMessageType('both')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                    messageType === 'both'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  📧💬 Both
                </button>
              </div>
            </div>

            {/* Template Selection */}
            {(messageType === 'email' || messageType === 'both') && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Template (Optional)
                </label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => handleTemplateSelect(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Select a template or write custom --</option>
                  {Object.keys(templates).map(key => (
                    <option key={key} value={key}>
                      {templates[key].subject}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Email Form */}
            {(messageType === 'email' || messageType === 'both') && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4">📧 Email Content</h3>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Email subject line..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    placeholder="Email message content..."
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* SMS Form */}
            {(messageType === 'sms' || messageType === 'both') && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4">💬 SMS Content</h3>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message * <span className="text-xs text-gray-500">(Keep it short - SMS has character limits)</span>
                  </label>
                  <textarea
                    value={smsMessage}
                    onChange={(e) => setSmsMessage(e.target.value)}
                    placeholder="SMS message content..."
                    rows="3"
                    maxLength="160"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {smsMessage.length}/160 characters
                  </p>
                </div>
              </div>
            )}

            {/* Send Button */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleSend}
                disabled={loading || selectedClients.length === 0}
                className={`px-8 py-3 rounded-lg font-bold text-white text-lg ${
                  loading || selectedClients.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-lg'
                }`}
              >
                {loading ? '⏳ Sending...' : `🚀 Send to ${selectedClients.length} Client${selectedClients.length !== 1 ? 's' : ''}`}
              </button>

              {result && (
                <div className="text-sm">
                  <span className="text-green-600 font-semibold">✅ {result.sent} sent</span>
                  {result.failed > 0 && (
                    <span className="text-red-600 font-semibold ml-4">❌ {result.failed} failed</span>
                  )}
                </div>
              )}
            </div>

            {/* Info Note */}
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> SMS functionality requires Twilio credentials to be configured in your .env file.
                If not configured, only email will be sent.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
