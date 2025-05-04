import { useState } from "react";
import { Table, Button, Modal, Spin, message, Input, Space } from "antd";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { SearchOutlined, CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";
import { useGetListSeatTypesQuery, useDeleteSeatTypeMutation } from "@/api/seatTypeApi";
import UpdateSeatType from "./UpdateSeatType";
import PaginationDefault from "@/components/PaginationDefault";
import AddSeatType from "./AddSeatType";
import { formatDate } from "@/utils/format";

const { Search } = Input;

export default function ListSeatType() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isShowFormUpdate, setIsShowFormUpdate] = useState(false);
  const [isShowFormCreate, setIsShowFormCreate] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSeatType, setSelectedSeatType] = useState(null);

  // Gọi API với các tham số phân trang, tìm kiếm và sắp xếp
  const { data: seatTypeData, isLoading } = useGetListSeatTypesQuery({
    page: currentPage,
    limit: pageSize,
    search: searchValue,
    sort_order: sortOrder
  });
  
  const [deleteSeatType] = useDeleteSeatTypeMutation();

  const handleEdit = (seatType) => {
    setSelectedSeatType(seatType);
    setIsShowFormUpdate(true);
  };

  const handleDelete = (seatType) => {
    setSelectedSeatType(seatType);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteSeatType(selectedSeatType.id).unwrap();
      message.success("Xóa loại ghế thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa loại ghế:", error);
      message.error("Xóa loại ghế thất bại!");
    }
    setIsDeleteModalOpen(false);
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

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: (
        <div 
          className="flex items-center cursor-pointer select-none" 
          onClick={toggleSortOrder}
        >
          Loại ghế
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
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Màu sắc",
      dataIndex: "color",
      key: "color",
      render: (color) => (
        <div className="flex items-center space-x-2">
          <div
            className="w-8 h-8 rounded-lg border shadow-sm"
            style={{ backgroundColor: color }}
          />
          <span className="text-sm text-gray-600">{color}</span>
        </div>
      ),
    },
    {
      title: "Giá thêm",
      dataIndex: "price_offset",
      key: "price_offset",
      render: (price) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(price)}
        </span>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <span>
          {formatDate(date)}
        </span>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <div className="flex space-x-2">
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

  const seatTypes = seatTypeData?.seat_types || [];
  const pagination = seatTypeData?.pagination || { total: 0, currentPage: 1, totalPages: 1 };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <div>
        <h2 className="text-xl font-bold text-gray-800">Danh Sách Loại Ghế</h2>
          <p className="text-gray-500 mt-1">Quản lý các loại ghế trong hệ thống</p>
        </div>
        <Button
          type="primary"
          icon={<FiPlus />}
          onClick={() => setIsShowFormCreate(true)}
          className="flex items-center bg-blue-500"
        >
          Thêm Loại Ghế
        </Button>
      </div>

      {/* Thanh tìm kiếm và bộ lọc */}
      <div className="mb-4 flex flex-wrap gap-3">
        <Search
          placeholder="Tìm kiếm loại ghế..."
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

      <Table
        columns={columns}
        dataSource={seatTypes}
        rowKey="id"
        pagination={false}
      />

      <PaginationDefault
        current={pagination.currentPage}
        total={pagination.total}
        pageSize={pageSize}
        onChange={handlePageChange}
        showSizeChanger={true}
        pageSizeOptions={[5, 10, 20]}
      />

      {isShowFormUpdate && (
        <Modal
          open={isShowFormUpdate}
          footer={null}
          onCancel={() => setIsShowFormUpdate(false)}
          width={500}
        >
        <UpdateSeatType
          seat_type={selectedSeatType}
          setIsShowFormUpdate={setIsShowFormUpdate}
        />
        </Modal>
      )}

      {isShowFormCreate && (
        <Modal
          open={isShowFormCreate}
          footer={null}
          onCancel={() => setIsShowFormCreate(false)}
          width={500}
        >
        <AddSeatType
          isShowFormCreate={setIsShowFormCreate}
        />
        </Modal>
      )}

      {/* Modal xác nhận xóa */}
      <Modal
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onOk={confirmDelete}
        okText="Xóa"
        okButtonProps={{ danger: true }}
        title="Xác nhận xóa"
      >
        <p>Bạn có chắc chắn muốn xóa loại ghế "{selectedSeatType?.type}" không?</p>
        <p className="text-red-500 text-sm mt-2">Lưu ý: Hành động này không thể hoàn tác.</p>
      </Modal>
    </div>
  );
}
