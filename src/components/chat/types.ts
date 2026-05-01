export type Message = {
  id: string;
  role: "bot" | "user";
  text: string;
  timestamp: string;
};

export type Session = {
  id: string;
  title: string;
  lastUpdated: string;
  preview: string;
  messages: Message[];
};

export type ChatScreen = "home" | "chat" | "history";
