import { execSync } from 'child_process';

const SMEE_URL = 'https://smee.io/TkbehNYE8K3mkrzq';
const WEBHOOK_URL = 'http://localhost:4000/payments/webhook/payos';

console.log(`✅ Starting Smee client`);
console.log(`📥 Forwarding webhooks from: ${SMEE_URL}`);
console.log(`📤 To: ${WEBHOOK_URL}`);
console.log('\nPress Ctrl+C to stop the server');

execSync(`npx smee ${SMEE_URL} ${WEBHOOK_URL}`, { stdio: 'inherit' }); 