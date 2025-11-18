import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

if (!accountSid || !authToken) {
  console.error('❌ Missing Twilio credentials');
  process.exit(1);
}

try {
  const client = twilio(accountSid, authToken);

  console.log('🔍 Checking Twilio Account Type...\n');

  const account = await client.api.accounts(accountSid).fetch();

  console.log('Account Information:');
  console.log('━'.repeat(50));
  console.log('Account Name:', account.friendlyName);
  console.log('Status:', account.status);
  console.log('Type:', account.type);
  console.log('');

  if (account.type === 'Trial') {
    console.log('⚠️  You are on a TRIAL account');
    console.log('');
    console.log('Trial Account Limitations:');
    console.log('  • Can only send SMS to verified phone numbers');
    console.log('  • Messages include "Sent from a Twilio trial account"');
    console.log('  • Limited credits');
    console.log('');
    console.log('📋 To verify a phone number:');
    console.log('  1. Go to: https://console.twilio.com/us1/develop/phone-numbers/manage/verified');
    console.log('  2. Click "+" to add a new number');
    console.log('  3. Enter your phone number');
    console.log('  4. Choose Text or Call verification');
    console.log('  5. Enter the code you receive');
    console.log('');
    console.log('💳 To upgrade to a paid account:');
    console.log('  1. Go to: https://console.twilio.com/billing/upgrade');
    console.log('  2. Add payment method');
    console.log('  3. Start with $20 minimum');
    console.log('  4. After upgrade, no number verification needed!');
    console.log('');

    // Try to get verified numbers
    console.log('Checking for verified numbers...');
    try {
      const validationRequests = await client.validationRequests.list({limit: 20});

      if (validationRequests.length > 0) {
        console.log('\n✅ Your Verified Phone Numbers:');
        validationRequests.forEach(v => {
          if (v.phoneNumber) {
            console.log(`  ✓ ${v.phoneNumber}`);
          }
        });
      } else {
        console.log('\n⚠️  No verified numbers found');
        console.log('   You need to verify at least one phone number to test SMS');
      }
    } catch (e) {
      console.log('\n⚠️  Could not fetch verified numbers list');
      console.log('   Check verified numbers at: https://console.twilio.com/us1/develop/phone-numbers/manage/verified');
    }

  } else if (account.type === 'Full') {
    console.log('✅ You have a PAID account');
    console.log('');
    console.log('Paid Account Benefits:');
    console.log('  ✓ Send SMS to any phone number');
    console.log('  ✓ No verification needed');
    console.log('  ✓ No trial message disclaimer');
    console.log('  ✓ Higher sending limits');
    console.log('');
  }

  // Check balance
  const balance = await client.balance.fetch();
  console.log('\nAccount Balance:');
  console.log('  Currency:', balance.currency);
  console.log('  Balance:', balance.balance);

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
