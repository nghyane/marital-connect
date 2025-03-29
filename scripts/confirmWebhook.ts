import dotenv from 'dotenv';
import PayOS from '@payos/node';

// Load environment variables
dotenv.config();

const PAYOS_CLIENT_ID = process.env.PAYOS_CLIENT_ID;
const PAYOS_API_KEY = process.env.PAYOS_API_KEY;
const PAYOS_CHECKSUM_KEY = process.env.PAYOS_CHECKSUM_KEY;

interface PayOSWebhookResponse {
    code: string;
    desc: string;
}

async function confirmWebhook() {
    try {
        if (!PAYOS_CLIENT_ID || !PAYOS_API_KEY || !PAYOS_CHECKSUM_KEY) {
            throw new Error('Missing required environment variables');
        }

        // Initialize PayOS client
        const payOS = new PayOS(
            PAYOS_CLIENT_ID,
            PAYOS_API_KEY,
            PAYOS_CHECKSUM_KEY
        );

        const webhookUrl = 'https://demo.iunhi.com/payments/webhook/payos';
        
        console.log('Configuring webhook URL:', webhookUrl);
        
        // Configure webhook using SDK
        const response = JSON.parse(await payOS.confirmWebhook(webhookUrl)) as PayOSWebhookResponse;
        
        console.log('Response:', JSON.stringify(response, null, 2));

        if (response.code === '00') {
            console.log('✅ Webhook URL configured successfully!');
        } else {
            console.error('❌ Failed to configure webhook URL:', response.desc);
        }
    } catch (error) {
        console.error('❌ Error:', error instanceof Error ? error.message : 'Unknown error');
    }
}

// Run the function
confirmWebhook(); 