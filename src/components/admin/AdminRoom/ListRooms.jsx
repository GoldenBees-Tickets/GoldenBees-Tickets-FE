import { useGetRoomsQuery, useDeleteRoomMutation } from "@/api/roomApi";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Table, Button, Modal, Spin, message, Tooltip, Input, Space } from "antd";
import { FiEdit2, FiEye } from "react-icons/fi";
import { SearchOutlined, CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";
import PaginationDefault from "../../PaginationDefault";
import ViewRoomSeats from "./ViewRoomSeats";

const { Search } = Input;

export default function ListRooms() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [viewRoomId, setViewRoomId] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  const { data: roomData, isLoading, error } = useGetRoomsQuery({ 
    page: currentPage, 
    limit: pageSize,
    search: searchValue,
    sort_order: sortOrder
  });

  const handlePageChange = (page, newPageSize) => {
    if (newPageSize !== pageSize) {
      setPageSize(newPageSize);
    }
    setCurrentPage(page);
  };

  const handleViewSeats = (roomId) => {
    setViewRoomId(roomId);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewRoomId(null);
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
      width: 80,
      render: (_, __, index) => {
        return (currentPage - 1) * pageSize + index + 1;
      }
    },
    {
      title: (
        <div 
          className="flex items-center cursor-pointer select-none" 
          onClick={toggleSortOrder}
        >
          Tên phòng
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
      title: "Rạp",
      dataIndex: ["Cinema", "name"],
      key: "cinema",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <div className="flex space-x-2">
          <Tooltip title="Xem sơ đồ ghế">
            <Button 
              icon={<FiEye />} 
              onClick={() => handleViewSeats(record.id)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Link to={`${record.id}`}>
              <Button icon={<FiEdit2 />} />
            </Link>
          </Tooltip>
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
            placeholder="Tìm kiếm phòng..."
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
        dataSource={roomData?.rooms || []}
        rowKey="id"
        pagination={false}
        locale={{
          emptyText: "Chưa có phòng nào",
        }}
      />

      <div className="mt-4">
        <PaginationDefault
          current={roomData?.pagination?.currentPage || 1}
          total={roomData?.pagination?.total || 0}
          pageSize={pageSize}
          onChange={handlePageChange}
          showSizeChanger={false}
          pageSizeOptions={[5, 10, 15]}
        />
      </div>

      {/* Seat layout modal */}
      <ViewRoomSeats
        roomId={viewRoomId}
        visible={isViewModalOpen}
        onClose={handleCloseViewModal}
      />
    </>
  );
}
