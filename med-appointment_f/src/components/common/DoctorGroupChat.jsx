"use client";

import React, { useEffect, useState, useRef } from "react";
import dayjs from "dayjs";
import { socket } from "../../socket.js";
import axios from "axios";
import Navbar from "../common/Navbar";
import { Paperclip } from "lucide-react";

export default function DoctorGroupChat() {
  const [groups, setGroups] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const msgRef = useRef();

  const rawDoctorStore = JSON.parse(localStorage.getItem("doctor_user") || "null");
  const doctorId = rawDoctorStore?.doctor?.id ?? rawDoctorStore?.user?.id ?? null;
  const token = localStorage.getItem("doctor_token") || null;

  const API = axios.create({
    baseURL: "http://localhost:8000/api",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      Accept: "application/json",
    },
  });

  useEffect(() => {
    fetchGroups();

    const handler = (payload) => {
      if (selected?.id === payload.group_id) {
        setMessages((prev) => [...prev, payload]);
        scrollToBottom();
      }

      setGroups((gs) =>
        gs.map((g) =>
          g.id === payload.group_id ? { ...g, last_message: payload } : g
        )
      );
    };

    socket.connector.socket.on("message.new", handler);
    return () => socket.connector.socket.off("message.new", handler);
  }, [selected]);

  async function fetchGroups() {
    try {
      const res = await API.get("/doctor/groups");
      const clean = (res.data.data || res.data || []).map((g) => ({
        ...g,
        department_name: g.department?.name ?? "Không xác định",
      }));

      setGroups(clean);

      if (clean.length === 1) openGroup(clean[0]);
    } catch (err) {
      console.error("Load groups error", err);
    }
  }

  async function openGroup(g) {
    setSelected(g);
    try {
      const res = await API.get(`/chat/groups/${g.id}/messages`);
      setMessages(res.data?.data || []);
      scrollToBottom();
    } catch (err) {
      console.error("Open group error", err);
    }
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!text.trim() || !selected) return;

    try {
      const res = await API.post(`/chat/groups/${selected.id}/messages`, {
        content: text,
      });

      const msg = res.data?.data || res.data;
      if (msg) setMessages((prev) => [...prev, msg]);

      setText("");
      scrollToBottom();
    } catch (err) {
      console.error("Send message error", err);
    }
  }

  async function sendFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const form = new FormData();
      form.append("file", file);

      const upload = await API.post("/chat/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await API.post(`/chat/groups/${selected.id}/messages`, {
        content: upload.data.url,
        file_name: upload.data.name,
        file_type: upload.data.type,
      });
    } catch (err) {
      console.error("Upload file error", err);
      alert("Không thể upload file!");
    } finally {
      e.target.value = "";
    }
  }

  function scrollToBottom() {
    setTimeout(() => {
      if (msgRef.current) msgRef.current.scrollTop = msgRef.current.scrollHeight;
    }, 100);
  }

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto mt-24 rounded-2xl shadow-2xl overflow-hidden bg-white border border-gray-200">
        <div className="flex h-[78vh]">
          <div className="w-80 bg-gradient-to-b from-gray-50 to-gray-100 border-r shadow-inner overflow-y-auto">
            <div className="p-4 flex items-center justify-between border-b bg-white sticky top-0 z-10">
              <h3 className="font-bold text-lg text-gray-800">Nhóm chuyên khoa</h3>
              <button
                className="text-sm text-blue-600 hover:text-blue-800"
                onClick={fetchGroups}
              >
                ↻
              </button>
            </div>

            {groups.map((g) => (
              <div
                key={g.id}
                onClick={() => openGroup(g)}
                className={`p-4 cursor-pointer border-b transition-all duration-200 ${
                  selected?.id === g.id
                    ? "bg-blue-100 border-blue-300"
                    : "hover:bg-blue-50"
                }`}
              >
                <div className="font-semibold text-gray-800 text-sm">{g.name}</div>
                <div className="text-xs text-gray-500">{g.department_name}</div>

                {g.last_message && (
                  <div className="text-xs text-gray-400 truncate mt-1 italic">
                    {g.last_message.sender_name}: {g.last_message.content}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex-1 flex flex-col bg-gray-50">
            {!selected ? (
              <div className="flex-1 flex items-center justify-center text-gray-400 text-lg">
                Chọn nhóm để bắt đầu trò chuyện
              </div>
            ) : (
              <>
                <div className="p-4 border-b bg-white shadow-sm">
                  <div className="text-xl font-bold text-gray-800">{selected.name}</div>
                  <div className="text-sm text-gray-500">{selected.department_name}</div>
                </div>

                <div
                  ref={msgRef}
                  className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-100"
                >
                  {messages.map((m) => {
                    const isDoctorMessage = Number(m.user_id) === Number(doctorId);

                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col max-w-lg ${
                          isDoctorMessage ? "items-end ml-auto" : "items-start mr-auto"
                        }`}
                      >
                        <div className="text-xs text-gray-400 mb-1">
                          {m.sender_name} · {dayjs(m.created_at).format("HH:mm DD/MM")}
                        </div>

                        <div
                          className={`p-4 rounded-2xl shadow-md text-sm whitespace-pre-line ${
                            isDoctorMessage
                              ? "bg-blue-600 text-white rounded-br-sm"
                              : "bg-white text-gray-800 border rounded-bl-sm"
                          }`}
                        >
                          {m.file_type?.startsWith("image/") ? (
                            <img
                              src={m.content}
                              alt="img"
                              className="max-w-[240px] rounded-xl shadow-md"
                            />
                          ) : m.file_type ? (
                            <a
                              href={m.content}
                              target="_blank"
                              rel="noreferrer"
                              className="underline text-sm hover:text-blue-600"
                            >
                              📎 {m.file_name}
                            </a>
                          ) : (
                            m.content
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <form
                  onSubmit={sendMessage}
                  className="p-4 bg-white border-t flex items-center gap-3 shadow-inner"
                >
                  <label className="cursor-pointer p-2 hover:bg-gray-200 rounded-full transition">
                    <Paperclip className="text-gray-600" />
                    <input type="file" hidden onChange={sendFile} />
                  </label>

                  <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 px-4 py-2 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-400 outline-none"
                  />

                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow"
                  >
                    Gửi
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}