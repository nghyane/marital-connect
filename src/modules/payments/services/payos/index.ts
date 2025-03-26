import { createPaymentLink } from './payment.creator';
import { handleWebhookPayload } from './webhook.handler';
import { paymentRepository } from './payment.repository';

import { secret } from "encore.dev/config";
import PayOS from '@payos/node';

// PayOS API credentials from environment secrets
const PAYOS_CLIENT_ID = secret("PAYOS_CLIENT_ID");
const PAYOS_API_KEY = secret("PAYOS_API_KEY");
const PAYOS_CHECKSUM_KEY = secret("PAYOS_CHECKSUM_KEY");

/**
 * Initialize PayOS SDK instance
 * This is a singleton instance that can be used throughout the application
 */
export const payosClient = (): PayOS => {
  try {
    return new PayOS(
      PAYOS_CLIENT_ID(),
      PAYOS_API_KEY(),
      PAYOS_CHECKSUM_KEY()
    );
  } catch (error) {
    console.error('Failed to initialize PayOS client:', error);
    throw new Error('PayOS client initialization failed');
  }
};

/**
 * PayOS payment service implementation
 * Uses functional approach with object literals instead of classes
 */
export const payosService = {
  // Payment creation
  createPaymentLink,
  
  // Webhook handling
  handleWebhookPayload,
  
  // Payment data access
  getPaymentById: paymentRepository.getPaymentById,
  getPaymentByOrderId: paymentRepository.getPaymentByOrderId,
  
  // Get PayOS client instance
  getClient: payosClient
};

// For backward compatibility
export const payos = payosClient();