import { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import { Table, Tag, Button, Modal, Spin, message, Space, Input } from "antd";
import { FiEdit2, FiTrash2, FiEye } from "react-icons/fi";
import { SearchOutlined, CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";
import { useGetOrdersPaginationQuery, useGetListOrdersByBranchIdQuery } from "@/api/orderApi";
import PaginationDefault from "@/components/PaginationDefault";

const { Search } = Input;

export default function Order() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  
  // Lấy thông tin người dùng từ localStorage
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const userRole = user?.role || "";
  const userId = user?.id || "";
  const isAdmin = userRole === "admin";
  const isBranchAdmin = userRole === "branch_admin";
  
  // Gọi API với các tham số phân quyền
  const { 
    data: adminOrderData, 
    isLoading: adminIsLoading, 
    error: adminError, 
    refetch: adminRefetch 
  } = useGetOrdersPaginationQuery({
    page: currentPage,
    limit: pageSize,
    search: searchValue,
    sort_order: sortOrder
  }, { skip: !isAdmin });
  
  const { 
    data: branchOrderData, 
    isLoading: branchIsLoading, 
    error: branchError, 
    refetch: branchRefetch 
  } = useGetListOrdersByBranchIdQuery({
    id: userId,
    page: currentPage,
    limit: pageSize,
    search: searchValue,
    sort_order: sortOrder
  }, { skip: !isBranchAdmin });
  
  // Tổng hợp dữ liệu dựa trên quyền hạn
  const orderData = isAdmin ? adminOrderData : branchOrderData;
  const isLoading = isAdmin ? adminIsLoading : branchIsLoading;
  const error = isAdmin ? adminError : branchError;
  const refetch = isAdmin ? adminRefetch : branchRefetch;
  
  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setDetailModalOpen(true);
  };

  const handlePageChange = (page, newPageSize) => {
    if (newPageSize !== pageSize) {
      setPageSize(newPageSize);
    }
    setCurrentPage(page);
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
  
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  }

  const getStatusTag = (status) => {
    const statusMap = {
      'pending': { color: 'gold', text: 'Đang xử lý' },
      'paid': { color: 'green', text: 'Đã thanh toán' },
      'failed': { color: 'red', text: 'Thất bại' },
      'processing': { color: 'blue', text: 'Đang thanh toán' }
    };
    
    const defaultStatus = { color: 'default', text: 'Không xác định' };
    return statusMap[status] || defaultStatus;
  };

  const columns = [
    {
      title: "STT",
      key: "index",
      width: 70,
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "id",
      key: "id",
      render: (id) => <Tag color="blue">{id}</Tag>,
    },
    {
      title: (
        <div 
          className="flex items-center cursor-pointer select-none" 
          onClick={toggleSortOrder}
        >
          Ngày đặt
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
      dataIndex: "order_date",
      key: "order_date",
      render: (date) => formatDate(date),
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      render: (total) => `${Number(total).toLocaleString()}đ`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const { color, text } = getStatusTag(status);
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 150,
      align: "right",
      render: (_, record) => (
        <Space>
          <Button 
            icon={<FiEye />} 
            onClick={() => handleViewDetail(record)} 
          />
        </Space>
      ),
    },
  ];

  const handleTryAgain = () => {
    message.info("Đang thử lại...");
    refetch();
  };

  if (isLoading)
    return <Spin className="flex justify-center mt-10" size="large" />;
  
  if (error) return (
    <div className="text-center my-10">
      <div className="text-red-500 mb-4">
        Lỗi khi tải dữ liệu: {error.status ? `(${error.status}) ` : ''} 
        {error.message || JSON.stringify(error)}
      </div>
      <Button type="primary" onClick={handleTryAgain}>
        Thử lại
      </Button>
    </div>
  );

  const orders = orderData?.data || [];
  const pagination = orderData?.pagination || {
    total: 0,
    totalPages: 0,
    currentPage: 1
  };
    
  return (
    <div className="p-6 h-full">
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
            <p className="mt-1 text-sm text-gray-600">
              {isAdmin 
                ? "Xem và quản lý tất cả đơn hàng từ khách hàng" 
                : "Xem và quản lý đơn hàng của chi nhánh bạn"
              }
            </p>
          </div>
        </div>

        {/* Thanh tìm kiếm và bộ lọc */}
        <div className="mb-4 flex flex-wrap gap-3">
          <Search
            placeholder="Tìm kiếm đơn hàng..."
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
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <Table
            columns={columns}
            dataSource={orders}
            rowKey="id"
            pagination={false}
            locale={{
              emptyText: (
                <div className="py-5">
                  <p className="text-gray-500 text-base">Chưa có đơn hàng nào</p>
                </div>
              )
            }}
          />
        </div>
        
        {/* Phân trang */}
        {orders.length > 0 && (
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

        {/* Modal xem chi tiết */}
        <Modal
          open={isDetailModalOpen}
          onCancel={() => setDetailModalOpen(false)}
          footer={null}
          title="Chi tiết đơn hàng"
          width={700}
        >
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Thông tin đơn hàng</h3>
                  <p><span className="font-medium">Mã đơn:</span> {selectedOrder.id}</p>
                  <p><span className="font-medium">Ngày đặt:</span> {formatDate(selectedOrder.order_date)}</p>
                  <p>
                    <span className="font-medium">Trạng thái:</span>{" "}
                    {(() => {
                      const { color, text } = getStatusTag(selectedOrder.status);
                      return <Tag color={color}>{text}</Tag>;
                    })()}
                  </p>
                  <p><span className="font-medium">Tổng tiền:</span> {Number(selectedOrder.total).toLocaleString()}đ</p>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Chi tiết vé</h3>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p><span className="font-medium">Phim:</span> {selectedOrder.Showtime?.Movie?.name || "N/A"}</p>
                  <p><span className="font-medium">Suất chiếu:</span> {formatDate(selectedOrder.Showtime?.show_date)} - {selectedOrder.Showtime?.start_time || "N/A"}</p>
                  <p><span className="font-medium">Phòng:</span> {selectedOrder.Showtime?.Room?.name || "N/A"}</p>
                  <p>
                    <span className="font-medium">Ghế:</span> {
                      selectedOrder.Tickets && selectedOrder.Tickets.map(ticket => 
                        ticket.Seat ? `${ticket.Seat.seat_row}${ticket.Seat.seat_number}` : ""
                      ).filter(Boolean).join(', ')
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
