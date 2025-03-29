import SmeeClient from 'smee-client';

const SMEE_URL = 'https://smee.io/TkbehNYE8K3mkrzq';
const WEBHOOK_URL = 'http://localhost:4000/payments/webhook';

console.log(`✅ Starting Smee client`);
console.log(`📥 Forwarding webhooks from: ${SMEE_URL}`);
console.log(`📤 To: ${WEBHOOK_URL}`);
console.log('\nPress Ctrl+C to stop the server');

const source = SMEE_URL;
const target = WEBHOOK_URL;

const smee = new SmeeClient({
  source,
  target,
  logger: console,
});

const events = smee.start();

// Keep the process running until interrupted
process.on('SIGINT', () => {
  console.log('\n⛔ Stopping webhook forwarding');
  events.close();
  process.exit();
}); 