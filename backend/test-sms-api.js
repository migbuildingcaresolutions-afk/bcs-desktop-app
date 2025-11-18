// Test the SMS API endpoint
async function testSMSEndpoint() {
  console.log('🧪 Testing SMS API Endpoint...\n');

  // You need to provide a real phone number to test
  // Replace with your actual phone number for testing
  const testPhoneNumber = '+1YOUR_PHONE_NUMBER'; // e.g., +15551234567

  if (testPhoneNumber === '+1YOUR_PHONE_NUMBER') {
    console.log('⚠️  Please edit this file and replace YOUR_PHONE_NUMBER with a real phone number');
    console.log('   Example: const testPhoneNumber = "+15551234567";\n');
    return;
  }

  const testMessage = 'Test SMS from BCS App - Your Twilio integration is working!';

  try {
    console.log('📱 Sending test SMS to:', testPhoneNumber);
    console.log('💬 Message:', testMessage);
    console.log('');

    const response = await fetch('http://localhost:3000/api/sms/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: testPhoneNumber,
        message: testMessage
      })
    });

    const data = await response.json();

    if (data.success) {
      console.log('✅ SMS sent successfully!');
      console.log('   Message SID:', data.sid);
      console.log('');
      console.log('Check your phone for the message!');
    } else {
      console.log('❌ SMS failed to send');
      console.log('   Error:', data.error);
    }

  } catch (error) {
    console.error('❌ API request failed:', error.message);
    console.log('\nMake sure:');
    console.log('1. Backend server is running (node server.mjs)');
    console.log('2. Server is listening on port 3000');
    console.log('3. Twilio credentials are correct in .env file');
  }
}

testSMSEndpoint();
