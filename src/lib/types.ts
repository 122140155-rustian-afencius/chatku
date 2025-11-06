export interface Message {
  id: string;
  text: string;
  userId: string;
  userName: string;
  timestamp: number;
}

export interface User {
  userId: string;
  userName: string;
  avatar?: string;
}

export interface PresenceMember {
  clientId: string;
  data: {
    userName: string;
  };
}

export interface ConnectionStatus {
  state: "connected" | "connecting" | "disconnected" | "failed";
}
