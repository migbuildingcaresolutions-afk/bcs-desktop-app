import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔍 Testing Twilio Configuration...\n');

// Check environment variables
console.log('Environment Variables:');
console.log('✓ TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID ? '✓ Set' : '✗ Missing');
console.log('✓ TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN ? '✓ Set' : '✗ Missing');
console.log('✓ TWILIO_MESSAGING_SERVICE_SID:', process.env.TWILIO_MESSAGING_SERVICE_SID ? '✓ Set' : '✗ Missing');
console.log('✓ TWILIO_PHONE_NUMBER:', process.env.TWILIO_PHONE_NUMBER || 'Not set');
console.log('');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

if (!accountSid || !authToken) {
  console.error('❌ Missing Twilio credentials in .env file');
  process.exit(1);
}

try {
  console.log('🔌 Connecting to Twilio...');
  const client = twilio(accountSid, authToken);

  // Test 1: Verify account
  console.log('📋 Fetching account details...');
  const account = await client.api.accounts(accountSid).fetch();
  console.log('✅ Account verified:', account.friendlyName);
  console.log('   Status:', account.status);
  console.log('');

  // Test 2: Check messaging service
  if (messagingServiceSid) {
    console.log('📱 Checking Messaging Service...');
    try {
      const messagingService = await client.messaging.v1
        .services(messagingServiceSid)
        .fetch();
      console.log('✅ Messaging Service found:', messagingService.friendlyName);
      console.log('');

      // Get phone numbers associated with the messaging service
      console.log('📞 Phone numbers in Messaging Service:');
      const phoneNumbers = await client.messaging.v1
        .services(messagingServiceSid)
        .phoneNumbers
        .list({ limit: 20 });

      if (phoneNumbers.length === 0) {
        console.log('⚠️  No phone numbers found in Messaging Service');
        console.log('   You need to add a phone number to your Messaging Service in Twilio Console');
      } else {
        phoneNumbers.forEach(number => {
          console.log(`   ✓ ${number.phoneNumber}`);
        });
      }
      console.log('');
    } catch (error) {
      console.error('❌ Messaging Service error:', error.message);
      console.log('   Make sure the TWILIO_MESSAGING_SERVICE_SID is correct');
      console.log('');
    }
  }

  // Test 3: List available phone numbers
  console.log('📱 Your Twilio phone numbers:');
  const incomingPhoneNumbers = await client.incomingPhoneNumbers.list({ limit: 20 });

  if (incomingPhoneNumbers.length === 0) {
    console.log('⚠️  No phone numbers found');
    console.log('   You need to purchase a phone number in Twilio Console');
  } else {
    incomingPhoneNumbers.forEach(number => {
      console.log(`   ✓ ${number.phoneNumber} (${number.friendlyName || 'No name'})`);
    });
  }
  console.log('');

  console.log('✅ Twilio configuration test complete!');
  console.log('');
  console.log('To send a test SMS, the script needs a destination phone number.');
  console.log('For security, test SMS sending through your app or API endpoint.');

} catch (error) {
  console.error('❌ Twilio test failed:', error.message);

  if (error.code === 20003) {
    console.log('\n⚠️  Authentication failed - check your ACCOUNT_SID and AUTH_TOKEN');
  } else if (error.code === 20404) {
    console.log('\n⚠️  Resource not found - check your messaging service SID');
  } else {
    console.log('\nError details:', error);
  }

  process.exit(1);
}
