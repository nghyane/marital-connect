# Marital Connect

- DEMO: https://demo.iunhi.com

A web application that connects experts and clients for marriage counseling and relationship advice, built with Encore.ts and TypeScript.

## Features

- User authentication and authorization
- Expert profiles and certification management
- Appointment scheduling and management
- Payment processing via PayOS
- Admin dashboard for platform management

## Tech Stack

- **Backend**: Encore.ts (TypeScript Backend Framework)
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Payment Processing**: PayOS

## Prerequisites

- Node.js v20 or higher
- Encore CLI (latest version)
- Docker CLI
- PayOS account for payment processing

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/marital-connect.git
cd marital-connect
```

2. Install dependencies:
```bash
npm install
```

3. Run the application in development mode:
```bash
encore run
```

## Environment Variables

Configure your environment variables in the `.secrets.local.cue` file:

- `JWT_SECRET`: Secret key for JWT token generation and validation
- `PAYOS_CLIENT_ID`: Your PayOS client ID
- `PAYOS_API_KEY`: Your PayOS API key
- `PAYOS_CHECKSUM_KEY`: Your PayOS checksum key

## Webhook Setup

To handle PayOS webhooks locally:

1. Install and run [smee.io](https://smee.io/) client:
```bash
npm run webhook
```

2. Configure your webhook:
```bash
npm run configure-webhook
```

## Project Structure

```
marital-connect/
├── src/
│   ├── database/      # Database migrations and schemas
│   ├── modules/       # Application modules (features)
│   │   ├── admin/     # Admin panel functionality
│   │   ├── appointments/ # Appointment management
│   │   ├── auth/      # Authentication and authorization
│   │   ├── experts/   # Expert profiles and certification
│   │   ├── payments/  # Payment processing
│   │   └── users/     # User management
│   └── shared/        # Shared utilities and middleware
├── scripts/           # Utility scripts
├── uploads/           # Uploaded files
└── .encore/           # Encore.ts configuration
```

## Development

### Database Migrations

Create and run database migrations using Drizzle:

```bash
npx drizzle-kit generate
```

Migrations are automatically applied when the app runs.

### Adding New Features

Follow the modular structure in the `src/modules` directory when adding new features.

## Deployment

Encore handles deployment automatically. Push your changes to your repository, and Encore will build and deploy your application.

## License

This project is licensed under the [MIT License](LICENSE).
