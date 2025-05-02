import { useState } from "react";
import { Tag, Button, Modal, Spin, message, Input, Space } from "antd";
import { FiEdit2, FiTrash2, FiPlus, FiEye } from "react-icons/fi";
import { SearchOutlined, CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";
import {
  useDeleteBranchMutation,
  useGetBranchesQuery,
} from "../../api/branchApi";
import ResponsiveTable from "@/components/admin/ResponsiveTable";
import PaginationDefault from "@/components/PaginationDefault";
import AddBranch from "@/components/admin/AdminBranches/AddBranch";
import EditBranch from "@/components/admin/AdminBranches/editBranch";

const { Search } = Input;

export default function Branch() {
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  // Gọi API với các tham số phân trang và lọc
  const { data: branchData, error, isLoading, refetch } = useGetBranchesQuery({
    page: currentPage,
    limit: pageSize,
    search: searchValue,
    sort_order: sortOrder
  });
  
  const [deleteBranch] = useDeleteBranchMutation();

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
    setEditModalOpen(true);
  };

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteBranch(selectedBranch.id).unwrap();
      message.success("Xóa chi nhánh thành công!");
      refetch();
    } catch (error) {
      message.error("Xóa chi nhánh thất bại. Vui lòng thử lại!");
    }
    setDeleteModalOpen(false);
  };

  const handleSearch = (value) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleReset = () => {
    setSearchText("");
    setSearchValue("");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  const handlePageChange = (page, newPageSize) => {
    if (newPageSize !== pageSize) {
      setPageSize(newPageSize);
      setCurrentPage(1);
    } else {
      setCurrentPage(page);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    setCurrentPage(1);
  };

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
    refetch();
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    refetch();
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
    },
    {
      title: (
        <div 
          className="flex items-center cursor-pointer select-none" 
          onClick={toggleSortOrder}
        >
          Tên chi nhánh
          <div className="flex flex-col ml-1">
            <CaretUpOutlined 
              className={`text-[10px] ${sortOrder === "asc" ? "text-blue-500" : "text-gray-400"}`}
              style={{ marginBottom: -2 }}
            />
            <CaretDownOutlined 
              className={`text-[10px] ${sortOrder === "desc" ? "text-blue-500" : "text-gray-400"}`}
            />
          </div>
        </div>
      ),
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

      {/* Thanh tìm kiếm và bộ lọc */}
      <div className="mb-4 flex flex-wrap gap-3">
        <Search
          placeholder="Tìm kiếm chi nhánh..."
          allowClear
          onSearch={handleSearch}
          value={searchText}
          onChange={handleSearchChange}
          style={{ width: 250 }}
          prefix={<SearchOutlined className="text-gray-400" />}
        />
        
        {(searchValue || sortOrder !== "desc") && (
          <Button onClick={handleReset}>Xóa bộ lọc</Button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm mb-4 sm:mb-6">
        <ResponsiveTable
          columns={columns}
          dataSource={branchData?.branches || []}
          rowKey="id"
          pagination={false}
          scroll={{ x: 650 }}
          size="middle"
        />
      </div>

      <div className="mt-4">
      <PaginationDefault
          current={branchData?.pagination?.currentPage || 1}
          total={branchData?.pagination?.total || 0}
          pageSize={pageSize}
          onChange={handlePageChange}
          showSizeChanger={true}
          pageSizeOptions={[5, 10, 20]}
      />
      </div>

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
        title={null}
        open={isAddModalOpen}
        onCancel={handleAddModalClose}
        footer={null}
        styles={{
          body: { padding: 0 }
        }}
        destroyOnClose
      >
        <AddBranch handleAddModalClose={handleAddModalClose} />
      </Modal>

      {/* Sửa chi nhánh */}
      <Modal
        title={null}
        open={isEditModalOpen}
        onCancel={handleEditModalClose}
        footer={null}
        styles={{
          body: { padding: 0 }
        }}
        destroyOnClose
      >
        <EditBranch branch={selectedBranch} handleAddModalClose={handleEditModalClose} />
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
