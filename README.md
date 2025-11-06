# ChatKu - Realtime Chat Application

A modern realtime chat application built with Next.js 16, shadcn/ui, and Ably for realtime communication.

## Features

- **Realtime Messaging** - Messages are instantly delivered to all active users
- **Active Users** - View who is currently online
- **Typing Indicator** - See when other users are typing
- **Message History** - Automatically loads the last 50 messages
- **Clean UI** - Built with shadcn/ui components and Tailwind CSS
- **Responsive Design** - Optimized for both desktop and mobile devices
- **Anonymous Authentication** - Simply enter your name, no account required
- **Anti-spam Protection** - 800ms cooldown to prevent message spam
- **Message Validation** - Maximum 300 characters per message
- **Virtualized List** - Optimal performance with react-virtuoso

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: shadcn/ui + Tailwind CSS v4
- **Realtime**: Ably (Messages + Presence)
- **Validation**: Zod
- **ID Generation**: nanoid
- **Virtualization**: react-virtuoso
- **TypeScript**: Full type safety

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd chatku
```

2. Install dependencies:

```bash
bun install
```

3. Setup environment variables:

Copy the `.env.local.example` file to `.env.local`:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` and add your Ably API key:

```env
NEXT_PUBLIC_ABLY_KEY=your_ably_api_key_here
```

**How to get an Ably API Key:**

1. Create a free account at [Ably.com](https://ably.com)
2. Create a new application in the dashboard
3. Copy the API key from the "API Keys" tab
4. Use the Root key or create a new key with capabilities: `publish`, `subscribe`, `presence`

5. Run the development server:

```bash
bun dev
```

5. Open your browser at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── ably-auth/       # Route handler for Ably authentication
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/
│   ├── chat/
│   │   ├── ActiveUsers.tsx   # Active users list
│   │   ├── ChatContainer.tsx # Main container component
│   │   ├── ChatFeed.tsx      # Chat message list
│   │   ├── ConnectionStatus.tsx # Connection status indicator
│   │   ├── MessageInput.tsx  # Message input component
│   │   └── NameForm.tsx      # Name input form
│   └── ui/                   # shadcn/ui components
├── hooks/
│   ├── useAblyConnection.ts  # Hook for Ably connection
│   ├── useMessages.ts        # Hook for messages
│   ├── usePresence.ts        # Hook for presence
│   └── useTypingIndicator.ts # Hook for typing indicator
├── lib/
│   ├── ably/
│   │   ├── client.ts         # Ably client initialization
│   │   └── constants.ts      # Ably constants
│   ├── utils/
│   │   ├── avatar.ts         # Avatar utilities
│   │   └── time.ts           # Timestamp utilities
│   ├── validations/
│   │   └── name.ts           # Zod schemas
│   ├── storage.ts            # localStorage utilities
│   ├── types.ts              # TypeScript types
│   └── utils.ts              # General utilities
```

## Clean Architecture Principles

This application follows clean architecture best practices:

### Separation of Concerns

- **Components**: UI layer focused on presentation
- **Hooks**: Business logic and state management
- **Lib**: Core utilities and services
- **API Routes**: Backend endpoints

### Dependency Injection

- Components receive data via props
- Hooks provide abstraction for external services (Ably)
- No hard-coded dependencies

### Single Responsibility

- Each component/hook has a single specific responsibility
- `ChatFeed` = display messages
- `MessageInput` = handle input
- `ActiveUsers` = show presence

### Type Safety

- TypeScript for all code
- Zod for runtime validation
- Strict type checking

### Reusability

- Custom hooks can be used in other components
- UI components from shadcn/ui
- Centralized utility functions

## Key Features

### Realtime Messaging

- Uses Ably Channels for pub/sub pattern
- Auto-loads last 50 messages from history
- Auto-scroll to latest messages
- Message grouping based on sender and time

### Presence System

- Real-time list of active users
- Auto enter/leave presence on join/disconnect
- Avatars with initials and unique colors

### Typing Indicator

- Throttled events (500ms cooldown)
- Auto-hide after 3 seconds
- Does not show typing from current user

### Connection Management

- Auto-reconnect on connection loss
- Visual indicator for connection status
- Graceful degradation

### Input Validation

- Name: 2-20 characters, alphanumeric + spaces
- Message: 1-300 characters
- Anti-spam cooldown 800ms
- Character counter

## UX Features

- **Message Grouping**: Messages from the same user are grouped together
- **Timestamps**: Relative time for each message
- **Virtualized List**: Smooth scrolling for thousands of messages
- **Responsive Layout**: Adaptive grid for mobile/desktop
- **Visual Feedback**: Loading states, error messages, typing indicators
- **Keyboard Shortcuts**: Enter = send, Shift+Enter = new line

## Security & Best Practices

- **Token-based Auth**: Ably authentication via backend route
- **Input Validation**: Client and server-side validation with Zod
- **Rate Limiting**: Anti-spam cooldown
- **No Sensitive Data**: Anonymous users, no PII storage
- **Type Safety**: Full TypeScript coverage

## Environment Variables

```env
NEXT_PUBLIC_ABLY_KEY=your_ably_api_key
```

**Note**: The `NEXT_PUBLIC_` prefix makes the variable accessible on the client-side.

## Development

```bash
# Run development server
bun dev

# Build for production
bun run build

# Run production server
bun start

# Lint
bun run lint
```

## License

MIT

## Author

Built with Next.js 16 and Ably
