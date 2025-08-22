# TattooTraceAI

AI-powered tattoo visualization platform that allows users to see how tattoos will look on their body before getting inked.

## Features

- **Tattoo Overlay**: Upload body part photos and overlay tattoo designs using AI to create realistic visualizations
- **Tattoo Generation**: Generate custom tattoo designs using AI based on text prompts
- **Multiple Styles**: Support for various tattoo styles including Traditional, Realistic, Minimalist, and Geometric
- **Credit System**: Pay-per-use model with affordable credit packages
- **User Authentication**: Secure sign-in with email verification
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: HeroUI (NextUI)
- **Authentication**: Better Auth
- **Database**: PostgreSQL with Prisma ORM
- **AI Processing**: FAL.ai for image generation and processing
- **Payments**: Stripe
- **Deployment**: Vercel

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/deifos/tattootraceai.git
cd tattootraceai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Fill in your environment variables for database, authentication, Stripe, and FAL.ai.

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Environment Variables

- `FAL_KEY` - FAL.ai API key for AI processing
- `BETTER_AUTH_SECRET` - Authentication secret key
- `BETTER_AUTH_URL` - Base URL for authentication
- `NEXT_PUBLIC_APP_URL` - Public app URL
- `DATABASE_URL` - PostgreSQL connection string
- `DIRECT_URL` - Direct database connection URL
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `STRIPE_CLI_WEBHOOK_SECRET` - Stripe CLI webhook secret (for local testing)
- `ZEPTOMAIL_API_URL` - ZeptoMail API URL
- `ZEPTO_MAIL_API_KEY` - ZeptoMail API key
- `EMAIL_FROM` - Default sender email address
- `EMAIL_FROM_NAME` - Default sender name
- `EMAIL_REPLY_TO` - Default reply-to email address

## License

MIT License - see LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
