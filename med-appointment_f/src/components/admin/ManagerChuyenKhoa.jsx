import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import API from "../../api/axios";
import { FaTrashAlt, FaPencilAlt } from "react-icons/fa";

export default function ManagerChuyenKhoa() {
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({ id: null, name: "", description: "" });
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const searchTimer = useRef(null);

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });

  const fetchDepartments = async (page = 1, query = "") => {
    try {
      let url = query.trim()
        ? `/departments/search?query=${encodeURIComponent(query)}&page=${page}`
        : `/departments?page=${page}`;

      const res = await API.get(url);
      const { data, pagination: pg } = res.data;

      setDepartments(data);
      setPagination({
        current_page: pg.current_page,
        last_page: pg.last_page,
      });

    } catch (err) {
      
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (searchTimer.current) clearTimeout(searchTimer.current);

    searchTimer.current = setTimeout(() => {
      fetchDepartments(1, value);
    }, 400);
  };

  const handleOpenModal = (edit = false, dep = null) => {
    setIsEdit(edit);

    if (edit && dep) {
      setFormData({
        id: dep.id,
        name: dep.name,
        description: dep.description,
        updated_at: dep.updated_at,
      });
    } else {
      setFormData({ id: null, name: "", description: "" });
    }

    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      let res;

      if (isEdit) {
        res = await API.put(`/departments/${formData.id}`, {
          name: formData.name,
          description: formData.description,
          updated_at: formData.updated_at,
        });
      } else {
        res = await API.post(`/departments`, {
          name: formData.name,
          description: formData.description,
        });
      }

      toast.success(res.data.message || "Lưu thành công!");
      setMessage({ type: "success", text: res.data.message });

      await fetchDepartments(pagination.current_page, searchQuery);
      setShowModal(false);

    } catch (err) {
      // toast.error(err.response?.data?.message || "Đã xảy ra lỗi.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await API.delete(`/departments/${deleteId}`);

      toast.success(res.data.message || "Xóa thành công!");
      setMessage({ type: "success", text: res.data.message });

      await fetchDepartments(pagination.current_page, searchQuery);
      setShowDeleteModal(false);

    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể xóa.");
    }
  };

  const handlePageChange = (page) => {
    fetchDepartments(page, searchQuery);
  };

  return (
    <div className=" p-6">

      <h1 className="text-2xl font-bold text-blue-700 mb-2">Quản lý Chuyên khoa</h1>

      {message && (
        <div
          className={`p-3 mb-3 rounded-lg text-white transition-all ${
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
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Tìm kiếm Chuyên khoa"
            className="block w-full p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-200"
          />
        </div>

        <button
          onClick={() => handleOpenModal(false)}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Thêm Chuyên khoa
        </button>
      </div>

      <table className="w-full text-sm text-center text-gray-500">
        <thead className="uppercase text-white bg-blue-500">
          <tr>
            <th className="py-3">Tên Chuyên khoa</th>
            <th className="px-6 py-3">Mô tả</th>
            <th className="px-6 py-3">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {departments.length > 0 ? (
            departments.map((dep) => (
              <tr key={dep.id} className="odd:bg-white even:bg-gray-50 border-b">
                <td className="px-6 py-4 font-medium text-gray-900">{dep.name}</td>
                <td className="px-6 py-4">{dep.description}</td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    onClick={() => handleOpenModal(true, dep)}
                    className="text-green-600 hover:underline"
                  >
                    <FaPencilAlt />
                  </button>
                  <button
                    onClick={() => {
                      setDeleteId(dep.id);
                      setShowDeleteModal(true);
                    }}
                    className="text-red-600 hover:underline"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center py-4 text-gray-500">
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          disabled={pagination.current_page === 1}
          onClick={() => handlePageChange(pagination.current_page - 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Trước
        </button>

        <span>
          Trang {pagination.current_page} / {pagination.last_page}
        </span>

        <button
          disabled={pagination.current_page === pagination.last_page}
          onClick={() => handlePageChange(pagination.current_page + 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Sau
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <h2 className="text-lg font-semibold mb-4">
              {isEdit ? "Sửa Chuyên khoa" : "Thêm Chuyên khoa"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên Chuyên khoa</label>
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
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows="3"
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

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg w-80 p-6">
            <h2 className="text-lg font-semibold mb-3 text-red-600">Xác nhận xóa</h2>
            <p className="mb-4 text-gray-700">Bạn có chắc muốn xóa chuyên khoa này không?</p>

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
  );
}