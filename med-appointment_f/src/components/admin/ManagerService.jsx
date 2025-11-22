import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import API from "../../api/axios"; // dùng axios instance có token & baseURL
import { FaTrashAlt, FaPencilAlt } from "react-icons/fa";

export default function ManagerService() {
  const [services, setServices] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 10,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState(null);

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

  // tách state riêng
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const API_URL = "/services";

  // 🔍 Tìm kiếm realtime
  useEffect(() => {
    if (debounceTimeout) clearTimeout(debounceTimeout);
    const newTimeout = setTimeout(() => fetchServices(1, searchTerm), 500);
    setDebounceTimeout(newTimeout);
    return () => clearTimeout(newTimeout);
  }, [searchTerm]);

  // 🟢 Lấy danh sách có phân trang
  const fetchServices = async (page = 1, search = "") => {
    try {
      const res = await API.get(
        `/services?page=${page}&per_page=10&search=${encodeURIComponent(search)}`
      );
      setServices(res.data.data);
      setPagination(res.data.pagination);
    } catch (error) {
      toast.error("Không thể tải danh sách dịch vụ. Vui lòng thử lại!");
    }
  };

  useEffect(() => {
    fetchServices(1);
  }, []);

  // 🟢 Mở modal thêm/sửa
  const handleOpenModal = (edit = false, item = null) => {
    setIsEdit(edit);
    if (edit && item) setFormData(item);
    else setFormData({ id: null, name: "", description: "", price: "" });
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  // 🟡 Gửi dữ liệu thêm/sửa
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isAdding || isUpdating) return;

    const action = isEdit ? "update" : "add";
    isEdit ? setIsUpdating(true) : setIsAdding(true);

    try {
      let res;
      if (isEdit) res = await API.put(`${API_URL}/${formData.id}`, formData);
      else res = await API.post(API_URL, formData);

      toast.success(res.data.message || "Lưu thành công!");
      setMessage({ type: "success", text: res.data.message });
      setShowModal(false);
      fetchServices(pagination.current_page);
    } catch (err) {
      toast.error(err.response?.data?.message || "Đã xảy ra lỗi khi lưu.");
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Đã xảy ra lỗi khi lưu.",
      });
    } finally {
      setIsAdding(false);
      setIsUpdating(false);
    }
  };

  // 🔴 Xóa dịch vụ
  const handleDelete = async (e) => {
    e.preventDefault();
    if (isDeleting) return;
    setIsDeleting(true);

    try {
      const res = await API.delete(`${API_URL}/${deleteId}`);
      toast.success(res.data.message || "Xóa thành công!");
      setMessage({ type: "success", text: res.data.message });
      setShowDeleteModal(false);
      fetchServices(pagination.current_page);
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể xóa dịch vụ.");
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Không thể xóa dịch vụ.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-blue-700 mb-2">
        Quản lí Dịch vụ
      </h1>

      {message && (
        <div
          className={`p-3 mb-3 rounded-lg text-white ${message.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
        >
          {message.text}
        </div>
      )}

      {/* Thanh công cụ: tìm kiếm + thêm */}
      <div className="flex justify-between items-center py-2">
        <div className="relative max-w-md w-full">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm dịch vụ..."
            className="block w-full p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-200 focus:ring-2 focus:ring-blue-400 outline-none"
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
          disabled={isAdding || isUpdating}
          className={`py-2 px-4 rounded-lg transition-colors ${isAdding || isUpdating
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
        >
          {isAdding ? "Đang thêm..." : "Thêm Dịch vụ"}
        </button>
      </div>

      {/* Bảng danh sách */}
      <table className="w-full text-sm text-center text-gray-500">
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
                <td className="px-6 py-4 font-medium text-gray-900">
                  {item.name}
                </td>
                <td className="px-6 py-4">{item.description}</td>
                <td className="px-6 py-4">
                  {Number(item.price).toLocaleString()} VND
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    onClick={() => handleOpenModal(true, item)}
                    disabled={isUpdating || isAdding}
                    className={`${isUpdating
                      ? "text-green-300 cursor-not-allowed"
                      : "text-green-600 hover:underline"
                      }`}
                  >
                    {isUpdating && formData.id === item.id
                      ? "Đang sửa..."
                      : <FaPencilAlt />
                    }
                  </button>
                  <button
                    onClick={() => {
                      setDeleteId(item.id);
                      setShowDeleteModal(true);
                    }}
                    disabled={isDeleting}
                    className={`${isDeleting
                      ? "text-red-300 cursor-not-allowed"
                      : "text-red-600 hover:underline"
                      }`}
                  >
                    {isDeleting && deleteId === item.id
                      ? "Đang xóa..."
                      : <FaTrashAlt />
                    }
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

      {/* Phân trang */}
      {pagination.total > pagination.per_page && (
        <div className="flex justify-center items-center mt-4 space-x-3">
          <button
            disabled={pagination.current_page === 1}
            onClick={() =>
              fetchServices(pagination.current_page - 1, searchTerm)
            }
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            ← Trước
          </button>
          <span>
            Trang {pagination.current_page} / {pagination.last_page}
          </span>
          <button
            disabled={pagination.current_page === pagination.last_page}
            onClick={() =>
              fetchServices(pagination.current_page + 1, searchTerm)
            }
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Sau →
          </button>
        </div>
      )}

      {/* Modal thêm/sửa */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <h2 className="text-lg font-semibold mb-4">
              {isEdit ? "Sửa Dịch vụ" : "Thêm Dịch vụ"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tên Dịch vụ
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
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
                <label className="block text-sm font-medium mb-1">
                  Giá (VND)
                </label>
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
                  disabled={isAdding || isUpdating}
                  className={`px-4 py-2 rounded-lg text-white ${isAdding || isUpdating
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                    }`}
                >
                  {isEdit
                    ? isUpdating
                      ? "Đang cập nhật..."
                      : "Cập nhật"
                    : isAdding
                      ? "Đang thêm..."
                      : "Thêm"}
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
            <h2 className="text-lg font-semibold mb-3 text-red-600">
              Xác nhận xóa
            </h2>
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
                disabled={isDeleting}
                className={`px-4 py-2 rounded-lg text-white ${isDeleting
                  ? "bg-red-300 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600"
                  }`}
              >
                {isDeleting ? "Đang xóa..." : "Xóa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
