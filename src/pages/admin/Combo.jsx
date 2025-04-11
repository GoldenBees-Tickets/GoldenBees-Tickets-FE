import { useState } from "react";
import { useGetCombosQuery, useDeleteComboMutation } from "../../api/comboApi";
import AddCombo from "../../components/admin/AdminCombo/AddCombo";
import EditCombo from "../../components/admin/AdminCombo/EditCombo";
import { FiEdit2, FiTrash2, FiPlus, FiEye } from "react-icons/fi";
import { SearchOutlined, CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";
import { Input, Button, Space, Spin, Table, Modal, Typography } from "antd";
import { toast } from "react-toastify";
import { formatImage } from "@/utils/formatImage";
import PaginationDefault from "../../components/PaginationDefault";

const { Search } = Input;
const { Title, Text } = Typography;

const Combo = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  
  // State cho các modal
  const [addForm, setAddForm] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [isShowDetail, setIsShowDetail] = useState(false);
  const [viewDetails, setViewDetails] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Gọi API với các tham số
  const { data: comboData, isLoading, error } = useGetCombosQuery({
    page: currentPage,
    limit: pageSize,
    search: searchValue,
    sort_order: sortOrder
  });
  
  const [deleteCombo] = useDeleteComboMutation();

  const handlePageChange = (page, newPageSize) => {
    if (newPageSize !== pageSize) {
      setPageSize(newPageSize);
    }
    setCurrentPage(page);
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setEditForm(true);
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteCombo(itemToDelete.id).unwrap();
      toast.success("Xóa combo thành công!");
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Xóa thất bại:", error);
      toast.error("Xóa combo thất bại. Vui lòng thử lại.");
    }
  };

  const handleViewDetails = (item) => {
    setViewDetails(item);
    setIsShowDetail(true);
  };

  const handleSearch = (value) => {
    setSearchValue(value);
    setCurrentPage(1);
  };
  
  const handleReset = () => {
    setSearchText("");
    setSearchValue("");
    setSortOrder("desc");
    setCurrentPage(1);
  };
  
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    setCurrentPage(1);
  };

  const columns = [
    {
      title: "STT",
      key: "index",
      width: 70,
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1
    },
    {
      title: "Hình Ảnh",
      key: "image",
      width: 100,
      render: (_, record) => (
        <div className="flex items-center">
          <img
            src={formatImage(record.profile_picture)}
            alt={record.name}
            className="h-10 w-10 rounded-lg object-cover shadow-sm"
          />
        </div>
      )
    },
    {
      title: (
        <div 
          className="flex items-center cursor-pointer select-none" 
          onClick={toggleSortOrder}
        >
          Tên Combo
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
    },
    {
      title: "Giá",
      key: "price",
      render: (_, record) => (
        <div className="text-sm font-medium text-gray-900">
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record.price)}
        </div>
      )
    },
    {
      title: "Thao Tác",
      key: "actions",
      width: 120,
      align: "right",
      render: (_, record) => (
        <Space>
          <Button 
            icon={<FiEye />} 
            onClick={() => handleViewDetails(record)} 
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
        </Space>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center text-red-500 p-4 bg-red-50 rounded-lg max-w-md">
          <p className="text-lg font-semibold mb-2">Đã có lỗi xảy ra</p>
          <p className="text-sm">Không thể tải dữ liệu. Vui lòng thử lại sau.</p>
        </div>
      </div>
    );
  }
  
  const combos = comboData?.items || [];
  const pagination = comboData?.pagination || {
    total: 0,
    totalPages: 0,
    currentPage: 1
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quản Lý Combo</h2>
          <p className="text-sm text-gray-600 mt-1">Quản lý danh sách combo của rạp</p>
        </div>
        <Button
          type="primary"
          icon={<FiPlus />}
          onClick={() => setAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Thêm Combo Mới
        </Button>
      </div>

      {/* Thanh tìm kiếm và bộ lọc */}
      <div className="mb-4 flex flex-wrap gap-3">
        <Search
          placeholder="Tìm kiếm combo..."
          allowClear
          onSearch={handleSearch}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 250 }}
          prefix={<SearchOutlined className="text-gray-400" />}
        />
        
        {searchValue || sortOrder !== "desc" ? (
          <Button onClick={handleReset}>Xóa bộ lọc</Button>
        ) : null}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <Table
          columns={columns}
          dataSource={combos}
          rowKey="id"
          pagination={false}
          locale={{
            emptyText: (
              <div className="py-5">
                    <p className="text-gray-500 text-base">Chưa có combo nào</p>
                <Button
                  type="link"
                      onClick={() => setAddForm(true)}
                  className="mt-2 text-blue-600 hover:text-blue-700"
                    >
                      Thêm combo mới ngay
                </Button>
                      </div>
            )
          }}
        />
      </div>

      {/* Phân trang */}
      {combos.length > 0 && (
        <div className="mt-4">
          <PaginationDefault
            current={pagination.currentPage}
            total={pagination.total}
            pageSize={pageSize}
            onChange={handlePageChange}
            showSizeChanger={true}
            pageSizeOptions={[5, 10, 20]}
          />
        </div>
      )}

      {/* Modal Xác nhận xóa */}
      <Modal
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onOk={confirmDelete}
        okText="Xóa"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
        title="Xác nhận xóa"
      >
        Bạn có chắc chắn muốn xóa combo "{itemToDelete?.name}" không?
      </Modal>

      {/* Modal Chi tiết Combo */}
      <Modal
        title="Chi Tiết Combo"
        open={isShowDetail}
        onCancel={() => setIsShowDetail(false)}
        footer={null}
        width={600}
        centered
      >
        {viewDetails && (
          <div className="space-y-6">
            <div className="flex gap-4">
              <img
                src={formatImage(viewDetails.profile_picture)}
                alt={viewDetails.name}
                className="w-24 h-24 object-cover rounded-lg shadow-sm"
              />
              <div>
                <Title level={5}>{viewDetails.name}</Title>
                <Text className="text-lg font-semibold text-blue-600">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(viewDetails.price)}
                </Text>
              </div>
            </div>

                <div>
              <Title level={5}>Danh Sách Món</Title>
              <div className="space-y-2 mt-2">
                {viewDetails.ComboItems?.map((item) => (
                      <div key={item.id} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{item.FoodAndDrink.name}</span>
                          <span className="text-sm text-gray-600">x{item.quantity}</span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Tổng: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.quantity * Number(item.FoodAndDrink.price))}
                        </div>
                      </div>
                    ))}
            </div>
          </div>
        </div>
      )}
      </Modal>

      {/* Modal Thêm Combo mới */}
      <Modal
        open={addForm}
        onCancel={() => setAddForm(false)}
        footer={null}
        destroyOnClose
        width={600}
        centered
        bodyStyle={{ padding: 0, maxHeight: '70vh', overflow: 'auto' }}
        title={null}
        closeIcon={false}
        style={{ top: 20 }}
      >
        {addForm && <AddCombo setAddForm={setAddForm} />}
      </Modal>

      {/* Modal Chỉnh sửa */}
      <Modal
        open={editForm}
        onCancel={() => setEditForm(false)}
        footer={null}
        width={600}
        destroyOnClose
        centered
        bodyStyle={{ padding: 0, maxHeight: '70vh', overflow: 'auto' }}
        title={null}
        closeIcon={false}
        style={{ top: 20 }}
      >
        {editForm && <EditCombo setEditForm={setEditForm} combo={editItem} />}
      </Modal>
    </div>
  );
};

export default Combo;
