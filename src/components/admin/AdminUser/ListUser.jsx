import { useState, useMemo } from "react";
import { useDeleteUserMutation, useGetUsersQuery } from "@/api/userApi";
import { Table, Button, Avatar, Modal, Spin, Tag, message } from "antd";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import PaginationDefault from "@/components/PaginationDefault";

export default function ListUser() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: usersData, isLoading, error } = useGetUsersQuery();
  console.log("UsersData:", usersData);
  console.log("IsLoading:", isLoading);
  console.log("Error:", error);
  
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const users = useMemo(() => {
    const allUsers = usersData?.users || [];
    return allUsers.filter(user => user.role === "user");
  }, [usersData]);

  const handleDeleteConfirm = async () => {
    try {
      await deleteUser(selectedUser.id).unwrap();
      message.success("Xóa người dùng thành công!");
      setIsDeleteModalOpen(false);
    } catch (error) {
      message.error("Lỗi khi xóa người dùng: " + (error.data?.message || error.message));
    }
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
      dataIndex: "point",
      key: "point",
      render: (point) => point || 0
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
      render: (date) => new Date(date).toLocaleDateString("vi-VN")
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button 
            type="primary" 
            icon={<FiEdit />} 
            size="small"
            className="flex items-center"
          />
          <Button 
            danger
            icon={<FiTrash2 />} 
            size="small"
            className="flex items-center"
            onClick={() => {
              setSelectedUser(record);
              setIsDeleteModalOpen(true);
            }}
          />
        </div>
      )
    }
  ];

  if (isLoading) return <Spin className="flex justify-center mt-10" size="large" />;
  if (error) return <div className="text-red-500">Lỗi khi tải dữ liệu người dùng!</div>;

  // Calculate pagination
  const paginatedData = users.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Danh sách khách hàng</h2>
        <p className="text-sm text-gray-500">Quản lý tài khoản người dùng trong hệ thống</p>
      </div>

      <Table
        columns={columns}
        dataSource={paginatedData}
        rowKey="id"
        pagination={false}
        locale={{
          emptyText: "Chưa có người dùng nào",
        }}
      />

      <PaginationDefault
        totalItems={users.length}
        totalPages={Math.ceil(users.length / pageSize)}
        currentPage={currentPage}
        onPageChange={(page, newSize) => {
          setCurrentPage(page);
          if (newSize) setPageSize(newSize);
        }}
      />

      <Modal
        title="Xác nhận xóa người dùng"
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsDeleteModalOpen(false)}>
            Hủy
          </Button>,
          <Button 
            key="delete" 
            danger 
            loading={isDeleting} 
            onClick={handleDeleteConfirm}
          >
            Xóa
          </Button>,
        ]}
      >
        <p>Bạn có chắc chắn muốn xóa người dùng này?</p>
        {selectedUser && (
          <div className="mt-2">
            <p><strong>Tên người dùng:</strong> {selectedUser.username}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
          </div>
        )}
      </Modal>
    </div>
  );
} 