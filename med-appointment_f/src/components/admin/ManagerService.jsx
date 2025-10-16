import React, { useState, useEffect } from "react";
import API from "../../api/axios"; // dùng axios instance có token & baseURL

export default function ManagerService() {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: "",
    price: "",
  });
  const [deleteId, setDeleteId] = useState(null);

  // ✅ Dùng API_URL thay vì /services
  const API_URL = "/services";

// 🟢 Lấy danh sách dịch vụ
const fetchServices = async () => {
  try {
    console.log("Gọi API:", API.defaults.baseURL + API_URL);
    const res = await API.get(API_URL);
    console.log("Dữ liệu trả về:", res.data.data); // kiểm tra
    // ✅ lấy đúng mảng data
    setServices(res.data.data || []);
  } catch (err) {
    console.error("Lỗi khi tải danh sách:", err);
    setMessage({ type: "error", text: "Không thể tải danh sách dịch vụ." });
  }
};

  useEffect(() => {
    fetchServices();
  }, []);

  // 🟢 Mở modal thêm/sửa
  const handleOpenModal = (edit = false, item = null) => {
    setIsEdit(edit);
    if (edit && item) setFormData(item);
    else setFormData({ id: null, name: "", description: "", price: "" });
    setShowModal(true);
  };

  // 🔴 Đóng modal
  const handleCloseModal = () => setShowModal(false);

  // 🟡 Gửi dữ liệu thêm/sửa
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (isEdit) {
        res = await API.put(`${API_URL}/${formData.id}`, {
          name: formData.name,
          description: formData.description,
          price: formData.price,
        });
      } else {
        res = await API.post(API_URL, {
          name: formData.name,
          description: formData.description,
          price: formData.price,
        });
      }
      setMessage({ type: "success", text: res.data.message });
      await fetchServices();
      setShowModal(false);
    } catch (err) {
      console.error("Lỗi khi lưu:", err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Đã xảy ra lỗi khi lưu.",
      });
    }
  };

  // 🔴 Xóa dịch vụ
  const handleDelete = async () => {
    try {
      const res = await API.delete(`${API_URL}/${deleteId}`);
      setMessage({ type: "success", text: res.data.message });
      await fetchServices();
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Không thể xóa dịch vụ.",
      });
    }
  };

  return (
    <div className="w-full h-screen">
      <div className="w-full h-full flex flex-col p-3">
        <h1 className="text-blue-500 text-xl font-semibold py-5">Quản lí Dịch vụ</h1>
        <div className="py-3 text-gray-600">Danh sách Dịch vụ trong hệ thống.</div>

        {/* Thông báo */}
        {message && (
          <div
            className={`p-3 mb-3 rounded-lg text-white ${
              message.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="flex justify-between items-center py-2">
          <div className="relative max-w-md">
            <input
              type="search"
              placeholder="Tìm kiếm Dịch vụ"
              className="block w-full p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-200"
            />
            <svg
              className="w-4 h-4 text-gray-500 absolute top-3 left-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>

          <button
            onClick={() => handleOpenModal(false)}
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
          >
            Thêm Dịch vụ
          </button>
        </div>

        {/* Bảng danh sách */}
        <div className="relative overflow-x-auto shadow-md mt-4">
          <table className="w-full text-sm text-gray-500">
            <thead className="uppercase text-white bg-blue-500">
              <tr>
                <th className="px-6 py-3">Tên Dịch vụ</th>
                <th className="px-6 py-3">Mô tả</th>
                <th className="px-6 py-3">Giá (VND)</th>
                <th className="px-6 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {services.length > 0 ? (
                services.map((item) => (
                  <tr key={item.id} className="odd:bg-white even:bg-gray-50 border-b">
                    <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4">{item.description}</td>
                    <td className="px-6 py-4">{item.price?.toLocaleString()} VND</td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                        onClick={() => handleOpenModal(true, item)}
                        className="text-blue-600 hover:underline"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(item.id);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:underline"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal thêm/sửa */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg shadow-lg w-96 p-6">
              <h2 className="text-lg font-semibold mb-4">
                {isEdit ? "Sửa Dịch vụ" : "Thêm Dịch vụ"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tên Dịch vụ</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Mô tả</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Giá (VND)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    {isEdit ? "Cập nhật" : "Thêm"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal xác nhận xóa */}
        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg shadow-lg w-80 p-6">
              <h2 className="text-lg font-semibold mb-3 text-red-600">Xác nhận xóa</h2>
              <p className="mb-4 text-gray-700">
                Bạn có chắc muốn xóa dịch vụ này không?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
