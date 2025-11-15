"use client";

import React, { useEffect, useState, useRef } from "react";
import dayjs from "dayjs";
import { Paperclip, X, Users } from "lucide-react";

import API from "../../api/axios";
import { socket } from "../../socket.js";

export default function AdminChat() {
  const [groups, setGroups] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [text, setText] = useState("");
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const msgRef = useRef();

  const rawAdminStore = JSON.parse(localStorage.getItem("admin_user") || "null");
  const rawUserStore = JSON.parse(localStorage.getItem("user") || "null");
  const admin = rawAdminStore?.user || rawUserStore?.user || null;
  const adminId = admin?.id ?? null;

  // INIT
  useEffect(() => {
    const token =
      localStorage.getItem("admin_token") ||
      localStorage.getItem("token") ||
      null;

    if (token) {
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    fetchGroups();
    setLoading(false);

    const handler = (payload) => {
      if (selected?.id === payload.group_id) {
        setMessages((prev) => [...prev, payload]);
        scrollToBottom();
      }

      setGroups((list) =>
        list.map((g) =>
          g.id === payload.group_id ? { ...g, last_message: payload } : g
        )
      );
    };

    socket.connector.socket.on("message.new", handler);

    return () => {
      socket.connector.socket.off("message.new", handler);
    };
  }, [selected]);

  // FETCH GROUPS
  async function fetchGroups() {
    try {
      const res = await API.get("/chat/groups");
      let data = res.data?.data || res.data || [];

      data = data.map((g) => ({
        ...g,
        department_name: g?.department?.name ?? "Không xác định",
      }));

      setGroups(data);
    } catch (err) {
      console.error("fetchGroups:", err);
      if (err?.response?.status === 401) {
        alert("Phiên đăng nhập hết hạn!");
        window.location.href = "/login";
      }
    }
  }

  // OPEN GROUP
  async function openGroup(g) {
    setSelected(g);

    try {
      const res = await API.get(`/chat/groups/${g.id}/messages`);
      const msgs = res.data?.data || res.data || [];
      setMessages(msgs);

      socket.connector.socket.emit("join", {
        channel: `chat-group.${g.id}`,
      });

      scrollToBottom();
    } catch (err) {
      console.error("openGroup:", err);
    }
  }

  // MEMBERS
  async function openMembers() {
    if (!selected) return;

    try {
      const res = await API.get(`/chat/groups/${selected.id}/members`);
      setMembers(res.data?.data || res.data || []);
      setShowMembersModal(true);
    } catch (err) {
      console.error("load members:", err);
    }
  }

  async function kickMember(id) {
    if (!confirm("Bạn chắc chắn muốn kick thành viên này?")) return;

    try {
      await API.post(`/chat/groups/${selected.id}/kick`, { user_id: id });
      await openMembers();
    } catch (err) {
      console.error("kick:", err);
    }
  }

  // SEND MESSAGE
  async function sendMessage(e) {
    e.preventDefault();
    if (!text.trim() || !selected) return;

    try {
      await API.post(`/chat/groups/${selected.id}/messages`, {
        content: text,
      });
      setText("");
    } catch (err) {
      console.error("sendMessage:", err);
    }
  }

  // SEND FILE
  async function sendFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const form = new FormData();
      form.append("file", file);

      const res = await API.post("/chat/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await API.post(`/chat/groups/${selected.id}/messages`, {
        content: res.data.url,
        file_name: res.data.name,
        file_type: res.data.type,
      });
    } catch {
      alert("Không thể upload file!");
    } finally {
      e.target.value = "";
    }
  }

  // SCROLL
  function scrollToBottom() {
    setTimeout(() => {
      if (msgRef.current) msgRef.current.scrollTop = msgRef.current.scrollHeight;
    }, 100);
  }

  // LOADING
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh] text-gray-400 text-lg">
        Đang tải...
      </div>
    );
  }

  return (
    <div className="flex h-[80vh] bg-gray-100 rounded-xl shadow-2xl overflow-hidden">

      {/* SIDEBAR */}
      <div className="w-80 bg-white border-r shadow-md overflow-y-auto flex flex-col">
        <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-blue-500 text-white flex justify-between items-center shadow">
          <h3 className="font-semibold text-lg">Nhóm chat</h3>
          <button className="text-sm opacity-90 hover:opacity-100" onClick={fetchGroups}>
            ↻
          </button>
        </div>

        <div className="flex-1">
          {groups.map((g) => (
            <div
              key={g.id}
              onClick={() => openGroup(g)}
              className={`p-3 cursor-pointer transition-all border-b hover:bg-blue-50 ${
                selected?.id === g.id ? "bg-blue-100 shadow-inner" : ""
              }`}
            >
              <div className="font-medium text-gray-800">{g.name}</div>
              <div className="text-xs text-gray-500">{g.department_name}</div>

              {g.last_message && (
                <div className="text-xs text-gray-400 truncate mt-1">
                  {g.last_message.sender_name}: {g.last_message.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 flex flex-col">
        {!selected ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Chọn nhóm để bắt đầu
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="p-4 border-b bg-white shadow flex justify-between items-center">
              <div>
                <div className="font-bold text-lg text-gray-800">{selected.name}</div>
                <div className="text-sm text-gray-500">{selected.department_name}</div>
              </div>

              <button
                onClick={openMembers}
                className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg flex items-center gap-1 transition"
              >
                <Users size={16} /> Thành viên
              </button>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50" ref={msgRef}>
              {messages.map((m) => {
                const isAdminMessage = Number(m.user_id) === Number(adminId);
                return (
                  <div
                    key={m.id}
                    className={`mb-4 max-w-[75%] ${
                      isAdminMessage ? "ml-auto text-right" : ""
                    }`}
                  >
                    <div className="text-xs text-gray-400 mb-1">
                      {m.sender_name} · {dayjs(m.created_at).format("HH:mm DD/MM")}
                    </div>

                    <div
                      className={`p-3 rounded-2xl shadow-sm transition ${
                        isAdminMessage
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-white border rounded-bl-none"
                      }`}
                    >
                      {m.file_type ? (
                        m.file_type.startsWith("image/") ? (
                          <img src={m.content} className="max-w-[250px] rounded-xl shadow" />
                        ) : (
                          <a
                            href={m.content}
                            target="_blank"
                            rel="noreferrer"
                            className="underline text-sm"
                          >
                            📎 {m.file_name}
                          </a>
                        )
                      ) : (
                        m.content
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* SEND MESSAGE */}
            <form
              onSubmit={sendMessage}
              className="p-3 border-t bg-white flex items-center gap-3 shadow-inner"
            >
              <label className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition">
                <Paperclip className="text-gray-600" />
                <input type="file" hidden onChange={sendFile} />
              </label>

              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-1 border rounded-full px-4 py-2 outline-none bg-gray-50 focus:bg-white transition shadow-sm"
                placeholder="Nhập tin nhắn..."
              />

              <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow transition">
                Gửi
              </button>
            </form>
          </>
        )}
      </div>

      {/* MEMBERS MODAL */}
      {showMembersModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
          <div className="w-96 bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="p-4 border-b bg-blue-600 text-white flex justify-between items-center">
              <h3 className="font-semibold">Thành viên nhóm</h3>
              <X className="cursor-pointer" onClick={() => setShowMembersModal(false)} />
            </div>

            <div className="p-4 max-h-72 overflow-y-auto">
              {members.map((m) => (
                <div
                  key={m.id}
                  className="flex justify-between items-center py-3 border-b"
                >
                  <div>
                    <div className="font-medium text-gray-800">{m.name}</div>
                    <div className="text-xs text-gray-500">{m.email}</div>
                  </div>

                  <button
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg transition"
                    onClick={() => kickMember(m.id)}
                  >
                    Kick
                  </button>
                </div>
              ))}
            </div>

            <div className="p-4 border-t text-right bg-gray-50">
              <button
                onClick={() => setShowMembersModal(false)}
                className="px-4 py-1 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}