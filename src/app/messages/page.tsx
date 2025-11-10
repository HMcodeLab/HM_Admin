"use client";

import React, { useState } from "react";
import {
  FaPaperPlane,
  FaUsers,
  FaUser,
  FaSmile,
  FaPaperclip,
} from "react-icons/fa";

type Message = {
  id: number;
  sender: string;
  text: string;
  time: string;
  online?: boolean;
};

type User = {
  id: number;
  name: string;
  avatar?: string;
  online: boolean;
  unread: number;
};

type PrivateMessages = Record<number, Message[]>;

const mockGroupMessages: Message[] = [
  { id: 1, sender: "Alice", text: "Welcome to the group discussion! 🎉", time: "10:00", online: true },
  { id: 2, sender: "Bob", text: "Hi everyone! Looking forward to our discussion.", time: "10:01", online: true },
  { id: 3, sender: "You", text: "Thanks for having me! This looks great.", time: "10:02", online: true },
  { id: 4, sender: "Charlie", text: "Can someone share the meeting notes?", time: "10:05", online: false },
];

const mockUsers: User[] = [
  { id: 1, name: "Alice", avatar: "", online: true, unread: 0 },
  { id: 2, name: "Bob", avatar: "", online: true, unread: 2 },
  { id: 3, name: "Charlie", avatar: "", online: false, unread: 0 },
];

const mockPrivateMessages: PrivateMessages = {
  1: [
    { id: 1, sender: "You", text: "Hi Alice! Can we discuss the project timeline?", time: "09:55" },
    { id: 2, sender: "Alice", text: "Hello! Sure, I'm available now. What do you need?", time: "09:56" },
    { id: 3, sender: "You", text: "Great! I wanted to go over the deliverables for next week.", time: "09:57" },
  ],
  2: [
    { id: 1, sender: "You", text: "Hey Bob! Did you review the design mockups?", time: "09:50" },
    { id: 2, sender: "Bob", text: "Hey! Yes, I have some feedback to share.", time: "09:51" },
    { id: 3, sender: "You", text: "Perfect! Let's schedule a quick call.", time: "09:52" },
  ],
  3: [
    { id: 1, sender: "You", text: "Hi Charlie, welcome to the team! 👋", time: "08:30" },
  ],
};

interface ChatMessagesProps {
  messages: Message[];
  isGroup?: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isGroup = false }) => (
  <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
    {messages.map((msg) => (
      <div key={msg.id} className="flex items-start px-4 py-2 hover:bg-gray-50 transition-colors">
        <div className="relative mr-3 flex-shrink-0">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm ${
              msg.sender === "You" ? "bg-indigo-500" : "bg-green-500"
            }`}
          >
            {msg.sender[0]}
          </div>
          {(isGroup || msg.online) && (
            <div
              className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                msg.online ? "bg-green-500" : "bg-gray-400"
              }`}
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap mb-1">
            <span
              className={`text-sm font-medium mr-2 ${
                msg.sender === "You" ? "text-indigo-600" : "text-gray-900"
              }`}
            >
              {msg.sender}
            </span>
            <span className="text-xs text-gray-500">{msg.time}</span>
          </div>
          <p className="text-gray-800 text-sm leading-relaxed break-words">{msg.text}</p>
        </div>
      </div>
    ))}
  </div>
);

