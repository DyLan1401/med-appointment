"use client";
import { useState } from "react";
import { Bot, X, Send } from "lucide-react";
import API from "../../api/axios";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "🤖 Xin chào! Tôi là ChatCare – trợ lý ảo y tế của bạn 💙. Tôi có thể giúp gì hôm nay?" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMsg = { from: "user", text: input };
    setMessages((prev) => [...prev, newMsg]);

    try {
      const res = await API.post("/chatbot", { message: input });
      const reply = res.data.reply;
      setMessages((prev) => [...prev, { from: "bot", text: reply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Xin lỗi, hệ thống đang gặp sự cố 😔. Vui lòng thử lại sau nhé." },
      ]);
    } finally {
      setInput("");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* ===== NÚT MỞ CHAT ===== */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
        >
          <Bot size={30} className="text-white" /> {/* 🤖 Icon robot hiện đại */}
        </button>
      )}

      {/* ===== HỘP CHAT ===== */}
      {open && (
        <div className="w-80 sm:w-96 bg-white shadow-2xl rounded-2xl overflow-hidden border border-blue-200 animate-fadeIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot size={20} className="text-white" />
              <span className="font-semibold">ChatCare – Trợ lý sức khỏe</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="hover:text-gray-200 transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Chat body */}
          <div className="p-3 h-80 overflow-y-auto space-y-3 bg-blue-50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                    m.from === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none shadow"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 flex gap-2 border-t bg-white">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="flex-1 px-3 py-2 rounded-full border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-3 py-2 rounded-full hover:bg-blue-700 transition-all flex items-center justify-center"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}