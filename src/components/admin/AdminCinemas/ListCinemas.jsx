import { useState } from "react";
import { Table, Tag, Button, Modal, Spin, message, Input, Space, Select } from "antd";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { SearchOutlined, CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";
import { useGetCinemasQuery, useDeleteCinemaMutation } from "../../../api/cinemaApi";
import EditCinema from "./EditCinemas";
import PaginationDefault from "@/components/PaginationDefault";

const { Search } = Input;

export default function ListCinemas() {
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  // Gọi API với các tham số phân trang và lọc
  const { data: cinemaData, error, isLoading } = useGetCinemasQuery({
    page: currentPage,
    limit: pageSize,
    search: searchValue,
    sort_order: sortOrder
  });
  
  const [deleteCinema] = useDeleteCinemaMutation();

  const handleEdit = (cinema) => {
    setSelectedCinema(cinema);
    setIsEditModalOpen(true);
  };

  const handleDelete = (cinema) => {
    setSelectedCinema(cinema);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteCinema(selectedCinema.id).unwrap();
      message.success("Xóa cinema thành công!");
    } catch (error) {
      message.error("Xóa cinema thất bại. Vui lòng thử lại!");
    }
    setIsDeleteModalOpen(false);
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

  const handlePageChange = (page, newPageSize) => {
    if (newPageSize !== pageSize) {
        setPageSize(newPageSize);
    }
    setCurrentPage(page);
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
      width: 70,
    },
    {
      title: (
        <div 
          className="flex items-center cursor-pointer select-none" 
          onClick={toggleSortOrder}
        >
          Tên Cinema
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
      title: "Thành phố",
      dataIndex: "city",
      key: "city",
      render: (city) => <Tag color="blue">{city}</Tag>,
    },
    {
      title: "Quận",
      dataIndex: "district",
      key: "district",
    },
    {
      title: "Phường",
      dataIndex: "ward",
      key: "ward",
    },
    {
      title: "Đường",
      dataIndex: "street",
      key: "street",
      ellipsis: true,
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
  if (error) return <div className="text-red-500">Lỗi khi tải dữ liệu!</div>;

  return (
    <>
      <div className="mb-4">
        <Space size="middle">
          <Search
            placeholder="Tìm kiếm rạp phim..."
            allowClear
            onSearch={handleSearch}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
            prefix={<SearchOutlined className="text-gray-400" />}
          />
          {(searchValue || sortOrder !== "desc") && (
            <Button onClick={handleReset}>Xóa bộ lọc</Button>
          )}
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={cinemaData?.cinemas || []}
        rowKey="id"
        pagination={false}
        locale={{
          emptyText: "Chưa có rạp phim nào",
        }}
      />

      <div className="mt-4">
        <PaginationDefault
          current={cinemaData?.pagination?.currentPage || 1}
          total={cinemaData?.pagination?.total || 0}
          pageSize={pageSize}
          onChange={handlePageChange}
          showSizeChanger={false}
          pageSizeOptions={[5, 10, 15]}
        />
      </div>

      {/* Modal chỉnh sửa */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-[9999]">
          <EditCinema
            {...selectedCinema}
            setToggleUpdateCinema={setIsEditModalOpen}
          />
        </div>
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
        Bạn có chắc chắn muốn xóa cinema "{selectedCinema?.name}" không?
      </Modal>
    </>
  );
}
