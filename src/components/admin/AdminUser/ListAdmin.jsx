import { useState } from "react";
import { Table, Button, Modal, Spin, Input, Space, Switch, message, Tag, Popconfirm } from "antd";
import { FiEdit2 } from "react-icons/fi";
import PaginationDefault from "@/components/PaginationDefault";
import { formatDate } from "@/utils/format";
import { useGetAdminBranchesQuery, useUpdateAdminStatusMutation } from "@/api/userApi";
import UpdateAdmin from "./UpdateAdmin";

const { Search } = Input;

export default function ListAdmin() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [statusUpdating, setStatusUpdating] = useState(null);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const { data: adminsData, isLoading, error, refetch } = useGetAdminBranchesQuery({
    page: currentPage,
    limit: pageSize,
    search: searchText
  });
  
  const [updateAdminStatus] = useUpdateAdminStatusMutation();

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
  
  const handleStatusChange = async (checked, adminId) => {
    try {
      setStatusUpdating(adminId);
      
      await updateAdminStatus({
        id: adminId,
        status: checked
      }).unwrap();
      
      message.success(`Đã ${checked ? 'kích hoạt' : 'vô hiệu hóa'} tài khoản quản trị viên`);
      refetch();
    } catch (error) {
      message.error("Có lỗi xảy ra khi cập nhật trạng thái");
    } finally {
      setStatusUpdating(null);
    }
  };

  const handleEditAdmin = (admin) => {
    setSelectedAdmin(admin);
    setIsUpdateModalVisible(true);
  };

  const handleUpdateModalClose = () => {
    setIsUpdateModalVisible(false);
    setSelectedAdmin(null);
    refetch();
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
      title: "Trạng thái",
      dataIndex: "is_active",
      key: "is_active",
      render: (is_active, record) => (
        <div className="flex items-center">
          <Tag color={is_active ? "green" : "red"}>
            {is_active ? "Hoạt động" : "Bị khóa"}
          </Tag>
          <Popconfirm
            title={`Bạn có muốn ${is_active ? 'khóa' : 'kích hoạt'} tài khoản này?`}
            onConfirm={() => handleStatusChange(!is_active, record.id)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Switch
              checked={is_active}
              loading={statusUpdating === record.id}
              size="small"
              className="ml-2"
            />
          </Popconfirm>
        </div>
      )
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            icon={<FiEdit2 />}
            title="Chỉnh sửa"
            onClick={() => handleEditAdmin(record)}
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

      <Modal
        title={null}
        open={isUpdateModalVisible}
        footer={null}
        onCancel={handleUpdateModalClose}
        destroyOnClose
        width={500}
        styles={{
          body: { padding: 0 }
        }}      
        >
        {selectedAdmin && (
          <UpdateAdmin 
            onClose={handleUpdateModalClose} 
            adminData={selectedAdmin} 
          />
        )}
      </Modal>
    </div>
  );
}
