# Architecture Documentation - ChatKu

## 🏗️ Clean Architecture Overview

ChatKu mengikuti prinsip Clean Architecture dengan pemisahan yang jelas antara layer:

```
┌─────────────────────────────────────────────────┐
│           Presentation Layer (UI)                │
│  ┌───────────────────────────────────────────┐  │
│  │  Components (React Components)            │  │
│  │  - NameForm, ChatFeed, MessageInput, etc  │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│         Application Layer (Business Logic)       │
│  ┌───────────────────────────────────────────┐  │
│  │  Custom Hooks                             │  │
│  │  - useAblyConnection, useMessages, etc    │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│         Domain Layer (Core Business)             │
│  ┌───────────────────────────────────────────┐  │
│  │  Types, Validations, Constants            │  │
│  │  - Message, User, nameSchema, etc         │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│    Infrastructure Layer (External Services)      │
│  ┌───────────────────────────────────────────┐  │
│  │  Ably Client, Storage, API Routes         │  │
│  │  - getAblyClient, storage, /api/ably-auth │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

## 📁 Layer Details

### 1. Presentation Layer (`src/components/`)

**Responsibility**: Render UI dan handle user interactions

**Components:**

- `ChatContainer.tsx` - Main orchestrator component
- `NameForm.tsx` - User name input form
- `ChatFeed.tsx` - Message list display
- `MessageInput.tsx` - Message input dengan validation
- `ActiveUsers.tsx` - Presence list display
- `ConnectionStatus.tsx` - Connection state indicator

**Principles:**

- ✅ Presentational only (no business logic)
- ✅ Receives data via props
- ✅ Emits events via callbacks
- ✅ Reusable and composable

### 2. Application Layer (`src/hooks/`)

**Responsibility**: Business logic dan state management

**Custom Hooks:**

- `useAblyConnection.ts` - Manage Ably connection lifecycle
- `useMessages.ts` - Handle message pub/sub
- `usePresence.ts` - Manage user presence
- `useTypingIndicator.ts` - Handle typing events

**Principles:**

- ✅ Encapsulate complex logic
- ✅ Reusable across components
- ✅ Single responsibility per hook
- ✅ Return clean interface

**Example Pattern:**

```typescript
const { messages, sendMessage } = useMessages(channel);
```

### 3. Domain Layer (`src/lib/`)

**Responsibility**: Core business rules dan entities

**Files:**

- `types.ts` - TypeScript interfaces
- `validations/name.ts` - Zod schemas
- `ably/constants.ts` - Business constants

**Principles:**

- ✅ Framework-agnostic
- ✅ No external dependencies (except validation libs)
- ✅ Pure functions
- ✅ Immutable data structures

### 4. Infrastructure Layer

**Responsibility**: External services integration

**Files:**

- `lib/ably/client.ts` - Ably SDK wrapper
- `lib/storage.ts` - localStorage wrapper
- `app/api/ably-auth/route.ts` - Auth endpoint

**Principles:**

- ✅ Abstracts external APIs
- ✅ Provides clean interface
- ✅ Handles errors gracefully
- ✅ Can be easily mocked for testing

## 🔄 Data Flow

### Message Sending Flow

```
User Input → MessageInput Component
    ↓
Validation (Zod Schema)
    ↓
ChatContainer (handleSendMessage)
    ↓
useMessages Hook (sendMessage)
    ↓
Ably Client (channel.publish)
    ↓
Ably Server
    ↓
All Subscribed Clients
    ↓
useMessages Hook (subscription callback)
    ↓
ChatFeed Component (re-render)
```

### Presence Flow

```
User Enters Name → NameForm
    ↓
ChatContainer (setCurrentUserName)
    ↓
usePresence Hook (channel.presence.enter)
    ↓
Ably Server
    ↓
All Subscribed Clients
    ↓
usePresence Hook (presence callback)
    ↓
ActiveUsers Component (re-render)
```

## 🎯 Design Patterns

### 1. **Custom Hooks Pattern**

Encapsulate complex logic dalam reusable hooks:

```typescript
export const useMessages = (channel: RealtimeChannel | null) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Subscribe logic
  }, [channel]);

  const sendMessage = async (text: string, userName: string) => {
    // Send logic
  };

  return { messages, sendMessage };
};
```

**Benefits:**

- Separation of concerns
- Easy to test
- Reusable logic
- Clean component code

### 2. **Dependency Injection Pattern**

Components receive dependencies via props:

```typescript
interface ChatFeedProps {
  messages: Message[];
  currentUserId: string;
  isLoading: boolean;
}

export const ChatFeed = ({
  messages,
  currentUserId,
  isLoading,
}: ChatFeedProps) => {
  // Component logic
};
```

**Benefits:**

- Loose coupling
- Easy to test (mock props)
- Flexible composition

### 3. **Repository Pattern**

Abstract storage access:

```typescript
export const storage = {
  getUserName: () => localStorage.getItem(CHAT_NAME_KEY),
  setUserName: (name: string) => localStorage.setItem(CHAT_NAME_KEY, name),
  // ...
};
```

**Benefits:**

- Single source of truth
- Easy to swap implementation
- Testable with mocks

### 4. **Observer Pattern**

Ably uses pub/sub pattern:

```typescript
channel.subscribe("message", (msg) => {
  // Handle incoming message
});

