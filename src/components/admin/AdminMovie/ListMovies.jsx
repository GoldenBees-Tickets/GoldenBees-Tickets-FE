import { useState } from "react";
import { Link } from "react-router-dom";
import { Table, Button, Spin, Tag, Input, Select, Space } from "antd";
import { FiEdit2, FiEye } from "react-icons/fi";
import {
  SearchOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
} from "@ant-design/icons";
import { useGetMoviesQuery } from "@/api/movieApi";
import PaginationDefault from "@/components/PaginationDefault";
import { formatDate } from "@/utils/format";
import { canPerformAdminAction } from "@/utils/auth";

const { Search } = Input;
const { Option } = Select;

export default function ListMovies() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  
  // Check if user has full admin permissions
  const canEditMovies = canPerformAdminAction();

  // Gọi API với các tham số phân trang và lọc
  const {
    data: movieData,
    error,
    isLoading,
  } = useGetMoviesQuery({
    page: currentPage,
    limit: pageSize,
    search: searchValue,
    sort_order: sortOrder,
  });

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
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
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
              className={`text-[10px] ${
                sortOrder === "asc" ? "text-blue-500" : "text-gray-400"
              }`}
              style={{ marginBottom: -2 }}
            />
            <CaretDownOutlined
              className={`text-[10px] ${
                sortOrder === "desc" ? "text-blue-500" : "text-gray-400"
              }`}
            />
          </div>
        </div>
      ),
      dataIndex: "release_date",
      key: "release_date",
      render: (release_date) => `${formatDate(release_date)}`,
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      render: (end_date) =>  `${formatDate(end_date)}`,
    },
    {
      title: "Suất chiếu còn",
      dataIndex: "total_showtimes",
      key: "total_showtimes",
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
          {canEditMovies && (
            <Link to={`/admin/movies/edit/${record.id}`}>
              <Button icon={<FiEdit2 />} />
            </Link>
          )}
        </div>
      ),
    },
  ];

  if (isLoading)
    return <Spin className="flex justify-center mt-10" size="large" />;
  if (error)
    return (
      <div className="text-red-500">Lỗi khi tải dữ liệu: {error.message}</div>
    );

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

          {(searchValue || statusFilter || sortOrder !== "desc") && (
            <Button onClick={handleReset}>Xóa bộ lọc</Button>
          )}
        </Space>
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
