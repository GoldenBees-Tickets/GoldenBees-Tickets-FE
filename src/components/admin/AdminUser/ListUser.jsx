import { useState } from "react";
import { useGetUsersQuery } from "@/api/userApi";
import { Table, Button, Avatar, Modal, Spin, Tag, message, Input, Space } from "antd";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import PaginationDefault from "@/components/PaginationDefault";
import { formatDate } from "@/utils/format";

const { Search } = Input;

export default function ListUser() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const { data: usersData, isLoading, error } = useGetUsersQuery({
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
      title: "Người dùng",
      dataIndex: "username",
      key: "username",
      render: (username, record) => (
        <div className="flex items-center">
          <Avatar 
            src={record.avatar || "https://placehold.co/100x100"} 
            size={40} 
            alt={username}
          />
          <div className="ml-2">
            <div className="font-medium">{username}</div>
            <div className="text-xs text-gray-500">{record.email}</div>
          </div>
        </div>
      )
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      render: (phone) => phone || "-"
    },
    {
      title: "Điểm thưởng",
      dataIndex: "star",
      key: "star",
      render: (star) => star || 0
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, record) => (
        <Tag color={record.status ? "green" : "red"}>
          {record.status ? "Đang hoạt động" : "Đã khóa"}
        </Tag>
      )
    },
    {
      title: "Ngày đăng ký",
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
  if (error) return <div className="text-red-500">Lỗi khi tải dữ liệu người dùng!</div>;

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
        dataSource={usersData?.users || []}
        rowKey="id"
        pagination={false}
        locale={{
          emptyText: "Chưa có người dùng nào",
        }}
      />

      <div className="mt-4">
        <PaginationDefault
          current={usersData?.pagination?.page || 1}
          total={usersData?.pagination?.total || 0}
          pageSize={pageSize}
          onChange={handlePageChange}
          showSizeChanger={false}
          pageSizeOptions={[5, 10, 15]}
        />
      </div>
    </div>
  );
} 