const OnlineIndicator: React.FC<{ online: boolean }> = ({ online }) => (
  <div
    className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
      online ? "bg-green-500" : "bg-gray-400"
    }`}
  />
);

const Discussion: React.FC = () => {
  const [tab, setTab] = useState<number>(0);
  const [privateUser, setPrivateUser] = useState<number>(mockUsers[0].id);
  const [groupInput, setGroupInput] = useState<string>("");
  const [privateInput, setPrivateInput] = useState<string>("");
  const [groupMessages, setGroupMessages] = useState<Message[]>(mockGroupMessages);
  const [privateMessages, setPrivateMessages] = useState<PrivateMessages>(mockPrivateMessages);

  const handleSendGroup = () => {
    if (groupInput.trim()) {
      setGroupMessages([
        ...groupMessages,
        {
          id: Date.now(),
          sender: "You",
          text: groupInput,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          online: true,
        },
      ]);
      setGroupInput("");
    }
  };

  const handleSendPrivate = () => {
    if (privateInput.trim()) {
      setPrivateMessages({
        ...privateMessages,
        [privateUser]: [
          ...(privateMessages[privateUser] || []),
          {
            id: Date.now(),
            sender: "You",
            text: privateInput,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ],
      });
      setPrivateInput("");
    }
  };

  const getActiveUser = () => mockUsers.find((u) => u.id === privateUser)!;

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-6 px-6">
        <h1 className="text-2xl font-bold mb-2">Team Discussion</h1>
        <p className="text-indigo-100">Connect and collaborate with your team</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border-b border-gray-200">
        <button
          onClick={() => setTab(0)}
          className={`flex-1 flex items-center justify-center py-4 font-medium transition-all ${
            tab === 0
              ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          <FaUsers className="mr-2" />
          Group Discussion
        </button>
        <button
          onClick={() => setTab(1)}
          className={`flex-1 flex items-center justify-center py-4 font-medium transition-all ${
            tab === 1
              ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          <FaUser className="mr-2" />
          Private Chat
        </button>
      </div>

      <div className="p-6">
        {/* Group Chat */}
        {tab === 0 && (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Team Chat</h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                    {mockUsers.filter((u) => u.online).length} online
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                    {groupMessages.length} messages
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 mb-4" />
            <ChatMessages messages={groupMessages} isGroup />
            <div className="flex items-center mt-6 p-4 bg-white rounded-xl border border-gray-200 shadow-sm gap-3">
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                <FaPaperclip />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                <FaSmile />
              </button>
              <input
                type="text"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Type your message to the group..."
                value={groupInput}
                onChange={(e) => setGroupInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendGroup()}
              />
              <button
                onClick={handleSendGroup}
                className="p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 flex-shrink-0"
              >
                <FaPaperPlane />
              </button>
            </div>
          </>
        )}

        {/* Private Chat */}
        {tab === 1 && (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Private Messages</h2>
              <p className="text-gray-600">Chat one-on-one with team members</p>
            </div>

            <div className="flex gap-2 mb-6 flex-wrap justify-center">
              {mockUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => setPrivateUser(user.id)}
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    privateUser === user.id
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="relative mr-2 flex-shrink-0">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                        privateUser === user.id ? "bg-white text-indigo-600" : "bg-indigo-500 text-white"
                      }`}
                    >
                      {user.name[0]}
                    </div>
                    <OnlineIndicator online={user.online} />
                  </div>
                  {user.name}
                  {user.unread > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {user.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="border-t border-gray-200 mb-4" />
            <div className="flex items-center mb-4 p-4 bg-white rounded-xl shadow-sm">
              <div className="relative mr-4 flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">
                  {getActiveUser().name[0]}
                </div>
                <OnlineIndicator online={getActiveUser().online} />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{getActiveUser().name}</h3>
                <p className="text-sm text-gray-500">
                  {getActiveUser().online ? "Online" : "Last seen recently"}
                </p>
              </div>
            </div>

            <ChatMessages messages={privateMessages[privateUser] || []} />
            <div className="flex items-center mt-6 p-4 bg-white rounded-xl border border-gray-200 shadow-sm gap-3">
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                <FaPaperclip />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                <FaSmile />
              </button>
              <input
                type="text"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder={`Message ${getActiveUser().name}...`}
                value={privateInput}
                onChange={(e) => setPrivateInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendPrivate()}
              />
              <button
                onClick={handleSendPrivate}
                className="p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 flex-shrink-0"
              >
                <FaPaperPlane />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Discussion;
