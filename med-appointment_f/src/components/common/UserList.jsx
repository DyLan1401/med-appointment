import React, { useEffect, useState } from "react";
import API from "../api/axios";

export default function UsersList() {
    const [users, setUsers] = useState([]);
    const [err, setErr] = useState(null);

    useEffect(() => {
        API.get("/users")
            .then((res) => setUsers(res.data))
            .catch(() => setErr("Lỗi tải users"));
    }, []);

    return (
        <div style={{ border: "1px dashed #aaa", padding: 18 }}>
            <h2>Danh sách Users</h2>
            {err && <p style={{ color: "red" }}>{err}</p>}
            <ul>
                {users.map((u) => (
                    <li key={u.id}>{u.name} — {u.email}</li>
                ))}
            </ul>
        </div>
    );
}
