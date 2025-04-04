import { useState } from "react";
import { Table, Tag, Button, Modal, Spin, message } from "antd";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { useGetGenresQuery, useDeleteGenreMutation } from "../../../api/genreApi";
import EditGenre from "./EditGenre";
import PaginationDefault from "@/components/PaginationDefault";
import PropTypes from 'prop-types';

export default function ListGenres() {
  const { data: genreData, error, isLoading } = useGetGenresQuery();
  const [deleteGenre] = useDeleteGenreMutation();

  const [selectedGenre, setSelectedGenre] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const handleEdit = (genre) => {
    setSelectedGenre(genre);
    setIsEditModalOpen(true);
  };

  const handleDelete = (genre) => {
    setSelectedGenre(genre);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteGenre(selectedGenre.id).unwrap();
      message.success("Xóa thể loại thành công!");
    } catch (error) {
      message.error("Xóa thể loại thất bại. Vui lòng thử lại!");
    }
    setIsDeleteModalOpen(false);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Tên Thể Loại",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button
            icon={<FiEdit2 />}
            onClick={() => handleEdit(record)}
          />
          <Button
            danger
            icon={<FiTrash2 />}
            onClick={() => handleDelete(record)}
          />
        </div>
      ),
    },
  ];

  if (isLoading) return <Spin className="flex justify-center mt-10" size="large" />;
  if (error) return <div className="text-red-500">Lỗi khi tải dữ liệu!</div>;

  return (
    <>
      <Table
        columns={columns}
        dataSource={genreData?.genres}
        rowKey="id"
        pagination={false}
      />

      <PaginationDefault
        totalItems={genreData?.genres?.length || 0}
        totalPages={Math.ceil(
          (genreData?.genres?.length || 0) / pageSize
        )}
        currentPage={currentPage}
        onPageChange={(page, newSize) => {
          setCurrentPage(page);
          if (newSize) setPageSize(newSize);
        }}
      />

      {/* Modal chỉnh sửa */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-[9999]">
          <div className="w-full max-w-lg bg-white rounded-lg overflow-hidden">
            <EditGenre {...selectedGenre} setToggleUpdateGenre={setIsEditModalOpen} />
          </div>
        </div>
      )}

      {/* Modal xác nhận xóa */}
      <Modal
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onOk={confirmDelete}
        okText="Xóa"
        okButtonProps={{ danger: true }}
        title="Xác nhận xóa"
      >
        Bạn có chắc chắn muốn xóa thể loại "{selectedGenre?.name}" không?
      </Modal>
    </>
  );
}

ListGenres.propTypes = {
  setToggleUpdateGenre: PropTypes.func
};
