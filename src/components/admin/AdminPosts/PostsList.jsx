import { useState } from "react";
import { useGetPostsQuery, useDeletePostMutation } from "@/api/postApi";
import { Link } from "react-router-dom";
import { Table, Button, Modal, Spin, message, Tooltip, Input, Space } from "antd";
import { FiEdit2, FiEye, FiTrash2, FiPlus } from "react-icons/fi";
import { SearchOutlined, CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";
import PaginationDefault from "../../PaginationDefault";

const { Search } = Input;

export default function PostsList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePostId, setDeletePostId] = useState(null);

  const { data: postData, isLoading, error } = useGetPostsQuery({ 
    page: currentPage, 
    limit: pageSize,
    search: searchValue,
    sort_order: sortOrder
  });

  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();

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

  const showDeleteConfirm = (id) => {
    setDeletePostId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deletePost(deletePostId).unwrap();
      message.success("Xóa bài viết thành công");
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting post:", error);
      message.error("Không thể xóa bài viết");
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeletePostId(null);
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
          Tiêu đề
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
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, record) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            record.status === "active"
              ? "bg-green-100 text-green-800"
              : record.status === "draft"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {record.status === "active"
            ? "Đã xuất bản"
            : record.status === "draft"
            ? "Bản nháp"
            : "Không hoạt động"}
        </span>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 180,
      render: (_, record) => (
        <div className="flex space-x-2">
          <Tooltip title="Chỉnh sửa">
            <Link to={`/admin/posts/edit/${record.id}`}>
              <Button icon={<FiEdit2 />} />
            </Link>
          </Tooltip>
          <Tooltip title="Xóa">
            <Button 
              icon={<FiTrash2 />} 
              danger 
              onClick={() => showDeleteConfirm(record.id)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  if (isLoading) return <Spin className="flex justify-center mt-10" size="large" />;
  if (error) return <div className="text-red-500">Lỗi khi tải dữ liệu!</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Quản lý bài viết</h1>
        <Link
          to="/admin/posts/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition duration-300"
        >
          <FiPlus className="mr-2" /> Thêm bài viết
        </Link>
      </div>

      <div className="mb-4">
        <Space size="middle">
          <Search
            placeholder="Tìm kiếm bài viết..."
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
        dataSource={postData?.posts || []}
        rowKey="id"
        pagination={false}
        locale={{
          emptyText: "Chưa có bài viết nào",
        }}
        className="shadow-md rounded-lg overflow-hidden"
      />

      <div className="mt-4">
        <PaginationDefault
          current={postData?.pagination?.currentPage || 1}
          total={postData?.pagination?.total || 0}
          pageSize={pageSize}
          onChange={handlePageChange}
          showSizeChanger={true}
          pageSizeOptions={[5, 10, 20]}
        />
      </div>

      <Modal
        title="Xác nhận xóa bài viết"
        open={isDeleteModalOpen}
        onOk={handleDelete}
        onCancel={handleCancelDelete}
        confirmLoading={isDeleting}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.</p>
      </Modal>
    </div>
  );
} 