channel.publish("message", { text: "Hello" });
```

**Benefits:**

- Decoupled communication
- Real-time updates
- Scalable architecture

## 🧩 Component Composition

### Container/Presenter Pattern

**Container (ChatContainer):**

- Manages state
- Handles business logic
- Orchestrates child components

**Presenters (ChatFeed, MessageInput, etc):**

- Pure presentation
- No state management
- Receive props, emit events

```typescript
// Container
<ChatContainer>
  <ChatFeed messages={messages} />
  <MessageInput onSend={handleSend} />
  <ActiveUsers users={users} />
</ChatContainer>
```

## 🔐 Security Architecture

### Token-based Authentication

```
Client Request → Backend Route (/api/ably-auth)
    ↓
Generate Token Request (Ably SDK)
    ↓
Return Token to Client
    ↓
Client Uses Token (not API key directly)
```

**Benefits:**

- API key never exposed to client
- Tokens can expire
- Fine-grained permissions

### Input Validation

**Two-layer validation:**

1. **Client-side (Zod):**

```typescript
const result = messageSchema.safeParse(text);
if (!result.success) {
  // Show error
}
```

2. **Server-side (Future):**
   Can add validation in API routes for additional security

## 📊 State Management

### Local State (useState)

For component-specific state:

```typescript
const [text, setText] = useState("");
```

### Shared State (Custom Hooks)

For cross-component state:

```typescript
const { messages } = useMessages(channel); // Shared via Ably
```

### Persistent State (localStorage)

For user preferences:

```typescript
storage.setUserName(name); // Persists across sessions
```

## 🧪 Testing Strategy

### Unit Tests (Planned)

**Test Hooks:**

```typescript
test("useMessages should load history", async () => {
  const { result } = renderHook(() => useMessages(mockChannel));
  await waitFor(() => {
    expect(result.current.messages.length).toBeGreaterThan(0);
  });
});
```

**Test Components:**

```typescript
test("MessageInput validates max length", () => {
  const { getByRole } = render(<MessageInput onSend={jest.fn()} />);
  // Test validation
});
```

### Integration Tests (Planned)

Test complete flows:

```typescript
test("user can send message", async () => {
  render(<ChatContainer />);
  // Simulate user actions
  // Verify message appears
});
```

## 🚀 Performance Optimizations

### 1. **Virtualized List (react-virtuoso)**

Renders only visible messages:

```typescript
<Virtuoso
  data={messages}
  itemContent={(index, message) => <MessageItem message={message} />}
/>
```

**Benefits:**

- Handles 1000+ messages smoothly
- Reduced memory usage
- Fast scrolling

### 2. **Memoization (React.memo)**

Prevent unnecessary re-renders:

```typescript
export const MessageItem = React.memo(({ message }: Props) => {
  // Component
});
```

### 3. **Debounced Typing Events**

Reduce network calls:

```typescript
const [lastTypingTime, setLastTypingTime] = useState(0);
if (now - lastTypingTime < TYPING_COOLDOWN) return;
```

## 🎨 UI/UX Architecture

### Responsive Design

```typescript
<div className="grid grid-cols-1 lg:grid-cols-3">
  <div className="lg:col-span-2"> {/* Chat */} </div>
  <div> {/* Sidebar */} </div>
</div>
```

### Loading States

Progressive enhancement:

```typescript
if (isLoading) return <LoadingSpinner />;
if (!data) return <EmptyState />;
return <Content data={data} />;
```

### Error Boundaries (Future)

Graceful error handling:

```typescript
<ErrorBoundary fallback={<ErrorFallback />}>
  <ChatContainer />
</ErrorBoundary>
```

## 📝 Code Style Guide

### Naming Conventions

- **Components**: PascalCase (`ChatFeed`)
- **Hooks**: camelCase with `use` prefix (`useMessages`)
- **Functions**: camelCase (`sendMessage`)
- **Constants**: UPPER_SNAKE_CASE (`CHANNEL_NAME`)
- **Types**: PascalCase (`Message`, `User`)

### File Organization

```
ComponentName/
  - ComponentName.tsx (main component)
  - ComponentName.test.tsx (tests)
  - ComponentName.types.ts (local types)
  - index.ts (barrel export)
```

### Import Order

```typescript
// 1. React imports
import { useState, useEffect } from "react";

// 2. External libraries
import * as Ably from "ably";

// 3. Internal imports (absolute)
import { Message } from "@/lib/types";
import { useMessages } from "@/hooks/useMessages";

// 4. Relative imports
import { formatTimestamp } from "./utils";
```

## 🔄 Future Improvements

### Scalability

1. **Message Pagination**: Load messages on scroll
2. **Message Search**: Full-text search functionality
3. **User Profiles**: Avatar upload, bio, etc
4. **Multiple Rooms**: Channel switching
5. **Direct Messages**: 1-on-1 chat

### Performance

1. **Service Worker**: Offline support
2. **Image Optimization**: Lazy load images
3. **Code Splitting**: Dynamic imports for large features

### Features

1. **Markdown Support**: Rich text messages
2. **File Upload**: Share images/files
3. **Reactions**: Emoji reactions to messages
4. **Notifications**: Browser push notifications
5. **Moderation**: Admin controls, mute/kick users

## 📚 References

- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [React Hooks Best Practices](https://react.dev/reference/react)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Ably Realtime Documentation](https://ably.com/docs)
- [Zod Validation](https://zod.dev)

---

**Architecture Version**: 1.0.0  
**Last Updated**: November 2025  
**Maintainer**: ChatKu Team
