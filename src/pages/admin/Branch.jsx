import { useState } from "react";
import { Tag, Button, Modal, Spin, message } from "antd";
import { FiEdit2, FiTrash2, FiPlus, FiEye } from "react-icons/fi";
import {
  useDeleteBranchMutation,
  useGetBranchesQuery,
  useCreateBranchMutation,
  useUpdateBranchMutation,
} from "../../api/branchApi";
import Select from "react-select";
import citiesData from "../../public/vietnamAddress.json";
import ResponsiveTable from "@/components/admin/ResponsiveTable";
import PaginationDefault from "@/components/PaginationDefault";

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
    } catch (error) {
      message.error("Xóa chi nhánh thất bại. Vui lòng thử lại!");
    }
    setDeleteModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCityChange = (selectedOption) => {
    setFormData({
      ...formData,
      city: selectedOption
    });
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
        city: formData.city.value
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
        city: formData.city.value
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
      width: 70,
    },
    {
      title: "Tên chi nhánh",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
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
      width: 160,
      fixed: 'right',
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button
            icon={<FiEye />}
            onClick={() => handleViewDetail(record)}
          />
          <Button 
            icon={<FiEdit2 />} 
            onClick={() => handleEdit(record)} 
          />
          <Button
            danger
            icon={<FiTrash2 />}
            onClick={() => handleDelete(record)}
          />
        </div>
      ),
    },
  ];

  if (isLoading) return <Spin className="flex justify-center mt-10" size="large" />;
  if (error) return <div className="text-red-500">Lỗi khi tải dữ liệu!</div>;

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Quản lý chi nhánh</h1>
          <p className="text-gray-500 mt-1">Danh sách các chi nhánh trong hệ thống</p>
        </div>
        <Button 
          type="primary" 
          icon={<FiPlus />} 
          onClick={handleAdd}
          className="bg-blue-500 hover:bg-blue-600 flex items-center"
        >
          Thêm chi nhánh
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm mb-4 sm:mb-6">
        <ResponsiveTable
          columns={columns}
          dataSource={branchData?.branches}
          rowKey="id"
          pagination={false}
          scroll={{ x: 650 }}
          size="middle"
        />
      </div>

      <PaginationDefault
        totalItems={branchData?.branches?.length || 0}
        totalPages={Math.ceil(
          (branchData?.branches?.length || 0) / pageSize
        )}
        currentPage={currentPage}
        onPageChange={(page, newSize) => {
          setCurrentPage(page);
          if (newSize) setPageSize(newSize);
        }}
      />

      {/* Modals */}
      {/* Chi tiết chi nhánh */}
      <Modal
        title="Chi tiết chi nhánh"
        open={isDetailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        footer={[
          <Button key="back" onClick={() => setDetailModalOpen(false)}>
            Đóng
          </Button>,
        ]}
      >
        {selectedBranch && (
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">ID:</p>
              <p className="font-medium">{selectedBranch.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tên chi nhánh:</p>
              <p className="font-medium">{selectedBranch.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Thành phố:</p>
              <p className="font-medium">{selectedBranch.city}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ngày tạo:</p>
              <p className="font-medium">{new Date(selectedBranch.created_at).toLocaleDateString("vi-VN")}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Thêm chi nhánh */}
      <Modal
        title="Thêm chi nhánh mới"
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        footer={null}
      >
        <form onSubmit={handleSubmitAdd} className="space-y-4 mt-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Tên chi nhánh
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Nhập tên chi nhánh"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Thành phố
            </label>
            <Select
              value={formData.city}
              onChange={handleCityChange}
              options={citiesData.map(city => ({ 
                value: city.name, 
                label: city.name 
              }))}
              placeholder="Chọn thành phố"
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <Button onClick={() => setIsAddModalOpen(false)}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" className="bg-blue-500 hover:bg-blue-600">
              Thêm
            </Button>
          </div>
        </form>
      </Modal>

      {/* Sửa chi nhánh */}
      <Modal
        title="Sửa chi nhánh"
        open={isEditModalOpen}
        onCancel={() => setEditModalOpen(false)}
        footer={null}
      >
        <form onSubmit={handleSubmitEdit} className="space-y-4 mt-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Tên chi nhánh
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Nhập tên chi nhánh"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Thành phố
            </label>
            <Select
              value={formData.city}
              onChange={handleCityChange}
              options={citiesData.map(city => ({ 
                value: city.name, 
                label: city.name 
              }))}
              placeholder="Chọn thành phố"
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <Button onClick={() => setEditModalOpen(false)}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" className="bg-blue-500 hover:bg-blue-600">
              Lưu
            </Button>
          </div>
        </form>
      </Modal>

      {/* Xác nhận xóa */}
      <Modal
        title="Xác nhận xóa"
        open={isDeleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        onOk={confirmDelete}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc chắn muốn xóa chi nhánh "{selectedBranch?.name}"?</p>
        <p className="text-red-500 text-sm mt-2">Lưu ý: Hành động này không thể hoàn tác.</p>
      </Modal>
    </div>
  );
}
