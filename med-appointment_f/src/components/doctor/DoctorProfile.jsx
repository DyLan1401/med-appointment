"use client";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Upload, Trash2, Save, Loader2 } from "lucide-react";

// ✅ Thêm Navbar dùng chung
import Navbar from "../common/Navbar";

export default function DoctorProfile() {
  const { id } = useParams();
  const [doctorId, setDoctorId] = useState(id || null);

  // ✅ Tự động lấy ID từ localStorage nếu URL không có
  useEffect(() => {
    if (!doctorId) {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.id) {
        setDoctorId(user.id);
      } else {
        console.warn("⚠️ Không tìm thấy user trong localStorage!");
      }
    }
  }, [doctorId]);

  const API_URL = "http://localhost:8000/api";
  const [doctor, setDoctor] = useState({});
  const [certificates, setCertificates] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // 🩺 Lấy thông tin bác sĩ
  const fetchDoctor = async () => {
    if (!doctorId) return;
    try {
      const res = await fetch(`${API_URL}/doctors/${doctorId}/profile`, {
        headers: { Accept: "application/json" },
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "❌ Không tải được hồ sơ!");
        return;
      }

      setDoctor({
        id: data.id,
        name: data.user?.name || "",
        email: data.user?.email || "",
        phone: data.user?.phone || "",
        specialization_id: data.specialization_id || "",
        bio: data.bio || "",
        avatar_url: data.user?.avatar_url || "",
      });

      setCertificates(data.certificates || []);
      setMessage("");
    } catch (err) {
      console.error("Fetch error:", err);
      setMessage("❌ Không thể kết nối đến máy chủ!");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctor();
  }, [doctorId]);

  // 🖼 Upload ảnh đại diện
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !doctorId) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await fetch(`${API_URL}/doctors/${doctorId}/avatar`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Ảnh đại diện đã được cập nhật!");
        await fetchDoctor();
      } else {
        setMessage(data.message || "❌ Cập nhật ảnh thất bại!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("❌ Lỗi khi tải ảnh!");
    } finally {
      setUploading(false);
    }
  };

  // 💾 Cập nhật hồ sơ bác sĩ
  const handleSave = async () => {
    if (!doctorId) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("name", doctor.name);
    formData.append("email", doctor.email);
    formData.append("phone", doctor.phone);
    formData.append("bio", doctor.bio);
    formData.append("specialization_id", doctor.specialization_id);

    try {
      const res = await fetch(`${API_URL}/doctors/${doctorId}/profile`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Cập nhật hồ sơ thành công!");
        await fetchDoctor();
      } else {
        setMessage(data.message || "❌ Cập nhật thất bại!");
      }
    } catch (error) {
      console.error("Save error:", error);
      setMessage("❌ Không thể kết nối máy chủ!");
    } finally {
      setLoading(false);
    }
  };

  // 📄 Upload chứng chỉ
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !doctorId) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("certificate_name", file.name);
    formData.append(
      "certificate_type",
      file.type.includes("pdf") ? "pdf" : "image"
    );

    try {
      const res = await fetch(`${API_URL}/doctors/${doctorId}/certificates`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Upload chứng chỉ thành công!");
        await fetchDoctor();
      } else {
        setMessage(data.message || "❌ Upload thất bại!");
      }
    } catch (error) {
      console.error("Upload certificate error:", error);
      setMessage("❌ Không thể upload chứng chỉ!");
    }
  };

  // ❌ Xóa chứng chỉ
  const handleDeleteFile = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa chứng chỉ này?")) return;
    try {
      const res = await fetch(`${API_URL}/doctors/certificates/${id}`, {
        method: "DELETE",
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setMessage("✅ Đã xóa chứng chỉ!");
        await fetchDoctor();
      } else {
        setMessage("❌ Xóa thất bại!");
      }
    } catch (error) {
      console.error("Delete error:", error);
      setMessage("❌ Không thể kết nối máy chủ!");
    }
  };

  if (pageLoading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <Loader2 size={30} className="animate-spin text-blue-600 mr-2" />
          <p>Đang tải hồ sơ bác sĩ...</p>
        </div>
      </>
    );
  }

  return (
    <>
      {/* ✅ Navbar thêm vào đây */}
      <Navbar />

      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-8 mt-28 border-t-8 border-blue-500">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          Hồ sơ cá nhân Bác sĩ
        </h2>

        {message && (
          <p
            className={`text-center font-medium mb-4 ${
              message.includes("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <img
              src={
                doctor.avatar_url ||
                "https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
              }
              onError={(e) => {
                e.target.src =
                  "https://cdn-icons-png.flaticon.com/512/4140/4140048.png";
              }}
              className="w-32 h-32 rounded-full border-4 border-blue-300 shadow-md object-cover"
              alt="Avatar"
            />
            {uploading && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-full">
                <Loader2 className="animate-spin text-blue-600" size={28} />
              </div>
            )}
          </div>
          <label className="mt-3 cursor-pointer text-blue-600 text-sm hover:underline">
            <Upload size={16} className="inline mr-1" /> Thay ảnh đại diện
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {["name", "email", "phone", "specialization_id"].map((f) => (
            <input
              key={f}
              value={doctor[f] || ""}
              onChange={(e) => setDoctor({ ...doctor, [f]: e.target.value })}
              className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        <textarea
          value={doctor.bio || ""}
          onChange={(e) => setDoctor({ ...doctor, bio: e.target.value })}
          rows="4"
          className="mt-4 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleSave}
          disabled={loading}
          className={`mt-5 w-full bg-blue-600 text-white py-3 rounded-lg flex justify-center items-center font-semibold hover:bg-blue-700 transition ${
            loading && "opacity-60 cursor-not-allowed"
          }`}
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin mr-2" />
          ) : (
            <Save size={18} className="mr-2" />
          )}
          {loading ? "Đang lưu..." : "Lưu thay đổi"}
        </button>

        {/* Chứng chỉ */}
        <div className="mt-10">
          <h3 className="font-bold text-gray-700 mb-3 text-lg">
            Chứng chỉ & Bằng cấp
          </h3>

          <label className="border-2 border-dashed border-blue-300 p-6 rounded-lg flex flex-col items-center cursor-pointer hover:bg-blue-50 transition text-blue-600 font-medium">
            <Upload size={24} className="mb-1" />
            <span>Tải lên chứng chỉ mới</span>
            <input type="file" className="hidden" onChange={handleFileUpload} />
          </label>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {certificates.length > 0 ? (
              certificates.map((file) => (
                <div
                  key={file.id}
                  className="relative border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition bg-gray-50"
                >
                  {file.certificate_type === "pdf" ? (
                    <iframe
                      src={file.file_url}
                      className="w-full h-40"
                    />
                  ) : (
                    <img
                      src={file.file_url}
                      className="w-full h-40 object-cover"
                    />
                  )}

                  <div className="p-3">
                    <p className="font-semibold text-gray-800 truncate">
                      {file.certificate_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {file.certificate_type}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteFile(file.id)}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-red-50 transition"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center col-span-2 mt-3">
                Chưa có chứng chỉ nào được tải lên.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}