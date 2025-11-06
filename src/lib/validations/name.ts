import { z } from "zod";

export const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(20, "Name must be at most 20 characters")
  .regex(
    /^[a-zA-Z0-9\s]+$/,
    "Only alphanumeric characters and spaces are allowed"
  )
  .trim();

export const messageSchema = z
  .string()
  .min(1, "Message cannot be empty")
  .max(300, "Message must be at most 300 characters")
  .trim();

export type NameInput = z.infer<typeof nameSchema>;
export type MessageInput = z.infer<typeof messageSchema>;
