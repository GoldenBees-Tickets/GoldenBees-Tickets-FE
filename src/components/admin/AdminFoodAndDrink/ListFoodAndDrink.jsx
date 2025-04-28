import { useState } from "react";
import { useGetFoodAndDrinksQuery, useDeleteFoodAndDrinkMutation } from "../../../api/foodAndDrinkApi";
import { toast } from "react-toastify";
import AddFoodAndDrink from "./AddFoodAndDrink";
import EditFoodAndDrink from "./EditFoodAndDrink";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { SearchOutlined, CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";
import { Input, Button, Space, Spin, Select, Table, Modal } from "antd";
import PaginationDefault from "../../PaginationDefault";
import { formatImage } from "@/utils/formatImage";

const { Search } = Input;
const { Option } = Select;

const ListFoodAndDrink = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [typeFilter, setTypeFilter] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  
  // Gọi API với các tham số
  const { data: foodAndDrinkData, isLoading, error } = useGetFoodAndDrinksQuery({
    page: currentPage,
    limit: pageSize,
    search: searchValue,
    sort_order: sortOrder,
    type: typeFilter
  });
  
  const [deleteFoodAndDrink] = useDeleteFoodAndDrinkMutation();

  const handlePageChange = (page, newPageSize) => {
    if (newPageSize !== pageSize) {
      setPageSize(newPageSize);
    }
    setCurrentPage(page);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setShowEditForm(true);
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteFoodAndDrink(itemToDelete.id).unwrap();
      toast.success("Xóa món thành công!");
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (err) {
      console.error("Lỗi khi xóa món:", err);
      toast.error("Xóa món thất bại. Vui lòng thử lại.");
    }
  };
  
  const handleSearch = (value) => {
    setSearchValue(value);
    setCurrentPage(1);
  };
  
  const handleTypeChange = (value) => {
    setTypeFilter(value);
    setCurrentPage(1);
  };
  
  const handleReset = () => {
    setSearchText("");
    setSearchValue("");
    setSortOrder("desc");
    setTypeFilter("");
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
          Tên Món
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
      title: "Loại",
      key: "type",
      render: (_, record) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          record.type === "food" 
            ? "bg-green-100 text-green-800" 
            : "bg-blue-100 text-blue-800"
        }`}>
          {record.type === "food" ? "Đồ ăn" : "Đồ uống"}
        </span>
      )
    },
    {
      title: "Giá",
      key: "price",
      render: (_, record) => (
        <div className="text-sm font-medium text-gray-900">
          {record.price.toLocaleString()}đ
        </div>
      )
    },
    {
      title: "Thao Tác",
      key: "actions",
      width: 100,
      align: "right",
      render: (_, record) => (
        <Space>
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
  
  const foodAndDrinks = foodAndDrinkData?.items || [];
  const pagination = foodAndDrinkData?.pagination || {
    total: 0,
    totalPages: 0,
    currentPage: 1
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quản Lý Đồ Ăn & Đồ Uống</h2>
          <p className="text-sm text-gray-600 mt-1">Quản lý danh sách món ăn và đồ uống của rạp</p>
        </div>
        <Button
          type="primary"
          icon={<FiPlus />}
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Thêm Món Mới
        </Button>
      </div>

      {/* Thanh tìm kiếm và bộ lọc */}
      <div className="mb-4 flex flex-wrap gap-3">
        <Search
          placeholder="Tìm kiếm món..."
          allowClear
          onSearch={handleSearch}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 250 }}
          prefix={<SearchOutlined className="text-gray-400" />}
        />
        
        <Select
          placeholder="Loại món"
          allowClear
          style={{ width: 120 }}
          onChange={handleTypeChange}
          value={typeFilter}
        >
          <Option value="">Tất cả</Option>
          <Option value="food">Đồ ăn</Option>
          <Option value="drink">Đồ uống</Option>
        </Select>
        
        {(searchValue || sortOrder !== "desc" || typeFilter) && (
          <Button onClick={handleReset}>Xóa bộ lọc</Button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <Table
          columns={columns}
          dataSource={foodAndDrinks}
          rowKey="id"
          pagination={false}
          locale={{
            emptyText: (
              <div className="py-5">
                    <p className="text-gray-500 text-base">Chưa có món ăn hoặc đồ uống nào</p>
                <Button
                  type="link"
                      onClick={() => setShowAddForm(true)}
                  className="mt-2 text-blue-600 hover:text-blue-700"
                    >
                      Thêm món mới ngay
                </Button>
                      </div>
            )
          }}
        />
      </div>

      {/* Phân trang */}
      {foodAndDrinks.length > 0 && (
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
        Bạn có chắc chắn muốn xóa món "{itemToDelete?.name}" không?
      </Modal>

      {/* Modal Thêm Món mới */}
      <Modal
        title="Thêm Món Mới"
        open={showAddForm}
        onCancel={() => setShowAddForm(false)}
        footer={null}
        width={600}
        destroyOnClose
      >
        {showAddForm && <AddFoodAndDrink setAddForm={setShowAddForm} />}
      </Modal>

      {/* Modal Chỉnh sửa */}
      <Modal
        title="Chỉnh Sửa Món"
        open={showEditForm}
        onCancel={() => setShowEditForm(false)}
        footer={null}
        width={600}
        destroyOnClose
      >
        {showEditForm && <EditFoodAndDrink setEditForm={setShowEditForm} editItem={selectedItem} />}
      </Modal>
    </div>
  );
};

export default ListFoodAndDrink; 