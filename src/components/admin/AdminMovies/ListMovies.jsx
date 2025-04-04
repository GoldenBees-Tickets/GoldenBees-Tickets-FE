import { useState, useMemo } from "react";
import { useGetMoviesListQuery, useDeleteMovieMutation } from "@/api/movieApi";
import { Link } from "react-router-dom";
import { Table, Button, Space, Modal, message, Spin, Tag } from "antd";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import PaginationDefault from "@/components/PaginationDefault";

export default function ListMovies() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const { data: moviesData, isLoading, error } = useGetMoviesListQuery();
  const [deleteMovie, { isLoading: isDeleting }] = useDeleteMovieMutation();
  
  const movies = useMemo(() => moviesData?.movies || [], [moviesData]);

  const handleDeleteConfirm = async () => {
    try {
      await deleteMovie(selectedMovie.id).unwrap();
      message.success("Xóa phim thành công!");
      setIsDeleteModalOpen(false);
    } catch (error) {
      message.error("Lỗi khi xóa phim: " + (error.data?.message || error.message));
    }
  };

  const columns = [
    {
      title: "Phim",
      dataIndex: "title",
      key: "title",
      render: (title, record) => (
        <div className="flex">
          <img 
            src={record.poster || "https://placehold.co/100x150"}
            alt={title}
            className="w-12 h-16 object-cover rounded mr-3"
          />
          <div>
            <div className="font-medium">{title}</div>
            <div className="text-xs text-gray-500">
              {record.Director?.name || "Chưa có đạo diễn"}
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Thể loại",
      key: "genres",
      render: (_, record) => (
        <div className="flex flex-wrap gap-1">
          {record.Genres?.map((genre) => (
            <Tag key={genre.id} color="blue">
              {genre.name}
            </Tag>
          )) || "Chưa có thể loại"}
        </div>
      )
    },
    {
      title: "Thời lượng",
      dataIndex: "duration",
      key: "duration",
      render: (duration) => `${duration} phút`
    },
    {
      title: "Năm sản xuất",
      dataIndex: "release_date",
      key: "release_date",
      render: (date) => new Date(date).getFullYear()
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Link to={`/admin/movies/edit/${record.id}`}>
            <Button 
              type="primary" 
              icon={<FiEdit />} 
              size="small"
              className="flex items-center"
            />
          </Link>
          <Button 
            danger
            icon={<FiTrash2 />} 
            size="small"
            className="flex items-center"
            onClick={() => {
              setSelectedMovie(record);
              setIsDeleteModalOpen(true);
            }}
          />
        </Space>
      ),
    },
  ];

  if (isLoading) return <Spin className="flex justify-center mt-10" size="large" />;
  if (error) return <div className="text-red-500">Lỗi khi tải danh sách phim!</div>;

  // Calculate pagination
  const paginatedData = movies.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div>
      <Table
        columns={columns}
        dataSource={paginatedData}
        rowKey="id"
        pagination={false}
        locale={{
          emptyText: "Chưa có phim nào",
        }}
      />

      <PaginationDefault
        totalItems={movies.length}
        totalPages={Math.ceil(movies.length / pageSize)}
        currentPage={currentPage}
        onPageChange={(page, newSize) => {
          setCurrentPage(page);
          if (newSize) setPageSize(newSize);
        }}
      />

      <Modal
        title="Xác nhận xóa phim"
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
        <p>Bạn có chắc chắn muốn xóa phim này?</p>
        {selectedMovie && (
          <div className="mt-2 flex">
            <img 
              src={selectedMovie.poster || "https://placehold.co/100x150"}
              alt={selectedMovie.title}
              className="w-16 h-20 object-cover rounded mr-3"
            />
            <div>
              <p className="font-medium">{selectedMovie.title}</p>
              <p className="text-sm text-gray-500">
                Đạo diễn: {selectedMovie.Director?.name || "Chưa có đạo diễn"}
              </p>
              <p className="text-sm text-gray-500">
                Năm: {new Date(selectedMovie.release_date).getFullYear()}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
} 