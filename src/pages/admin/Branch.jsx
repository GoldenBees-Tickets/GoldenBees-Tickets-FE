import { useState } from "react";
import { Table, Tag, Button, Modal, Spin, message } from "antd";
import { FiEdit2, FiTrash2, FiPlus, FiEye } from "react-icons/fi";
import {
  useDeleteBranchMutation,
  useGetBranchesQuery,
  useCreateBranchMutation,
  useUpdateBranchMutation,
} from "../../api/branchApi";
import Select from "react-select";
import citiesData from "../../public/vietnamAddress.json";

export default function Branch() {
  const { data: branchData, error, isLoading } = useGetBranchesQuery();
  const [deleteBranch] = useDeleteBranchMutation();
  const [createBranch] = useCreateBranchMutation();
  const [updateBranch] = useUpdateBranchMutation();

  const [selectedBranch, setSelectedBranch] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [formData, setFormData] = useState({
    name: "",
    city: null
  });

  const handleViewDetail = (branch) => {
    setSelectedBranch(branch);
    setDetailModalOpen(true);
  };

  const handleDelete = (branch) => {
    setSelectedBranch(branch);
    setDeleteModalOpen(true);
  };

  const handleEdit = (branch) => {
    setSelectedBranch(branch);
    setFormData({
      name: branch.name,
      city: { value: branch.city, label: branch.city }
    });
    setEditModalOpen(true);
  };

  const handleAdd = () => {
    setFormData({
      name: "",
      city: null
    });
    setIsAddModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteBranch(selectedBranch.id).unwrap();
      message.success("Xóa chi nhánh thành công!");
    } catch {
      message.error("Xóa chi nhánh thất bại. Vui lòng thử lại!");
    }
    setDeleteModalOpen(false);
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.city) {
      message.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    try {
      await createBranch({
        name: formData.name,
        city: formData.city.label
      }).unwrap();
      message.success("Thêm chi nhánh thành công!");
      setIsAddModalOpen(false);
    } catch (error) {
      message.error("Thêm chi nhánh thất bại. Vui lòng thử lại!");
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.city) {
      message.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    try {
      await updateBranch({
        id: selectedBranch.id,
        name: formData.name,
        city: formData.city.label
      }).unwrap();
      message.success("Cập nhật chi nhánh thành công!");
      setEditModalOpen(false);
    } catch (error) {
      message.error("Cập nhật chi nhánh thất bại. Vui lòng thử lại!");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Tên chi nhánh",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Thành phố",
      dataIndex: "city",
      key: "city",
      render: (city) => <Tag color="blue">{city}</Tag>,
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button icon={<FiEye />} onClick={() => handleViewDetail(record)} />
          <Button icon={<FiEdit2 />} onClick={() => handleEdit(record)} />
          <Button
            danger
            icon={<FiTrash2 />}
            onClick={() => handleDelete(record)}
          />
        </div>
      ),
    },
  ];

  if (isLoading)
    return <Spin className="flex justify-center mt-10" size="large" />;
  if (error) return <div className="text-red-500">Lỗi khi tải dữ liệu!</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Danh sách Chi Nhánh</h2>
        <Button
          type="primary"
          icon={<FiPlus />}
          onClick={handleAdd}
          className="flex items-center"
        >
          Thêm Chi Nhánh
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={branchData?.branches}
        rowKey="id"
        pagination={false}
      />

      {/* Modal xem chi tiết */}
      <Modal
        open={isDetailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        footer={null}
        title="Chi tiết chi nhánh"
      >
        {selectedBranch && (
          <div className="space-y-2">
            <p>
              <strong>ID:</strong> {selectedBranch.id}
            </p>
            <p>
              <strong>Tên chi nhánh:</strong> {selectedBranch.name}
            </p>
            <p>
              <strong>Thành phố:</strong> {selectedBranch.city}
            </p>
            <p>
              <strong>Địa chỉ:</strong> 123 Đường ABC, {selectedBranch.city}
            </p>
            <p>
              <strong>Số phòng chiếu:</strong> 8
            </p>
          </div>
        )}
      </Modal>

      {/* Modal xác nhận xóa */}
      <Modal
        open={isDeleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        onOk={confirmDelete}
        okText="Xóa"
        okButtonProps={{ danger: true }}
        title="Xác nhận xóa"
      >
        Bạn có chắc chắn muốn xóa chi nhánh "{selectedBranch?.name}" không?
      </Modal>

      {/* Modal thêm mới */}
      <Modal
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        footer={null}
        title="Thêm chi nhánh mới"
      >
        <form onSubmit={handleSubmitAdd} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên chi nhánh
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập tên chi nhánh"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thành phố
            </label>
            <Select
              className="w-full"
              options={citiesData.map(city => ({ value: city.Name, label: city.Name }))}
              value={formData.city}
              onChange={(option) => setFormData({...formData, city: option})}
              placeholder="Chọn thành phố"
              isClearable
            />
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <Button onClick={() => setIsAddModalOpen(false)}>Hủy</Button>
            <Button type="primary" htmlType="submit">
              Thêm
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal chỉnh sửa */}
      <Modal
        open={isEditModalOpen}
        onCancel={() => setEditModalOpen(false)}
        footer={null}
        title="Chỉnh sửa chi nhánh"
      >
        <form onSubmit={handleSubmitEdit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên chi nhánh
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập tên chi nhánh"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thành phố
            </label>
            <Select
              className="w-full"
              options={citiesData.map(city => ({ value: city.Name, label: city.Name }))}
              value={formData.city}
              onChange={(option) => setFormData({...formData, city: option})}
              placeholder="Chọn thành phố"
              isClearable
            />
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <Button onClick={() => setEditModalOpen(false)}>Hủy</Button>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
