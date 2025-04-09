import { useState } from "react";
import { Table, Button, Modal, Spin, Input, Space } from "antd";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import PaginationDefault from "@/components/PaginationDefault";
import { formatDate } from "@/utils/format";
import { useGetAdminBranchesQuery } from "@/api/userApi";

const { Search } = Input;

export default function ListAdmin() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const { data: adminsData, isLoading, error } = useGetAdminBranchesQuery({
    page: currentPage,
    limit: pageSize,
    search: searchText
  });

  const handlePageChange = (page, newPageSize) => {
    if (newPageSize !== pageSize) {
      setPageSize(newPageSize);
      setCurrentPage(1);
    } else {
      setCurrentPage(page);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const columns = [
    {
      title: "Họ tên",
      dataIndex: "username",
      key: "username"
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email"
    },
    {
      title: "Chi nhánh",
      dataIndex: "Branch",
      key: "Branch",
      render: (Branch) => <span>{Branch?.name}</span>
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => <span>{formatDate(date)}</span>
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            icon={<FiEdit2 />}
          />
        </Space>
      )
    }
  ];

  if (isLoading) return <Spin className="flex justify-center mt-10" size="large" />;
  if (error) return <div className="text-red-500">Lỗi khi tải dữ liệu quản trị viên!</div>;

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-4 items-center justify-between">
        <Search
          placeholder="Tìm kiếm theo tên hoặc email"
          allowClear
          value={searchValue}
          onChange={handleSearchChange}
          onSearch={handleSearch}
          style={{ width: 300 }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={adminsData?.adminBranches || []}
        rowKey="id"
        pagination={false}
        locale={{
          emptyText: "Không có quản trị viên nào",
        }}
      />

      <div className="mt-4">
        <PaginationDefault
          current={adminsData?.pagination?.page || 1}
          total={adminsData?.pagination?.total || 0}
          pageSize={pageSize}
          onChange={handlePageChange}
          showSizeChanger={false}
          pageSizeOptions={[5, 10, 15]}
        />
      </div>
    </div>
  );
}
