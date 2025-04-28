import { useState } from "react";
import { Link } from "react-router-dom";
import { Table, Button, Spin, message, Tag, Input, Select, Space } from "antd";
import { FiEdit2, FiEye } from "react-icons/fi";
import { SearchOutlined, CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";
import {
  useGetMoviesQuery,
  useUpdateStatusMutation
} from "@/api/movieApi";
import PaginationDefault from "@/components/PaginationDefault";
import { formatDate } from "@/utils/format";

const { Search } = Input;
const { Option } = Select;

export default function ListMovies() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  // Gọi API với các tham số phân trang và lọc
  const { data: movieData, error, isLoading } = useGetMoviesQuery({
    page: currentPage,
    limit: pageSize,
    search: searchValue,
    status: statusFilter,
    sort_order: sortOrder
  });
  
  const [updateStatus, { isLoading: isUpdating }] = useUpdateStatusMutation();

  const handleUpdateAllStatus = async () => {
    try {
      await updateStatus().unwrap();
      message.success("Cập nhật trạng thái tất cả phim thành công!");
    } catch (error) {
      message.error("Không thể cập nhật trạng thái phim!");
    }
  };

  const handleSearch = (value) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchText("");
    setSearchValue("");
    setStatusFilter("");
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

  const getStatusTag = (status) => {
    switch (status) {
      case "coming_soon":
        return <Tag color="blue">Sắp ra mắt</Tag>;
      case "opening_soon":
        return <Tag color="orange">Sắp chiếu</Tag>;
      case "now_showing":
        return <Tag color="green">Đang chiếu</Tag>;
      case "ended":
        return <Tag color="red">Đã kết thúc</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  const columns = [
    {
      title: "STT",
      key: "index",
      width: 60,
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Tên phim",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Thời lượng",
      dataIndex: "duration",
      key: "duration",
      render: (duration) => `${duration} phút`,
    },
    {
      title: (
        <div 
          className="flex items-center cursor-pointer select-none" 
          onClick={toggleSortOrder}
        >
          Ngày phát hành
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
      dataIndex: "release_date",
      key: "release_date",
      render: (release_date) => `${formatDate(release_date)}`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
    },
    {
      title: "Năm sản xuất",
      dataIndex: "year",
      key: "year",
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <div className="flex space-x-2">
          <Link to={`/admin/movies/${record.id}`}>
            <Button icon={<FiEye />} />
          </Link>
          <Link to={`/admin/movies/edit/${record.id}`}>
            <Button icon={<FiEdit2 />} />
          </Link>
        </div>
      ),
    },
  ];

  if (isLoading) return <Spin className="flex justify-center mt-10" size="large" />;
  if (error) return <div className="text-red-500">Lỗi khi tải dữ liệu: {error.message}</div>;

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <Space size="middle">
          <Search
            placeholder="Tìm kiếm phim..."
            onSearch={handleSearch}
            value={searchText}
            onChange={handleInputChange}
            style={{ width: 250 }}
            prefix={<SearchOutlined className="text-gray-400" />}
            allowClear
          />
          <Select
            placeholder="Lọc theo trạng thái"
            style={{ width: 180 }}
            onChange={handleStatusFilterChange}
            value={statusFilter}
            allowClear
          >
            <Option value="now_showing">Đang chiếu</Option>
            <Option value="opening_soon">Sắp chiếu</Option>
            <Option value="coming_soon">Sắp ra mắt</Option>
            <Option value="ended">Đã kết thúc</Option>
          </Select>
          {(searchValue || statusFilter || sortOrder !== "desc") && (
            <Button onClick={handleReset}>Xóa bộ lọc</Button>
          )}
        </Space>
        <Button 
          type="primary" 
          onClick={handleUpdateAllStatus}
          loading={isUpdating}
        >
          Cập nhật trạng thái tất cả phim
        </Button>
      </div>

      <div className="bg-white rounded-md shadow">
        <Table
          columns={columns}
          dataSource={movieData?.movies || []}
          rowKey="id"
          pagination={false}
          locale={{
            emptyText: "Chưa có phim nào trong danh sách",
          }}
        />

        <div className="p-4 border-t">
          <PaginationDefault
            current={movieData?.pagination?.currentPage || 1}
            total={movieData?.pagination?.total || 0}
            pageSize={pageSize}
            onChange={handlePageChange}
            showSizeChanger={false}
            pageSizeOptions={[5, 10, 15]}
          />
        </div>
      </div>
    </>
  );
}
