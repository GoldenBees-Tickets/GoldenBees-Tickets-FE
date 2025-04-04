import { useGetAdminBranchesQuery } from "@/api/userApi";
import { useState, useMemo } from "react";
import { Table, Tag, Switch, Avatar, Spin } from "antd";
import PaginationDefault from "@/components/PaginationDefault";

export default function ListAdmin() {
  const { data: listAdmins, isLoading, error } = useGetAdminBranchesQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const listData = useMemo(
    () => listAdmins?.admin_branches || [],
    [listAdmins]
  );

  const columns = [
    {
      title: "Người dùng",
      dataIndex: "username",
      key: "username",
      render: (username, record) => (
        <div className="flex items-center">
          <Avatar 
            src="https://png.pngtree.com/png-vector/20191125/ourmid/pngtree-beautiful-admin-roles-line-vector-icon-png-image_2035379.jpg" 
            size={40} 
            alt={username}
          />
          <div className="ml-2">
            <p className="text-sm font-medium">{username}</p>
            <p className="text-xs text-gray-500">{record.email}</p>
          </div>
        </div>
      )
    },
    {
      title: "Chi nhánh",
      dataIndex: ["Branch", "name"],
      key: "branch",
    },
    {
      title: "Trạng thái",
      key: "status",
      render: () => <Switch disabled />,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
    },
  ];

  if (isLoading) return <Spin className="flex justify-center mt-10" size="large" />;
  if (error) return <div className="text-red-500">Lỗi khi tải dữ liệu!</div>;

  return (
    <>
      <Table
        columns={columns}
        dataSource={listData}
        rowKey="id"
        pagination={false}
        locale={{
          emptyText: "Chưa có quản trị viên nào",
        }}
      />

      <PaginationDefault
        totalItems={listData?.length || 0}
        totalPages={Math.ceil(
          (listData?.length || 0) / pageSize
        )}
        currentPage={currentPage}
        onPageChange={(page, newSize) => {
          setCurrentPage(page);
          if (newSize) setPageSize(newSize);
        }}
      />
    </>
  );
}
