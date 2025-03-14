// Get auth token from https://twitchtokengenerator.com/
// Credits: SrTermax Team

"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { Chat } from "twitch-js";

declare global {
  interface Window {
    Twitch: {
      Embed: new (
        elementId: string,
        options: {
          width: string;
          height: string;
          channel: string;
          layout: string;
          theme: string;
        }
      ) => void;
    };
  }
}

export default function Home() {
  interface Message {
    username: string;
    message: string;
    color: string;
    badges: Record<string, string>;
    isModerator?: boolean;
    isSubscriber?: boolean;
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [channel, setChannel] = useState("ChannelDefualtExample");
  const chatRef = useRef<Chat | null>(null);
  const embedRef = useRef<HTMLDivElement | null>(null);
  const YouName = "SrTermax";

  useEffect(() => {
    const connectChat = async () => {
      if (chatRef.current) {
        await chatRef.current.disconnect();
      }
      const chat = new Chat({
        username: YouName,
        token: "oauth:YOUR_OAUTH_TOKEN",
        log: { enabled: false },
      });
      await chat.connect();
      await chat.join(channel);
      chatRef.current = chat;
      chat.on("PRIVMSG", (message) => {
        setMessages((prev) => [
          {
            username: message.username,
            message: message.message,
            color: "#FFFFFF",
            badges:
              "badges" in message.tags
                ? (message.tags.badges as Record<string, string>)
                : {},
            isModerator: "mod" in message.tags && message.tags.mod === "1",
            isSubscriber:
              "subscriber" in message.tags && message.tags.subscriber === "1",
          },
          ...prev.slice(0, 100),
        ]);
      });
    };
    connectChat();
    return () => {
      if (chatRef.current) {
        chatRef.current.disconnect();
      }
    };
  }, [channel]);

  useEffect(() => {
    if (window.Twitch && embedRef.current) {
      embedRef.current.innerHTML = "";
      new window.Twitch.Embed("twitch-embed", {
        width: "100%",
        height: "100%",
        channel: channel,
        layout: "video",
        theme: "dark",
      });
    }
  }, [channel]);

  const handleSendMessage = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (chatRef.current && newMessage.trim() !== "") {
      try {
        await chatRef.current.say(channel, newMessage);
        setMessages((prev) => [
          {
            username: YouName,
            message: newMessage,
            color: "#00BFFF",
            badges: {} as Record<string, string>,
          },
          ...prev.slice(0, 100),
        ]);
      } catch (err) {
        console.error("Error sending message:", err);
      }
      setNewMessage("");
    }
  };

  const handleSearch = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setChannel(searchTerm.trim() || channel);
  };

  return (
    <>
      <div className="flex items-center justify-center p-4">
        <input
          type="text"
          className="w-full max-w-md p-3 text-white bg-gray-700 border border-gray-600 rounded-full focus:ring-2 focus:ring-blue-500"
          placeholder="Example smash_ofc_"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="ml-3 p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-500"
        >
          Search
        </button>
      </div>

      <div className="min-h-screen  text-white flex flex-col lg:flex-row items-center p-6 gap-6">
        <div className="relative w-full lg:w-3/4 h-[80vh] bg-gray-800 rounded-lg overflow-hidden">
          <div id="twitch-embed" ref={embedRef} className="w-full h-full">
            <div className="absolute inset-0 flex items-center justify-center">
              Search a Streamer to watch...
            </div>
          </div>
          <Script
            src="https://embed.twitch.tv/embed/v1.js"
            strategy="afterInteractive"
          />
        </div>

        <div className="w-full lg:w-1/4 h-[80vh] flex flex-col border border-gray-700 p-4 rounded-lg bg-gray-800">
          <div className="flex-1 overflow-y-auto mb-4">
            {messages.map((msg, index) => (
              <p
                key={index}
                className="p-2 rounded-lg mb-2"
                style={{ color: msg.color }}
              >
                {msg.badges?.subscriber && (
                  <span className="text-yellow-500">[SUB] </span>
                )}
                {msg.badges?.premium && (
                  <span className="text-blue-500">[Premium] </span>
                )}
                {msg.isModerator && (
                  <span className="text-green-500">[MOD] </span>
                )}
                <span className="font-bold">{msg.username}:</span> {msg.message}
              </p>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="mt-2 flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Send a message..."
              className="flex-1 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="bg-purple-600 px-4 py-3 rounded-lg text-white hover:bg-purple-500"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
