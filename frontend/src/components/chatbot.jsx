import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Send, Loader2, MessageCircle, User } from "lucide-react";
import HomeNavbar from "./HomeNavbar";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const adjustTextareaHeight = (e) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
  };

  const sendMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    setError(null);
    setIsLoading(true);
    const newMessages = [
      ...messages,
      { sender: "user", text: userInput.trim() },
    ];
    setMessages(newMessages);
    setUserInput("");

    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    try {
      const response = await axios.post(
        `${backendUrl}/chat`,
        { message: userInput.trim() },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );

      setMessages([
        ...newMessages,
        {
          sender: "bot",
          text: response.data.reply,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      setError("Failed to get response. Please try again.");
      setMessages([
        ...newMessages,
        {
          sender: "bot",
          text: "Sorry, I encountered an error. Please try again.",
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 min-h-screen">
      <HomeNavbar />
      <div className="flex flex-col w-full bg-gradient-to-r from-gray-800 to-gray-900 shadow-xl" style={{ height: 'calc(100vh - 64px)' }}>
        {/* Header */}
        <div className="bg-gray-800/50 p-6 shadow-lg w-full">
          <div className="flex items-center gap-4 w-full">
            <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                CP Mentor Bot
              </h2>
              <p className="text-cyan-300 text-sm">
                Ask me about competitive programming!
              </p>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-900/50">
          {messages.length === 0 && (
            <div className="text-center text-cyan-300/60 mt-8">
              <p className="text-sm">
                Start your CP journey with a question!
              </p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              } mb-4`}
            >
              {msg.sender === "bot" && (
                <div className="w-8 h-8 rounded-full bg-cyan-900/30 flex items-center justify-center mr-2">
                  <MessageCircle className="w-4 h-4 text-cyan-400" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  msg.sender === "user"
                    ? "bg-cyan-600 text-white rounded-br-none"
                    : msg.isError
                    ? "bg-red-900/50 text-red-300 rounded-bl-none"
                    : "bg-gray-800/50 text-cyan-50 rounded-bl-none"
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                {msg.timestamp && (
                  <p className="text-xs mt-1 opacity-75 text-cyan-300">
                    {formatTimestamp(msg.timestamp)}
                  </p>
                )}
              </div>
              {msg.sender === "user" && (
                <div className="w-8 h-8 rounded-full bg-cyan-600/30 flex items-center justify-center ml-2">
                  <User className="w-4 h-4 text-cyan-300" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="w-8 h-8 rounded-full bg-cyan-900/30 flex items-center justify-center mr-2">
                <MessageCircle className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="bg-gray-800/50 rounded-2xl px-4 py-2 rounded-bl-none">
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Error Display */}
        {error && (
          <div className="px-4 py-2 bg-red-900/50 text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 bg-gray-800/50 border-t border-gray-700">
          <div className="flex gap-2">
            <textarea
              ref={inputRef}
              value={userInput}
              onChange={(e) => {
                setUserInput(e.target.value);
                adjustTextareaHeight(e);
              }}
              onKeyPress={handleKeyPress}
              placeholder="Type your CP question..."
              className="flex-1 p-3 bg-gray-900/50 text-cyan-50 placeholder-cyan-300/50 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-cyan-400/50 border-none min-h-[44px] max-h-[150px] overflow-y-auto"
              style={{ height: 'auto' }}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !userInput.trim()}
              className="p-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="mt-2 text-xs text-cyan-400/75">
            Press Enter to send, Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;