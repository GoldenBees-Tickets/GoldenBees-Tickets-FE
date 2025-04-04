import { useState } from "react";
import { Link } from "react-router-dom";
import { Table, Button, Modal, Spin, message } from "antd";
import { FiEdit2, FiTrash2, FiEye } from "react-icons/fi";
import {
  useGetMoviesQuery,
  useDeleteMovieMutation,
} from "../../../api/movieApi";
import PaginationDefault from "@/components/PaginationDefault";

export default function ListMovies() {
  const { data, error, isLoading } = useGetMoviesQuery();
  const [deleteMovie] = useDeleteMovieMutation();
  
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const handleDelete = (movie) => {
    setSelectedMovie(movie);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteMovie(selectedMovie.id).unwrap();
      message.success("Xóa phim thành công!");
      setIsDeleteModalOpen(false);
    } catch (error) {
      message.error("Không thể xóa phim!");
    }
  };

  // Đảm bảo data là một mảng trước khi render
  const movies = Array.isArray(data) ? data : data?.movies || [];

  const columns = [
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
      title: "Năm sản xuất",
      dataIndex: "year",
      key: "year",
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
          <Link to={`/admin/movies/edit/${record.id}`}>
            <Button icon={<FiEdit2 />} />
          </Link>
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
  if (error) return <div className="text-red-500">Lỗi khi tải dữ liệu: {error.message}</div>;

  return (
    <>
      <Table
        columns={columns}
        dataSource={movies}
        rowKey="id"
        pagination={false}
        locale={{
          emptyText: "Chưa có phim nào trong danh sách",
        }}
      />

      <PaginationDefault
        totalItems={movies?.length || 0}
        totalPages={Math.ceil(
          (movies?.length || 0) / pageSize
        )}
        currentPage={currentPage}
        onPageChange={(page, newSize) => {
          setCurrentPage(page);
          if (newSize) setPageSize(newSize);
        }}
      />

      {/* Modal xác nhận xóa */}
      <Modal
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onOk={confirmDelete}
        okText="Xóa"
        okButtonProps={{ danger: true }}
        title="Xác nhận xóa"
      >
        Bạn có chắc chắn muốn xóa phim "{selectedMovie?.name}" không?
      </Modal>
    </>
  );
}
