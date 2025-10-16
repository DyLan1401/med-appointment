import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import LoadingOverlay from "../common/LoadingOverlay";
import ConfirmModal from "../common/ConfirmModal";
import Pagination from "../common/Pagination";

export default function ManagerDoctor() {
    const [specializations, setSpecializations] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [search, setSearch] = useState({
        name: "",
        specialization: ""
    });

    const [form, setForm] = useState({
        id: null, name: "", email: "", password: "",
        specialization: "", bio: "", phone: ""
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [detailDoctor, setDetailDoctor] = useState(null);

    // Phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Fetch danh sách
    useEffect(() => {
        fetchDoctors();
        fetchSpecializations();
    }, []);
    const fetchSpecializations = async () => {
        try {
            const res = await API.get("/specializations");
            setSpecializations(res.data);
        } catch (err) {
            console.error(err);
            alert("Không thể tải danh sách chuyên khoa!");
        }
    };

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const params = {};
            if (search.name) params.name = search.name;
            if (search.specialization) params.specialization = search.specialization;

            const res = await API.get("/doctors", { params });
            setDoctors(res.data);
        } catch (err) {
            console.error(err);
            alert("Không thể tải danh sách bác sĩ!");
        } finally {
            setLoading(false);
        }
    };

    // Thêm hoặc sửa
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditing) {
                const res = await API.put(`/doctors/${form.id}`, form);
                setDoctors(doctors.map(d => d.id === form.id ? res.data.doctor : d));
                alert("Cập nhật thành công!");
            } else {
                const res = await API.post("/doctors", form);
                setDoctors([...doctors, res.data.doctor]);
                alert("Thêm thành công!");
            }
            resetForm();
        } catch (err) {
            console.error(err);
            alert("Lỗi khi lưu bác sĩ!");
        } finally { setLoading(false); }
    };

    const resetForm = () => {
        setForm({ id: null, name: "", email: "", password: "", specialization: "", bio: "", phone: "" });
        setIsEditing(false);
    };

    // Sửa / Xem / Xóa
    const handleEdit = (d) => {
        setForm({
            id: d.id, name: d.user?.name, email: d.user?.email,
            specialization: d.specialization, bio: d.bio, phone: d.user?.phone
        });
        setIsEditing(true);
    };
    const handleDelete = async () => {
        setLoading(true);
        try {
            await API.delete(`/doctors/${deleteId}`);
            setDoctors(doctors.filter(d => d.id !== deleteId));
            alert("Đã xóa!");
        } finally {
            setLoading(false);
            setDeleteId(null);
        }
    };
    const openDetail = (d) => setDetailDoctor(d);

    // Phân trang dữ liệu
    const totalPages = Math.ceil(doctors.length / itemsPerPage);
    const visibleDoctors = doctors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="p-6">
            <LoadingOverlay show={loading} message="Đang xử lý..." />

            <h1 className="text-blue-500 text-xl font-semibold mb-4">Quản lý Bác sĩ</h1>

            {/* Form */}
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-lg shadow">
                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Tên bác sĩ</label>
                    <input type="text" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="border p-2 rounded w-full" required />
                </div>
                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="border p-2 rounded w-full" required />
                </div>
                {!isEditing && (
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                        <input type="password" value={form.password || ""} onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="border p-2 rounded w-full" required />
                    </div>
                )}
                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                    <input type="text" value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="border p-2 rounded w-full" />
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Chuyên khoa</label>
                    <select
                        value={form.specialization || ""}
                        onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                        className="border p-2 rounded w-full"
                        required
                    >
                        <option value="">-- Chọn chuyên khoa --</option>
                        {specializations.map((sp) => (
                            <option key={sp.id} value={sp.name}>
                                {sp.name}
                            </option>
                        ))}
                    </select>

                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Mô tả chuyên môn</label>
                    <textarea value={form.bio || ""} onChange={(e) => setForm({ ...form, bio: e.target.value })}
                        className="border p-2 rounded w-full" />
                </div>
                <div className="col-span-2 text-right">
                    <button className={`${isEditing ? "bg-green-500" : "bg-blue-500"} text-white px-4 py-2 rounded`}>
                        {isEditing ? "Cập nhật bác sĩ" : "Thêm bác sĩ mới"}
                    </button>
                </div>
            </form>

            {/*Form tìm kiếm*/}
            <div className="flex items-center gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Tìm theo tên bác sĩ..."
                    value={search.name}
                    onChange={(e) => setSearch({ ...search, name: e.target.value })}
                    className="border p-2 rounded w-1/3"
                />
                <input
                    type="text"
                    placeholder="Tìm theo chuyên khoa..."
                    value={search.specialization}
                    onChange={(e) => setSearch({ ...search, specialization: e.target.value })}
                    className="border p-2 rounded w-1/3"
                />
                <button
                    onClick={fetchDoctors}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Tìm kiếm
                </button>
                <button
                    onClick={() => {
                        setSearch({ name: "", specialization: "" });
                        fetchDoctors();
                    }}
                    className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                    Làm mới
                </button>
            </div>

            {/* Danh sách */}
            <table className="w-full border rounded-lg shadow">
                <thead className="bg-blue-500 text-white">
                    <tr>
                        <th className="p-2">Tên</th>
                        <th>Email</th>
                        <th>Chuyên khoa</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {visibleDoctors.map((d) => (
                        <tr key={d.id} className="border text-center">
                            <td>{d.user?.name}</td>
                            <td>{d.user?.email}</td>
                            <td>{d.specialization}</td>
                            <td>{d.status}</td>
                            <td className="space-x-2">
                                <button onClick={() => openDetail(d)} className="text-blue-600 hover:underline">Xem</button>
                                <button onClick={() => handleEdit(d)} className="text-green-600 hover:underline">Sửa</button>
                                <button onClick={() => setDeleteId(d.id)} className="text-red-600 hover:underline">Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

            {/* Modal Xác nhận xóa */}
            <ConfirmModal
                show={!!deleteId}
                title="Xóa bác sĩ"
                message={`Bạn có chắc muốn xóa bác sĩ #${deleteId}?`}
                danger
                confirmText="Xóa"
                onConfirm={handleDelete}
                onCancel={() => setDeleteId(null)}
            />

            {/* Modal Chi tiết bác sĩ */}
            {detailDoctor && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-bold text-blue-600 mb-2">Thông tin bác sĩ</h2>
                        <p><b>Tên:</b> {detailDoctor.user?.name}</p>
                        <p><b>Email:</b> {detailDoctor.user?.email}</p>
                        <p><b>SĐT:</b> {detailDoctor.user?.phone}</p>
                        <p><b>Chuyên khoa:</b> {detailDoctor.specialization}</p>
                        <p><b>Mô tả:</b> {detailDoctor.bio}</p>
                        <p><b>Trạng thái:</b> {detailDoctor.status}</p>
                        <div className="text-right mt-4">
                            <button onClick={() => setDetailDoctor(null)} className="bg-blue-500 text-white px-4 py-2 rounded">Đóng</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
