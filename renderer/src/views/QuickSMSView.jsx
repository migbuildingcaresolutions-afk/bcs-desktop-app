import React, { useState } from 'react';

export default function QuickSMSView() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  const sendSMS = async () => {
    if (phoneNumber === '' || message === '') {
      alert('Please enter phone number and message');
      return;
    }
    let formattedPhone = phoneNumber.replace(/\D/g, '');
    if (formattedPhone.startsWith('1') === false) formattedPhone = '1' + formattedPhone;
    formattedPhone = '+' + formattedPhone;
    setSending(true);
    setResult(null);
    try {
      const response = await fetch('http://localhost:3000/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: formattedPhone, message })
      });
      const data = await response.json();
      if (data.success) {
        setResult({ success: true, message: 'SMS sent successfully' });
        setMessage('');
      } else {
        setResult({ success: false, message: 'Failed: ' + data.error });
      }
    } catch (error) {
      setResult({ success: false, message: 'Error: ' + error.message });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-xl p-8 text-white mb-6">
        <h1 className="text-3xl font-bold mb-2">💬 Quick SMS</h1>
        <p className="text-blue-100">Send SMS to any phone number</p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
          <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="5551234567" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Message</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows="4" maxLength="160" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg" />
          <p className="text-xs text-gray-500 mt-1">{message.length}/160 characters</p>
        </div>
        <button onClick={sendSMS} disabled={sending} className="w-full px-6 py-3 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700">
          {sending ? 'Sending...' : 'Send SMS'}
        </button>
        {result && <div className={'p-4 rounded-lg ' + (result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>{result.message}</div>}
      </div>
    </div>
  );
}
