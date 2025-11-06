import * as Ably from "ably";

let ablyClient: Ably.Realtime | null = null;

export const getAblyClient = (clientId: string): Ably.Realtime => {
  if (!ablyClient) {
    ablyClient = new Ably.Realtime({
      authUrl: `/api/ably-auth?clientId=${encodeURIComponent(clientId)}`,
      authMethod: "POST",
      clientId,
    });
  }
  return ablyClient;
};

export const disconnectAbly = (): void => {
  if (ablyClient) {
    ablyClient.close();
    ablyClient = null;
  }
};
