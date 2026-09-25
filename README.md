# Order Tracking

A Next.js order-tracking interface with an order list, order details, delivery timelines, and issue states for delayed or unreceived packages. The current orders are sample data maintained in the repository; no external API or database is required to run the app.

## Requirements

- Node.js and npm

## Setup

Clone the repository and enter its directory:

```bash
git clone https://github.com/siam9192/Order-Tracking-Screen.git
cd Order-Tracking-Screen
```

Install dependencies from the lockfile:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Commands

```bash
npm run dev    # Start the development server
npm run lint   # Run ESLint
npm run build  # Create a production build
npm run start  # Serve the production build
```

Run `npm run build` before `npm run start`.

## Project Structure

- `src/app/` contains the home page, dynamic order details page, layout, and global styles.
- `src/components/` contains reusable interface components,
- `src/types/order.type.ts` defines order statuses, issue types, and tracking timeline entries.
- `src/orders.ts` contains the sample order data.
