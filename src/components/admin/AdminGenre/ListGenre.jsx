import { useState } from "react";
import { Table, Button, Modal, Spin, Input, Space, message } from "antd";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { SearchOutlined } from "@ant-design/icons";
import PaginationDefault from "@/components/PaginationDefault";
import { useGetGenresQuery, useDeleteGenreMutation } from "@/api/genreApi";
import PropTypes from 'prop-types';
import EditGenre from "./EditGenre";

const { Search } = Input;

export default function ListGenre() {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState("");
  const [searchValue, setSearchValue] = useState("");

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

  const handleSearchChange = (e) => {
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
      title: "Thao tác",
      key: "action",
      width: 120,
      align: "right",
      render: (_, record) => (
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
          onChange={handleSearchChange}
          style={{ width: 250 }}
          prefix={<SearchOutlined className="text-gray-400" />}
        />
        
        {searchValue && (
          <Button onClick={handleReset}>Xóa bộ lọc</Button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <Table
          columns={columns}
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
          bodyStyle={{ padding: 0 }}
        >
          <EditGenre 
            id={selectedGenre.id} 
            name={selectedGenre.name} 
            setToggleUpdateGenre={() => setIsEditModalOpen(false)} 
          />
        </Modal>
      )}
    </div>
  );
}

ListGenre.propTypes = {
  setToggleUpdateGenre: PropTypes.func
};

