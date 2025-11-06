import { nanoid } from "nanoid";

const CHAT_NAME_KEY = "chat_name";
const USER_ID_KEY = "chat_user_id";

export const storage = {
  getUserName: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(CHAT_NAME_KEY);
  },

  setUserName: (name: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(CHAT_NAME_KEY, name);
  },

  getUserId: (): string => {
    if (typeof window === "undefined") return "";
    let userId = localStorage.getItem(USER_ID_KEY);
    if (!userId) {
      userId = nanoid();
      localStorage.setItem(USER_ID_KEY, userId);
    }
    return userId;
  },

  clearAll: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(CHAT_NAME_KEY);
    localStorage.removeItem(USER_ID_KEY);
  },
};
