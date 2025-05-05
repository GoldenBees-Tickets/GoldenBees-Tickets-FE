import { useState } from "react";
import { useGetShowtimesQuery } from "@/api/showtimeApi";
import { Table, Button, Modal, Spin, Tag, Input, Select, Space } from "antd";
import { FiEdit } from "react-icons/fi";
import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";
import PaginationDefault from "@/components/PaginationDefault";
import { formatImage } from "@/utils/formatImage";
import { formatDate, formatTime, formatCurrency } from "@/utils/format";

const { Search } = Input;

export default function ListShowtimes({ branch_id }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");

  // Gọi API với các tham số phân trang và lọc
  const { data: showtimesData, isLoading, error } = useGetShowtimesQuery({
    branch_id,
    page: currentPage,
    limit: pageSize,
    search: searchValue,
    status: statusFilter,
    sort_order: sortOrder
  });  
  const getShowtimeStatus = (record) => {
    const now = new Date();
    const showDate = new Date(record.show_date);
    
    const startTime = record.start_time.split(':');
    const endTime = record.end_time.split(':');
    
    const startDateTime = new Date(showDate);
    startDateTime.setHours(parseInt(startTime[0]), parseInt(startTime[1]), parseInt(startTime[2] || 0));
    
    const endDateTime = new Date(showDate);
    endDateTime.setHours(parseInt(endTime[0]), parseInt(endTime[1]), parseInt(endTime[2] || 0));
    
    if (now > endDateTime) {
      return { status: "Đã chiếu", color: "default" };
    } else if (now >= startDateTime && now <= endDateTime) {
      return { status: "Đang chiếu", color: "processing" };
    } else {
      return { status: "Sắp chiếu", color: "green" };
    }
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

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleStatusChange = (value) => {    
    setStatusFilter(value);
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
      width: 60,
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Phim",
      dataIndex: ["Movie", "title"],
      key: "movie",
      render: (title, record) => (
        <div className="flex items-center">
          <img 
            src={formatImage(record.Movie?.poster)} 
            alt={title || record.Movie?.name}
            className="w-10 h-14 object-cover rounded mr-2"
          />
          <span className="font-medium">{title || record.Movie?.name}</span>
        </div>
      )
    },
    {
      title: "Rạp",
      dataIndex: ["Cinema", "name"],
      key: "cinema",
      render: (name, record) => (
        <div>
          <div>{name || record.Room?.Cinema?.name}</div>
          <div className="text-xs text-gray-500">{record.Room?.name}</div>
        </div>
      )
    },
    {
      title: (
        <div 
          className="flex items-center cursor-pointer select-none" 
          onClick={toggleSortOrder}
        >
          Ngày chiếu
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
      dataIndex: "show_date",
      key: "show_date",
      render: (date) => <span>{formatDate(date)}</span>
    },
    {
      title: "Giờ chiếu",
      key: "time",
      render: (_, record) => (
        <div>
          <span>{formatTime(record.start_time)} - {formatTime(record.end_time)}</span>
        </div>
      )
    },
    {
      title: "Giá vé",
      dataIndex: "base_price",
      key: "price",
      render: (price) => (
        <span>{formatCurrency(price)}</span>
      )
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, record) => {
        const { status, color } = getShowtimeStatus(record);
        return <Tag color={color}>{status}</Tag>;
      }
    },
  ];

  if (isLoading) return <Spin className="flex justify-center mt-10" size="large" />;
  if (error) return <div className="text-red-500">Lỗi khi tải dữ liệu lịch chiếu!</div>;

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-4 items-center justify-between">
        <Space size="middle">
          <Search
            placeholder="Tìm kiếm theo tên phim"
            allowClear
            onSearch={handleSearch}
            onChange={handleInputChange}
            value={searchText}
            style={{ width: 250 }}
          />
          <Select
            value={statusFilter}
            onChange={handleStatusChange}
            style={{ width: 150 }}
          >
            <Select.Option value="all">Tất cả trạng thái</Select.Option>
            <Select.Option value="upcoming">Sắp chiếu</Select.Option>
            <Select.Option value="showing">Đang chiếu</Select.Option>
            <Select.Option value="past">Đã chiếu</Select.Option>
          </Select>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={showtimesData?.showtimes || []}
        rowKey="id"
        pagination={false}
        locale={{
          emptyText: "Chưa có lịch chiếu nào",
        }}
      />

      <div className="mt-4">
        <PaginationDefault
            current={showtimesData?.pagination?.currentPage || 1}
            total={showtimesData?.pagination?.total || 0}
            pageSize={pageSize}
            onChange={handlePageChange}
            showSizeChanger={false}
            pageSizeOptions={[5, 10, 15]}
        />
      </div>
    </div>
  );
} 