import { useState } from "react";
import { Table, Button, Modal, Spin, Input, Space, message } from "antd";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { SearchOutlined } from "@ant-design/icons";
import PaginationDefault from "@/components/PaginationDefault";
import { useGetGenresQuery, useDeleteGenreMutation } from "@/api/genreApi";
import PropTypes from 'prop-types';
import EditGenre from "./EditGenre";
import { canPerformAdminAction } from "@/utils/auth";

const { Search } = Input;

export default function ListGenre() {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState("");
  const [searchValue, setSearchValue] = useState("");

  // Check if user has full admin permissions
  const canEditGenres = canPerformAdminAction();

  const { data: genresData, isLoading, error } = useGetGenresQuery({
    page: currentPage,
    limit: pageSize,
    search: searchValue
  });

  const [deleteGenre] = useDeleteGenreMutation();

  const handleEdit = (genre) => {
    setSelectedGenre(genre);    
    setIsEditModalOpen(true);
  };

  const handleDelete = (genre) => {
    setSelectedGenre(genre);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteGenre(selectedGenre.id).unwrap();
      message.success("Xóa thể loại thành công!");
      setIsDeleteModalOpen(false);
    } catch (error) {
      message.error("Lỗi khi xóa thể loại: " + (error.data?.message || error.message));
    }
  };

  const handlePageChange = (page, newPageSize) => {
    if (newPageSize !== pageSize) {
      setPageSize(newPageSize);
      setCurrentPage(1);
    } else {
      setCurrentPage(page);
    }
  };

  const handleSearch = (value) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleReset = () => {
    setSearchText("");
    setSearchValue("");
    setCurrentPage(1);
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      width: 80,
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1
    },
    {
      title: "Tên thể loại",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => createdAt ? new Date(createdAt).toLocaleDateString("vi-VN", {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }) : "N/A"
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (updatedAt) => updatedAt ? new Date(updatedAt).toLocaleDateString("vi-VN", {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }) : "N/A"
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
      align: "right",
      render: (_, record) => (
        canEditGenres ? (
          <Space>
            <Button
              icon={<FiEdit2 />}
              onClick={() => handleEdit(record)}
            />
            <Button
              danger
              icon={<FiTrash2 />}
              onClick={() => handleDelete(record)}
            />
          </Space>
        ) : null
      )
    }
  ];

  if (isLoading) return <Spin className="flex justify-center mt-10" size="large" />;
  if (error) return <div className="text-red-500">Lỗi khi tải dữ liệu thể loại!</div>;

  return (
    <div>
      {/* Thanh tìm kiếm và bộ lọc */}
      <div className="mb-4 flex flex-wrap gap-3">
        <Search
          placeholder="Tìm kiếm thể loại..."
          allowClear
          onSearch={handleSearch}
          value={searchText}
          onChange={handleInputChange}
          style={{ width: 250 }}
          prefix={<SearchOutlined className="text-gray-400" />}
        />
        
        {searchValue && (
          <Button onClick={handleReset}>Xóa bộ lọc</Button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <Table
          columns={canEditGenres ? columns : columns.filter(col => col.key !== "action")}
          dataSource={genresData?.genres || []}
          rowKey="id"
          pagination={false}
          locale={{
            emptyText: "Chưa có thể loại nào"
          }}
        />
      </div>

      {/* Phân trang */}
      {(genresData?.genres?.length > 0) && (
        <div className="mt-4">
          <PaginationDefault
            current={genresData?.pagination?.page || 1}
            total={genresData?.pagination?.total || 0}
            pageSize={pageSize}
            onChange={handlePageChange}
            showSizeChanger={true}
            pageSizeOptions={[5, 10, 20]}
          />
        </div>
      )}

      {/* Modal xác nhận xóa */}
      <Modal
        title="Xác nhận xóa"
        open={isDeleteModalOpen}
        onOk={handleDeleteConfirm}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Xóa"
        okButtonProps={{ danger: true }}
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn xóa thể loại "{selectedGenre?.name}" không?</p>
      </Modal>

      {/* Modal chỉnh sửa */}
      {isEditModalOpen && selectedGenre && (
        <Modal
          open={isEditModalOpen}
          footer={null}
          onCancel={() => setIsEditModalOpen(false)}
          width={500}
        >
          <EditGenre 
            id={selectedGenre.id} 
            name={selectedGenre.name} 
            setToggleUpdateGenre={(value) => setIsEditModalOpen(value)} 
          />
        </Modal>
      )}
    </div>
  );
}

ListGenre.propTypes = {};

