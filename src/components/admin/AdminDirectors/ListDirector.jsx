import { useState } from "react";
import { Link } from "react-router-dom";
import { Table, Tag, Button, Modal, Spin, message, Avatar } from "antd";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import {
  useDeleteDirectorMutation,
  useGetDirectorsQuery,
} from "../../../api/directorApi";
import PaginationDefault from "@/components/PaginationDefault";

const API_BASE_URL = import.meta.env.VITE_SOCKET_URL;

export default function ListDirector() {
  const { data: directorData, error, isLoading } = useGetDirectorsQuery();
  const [deleteDirector] = useDeleteDirectorMutation();

  const [selectedDirector, setSelectedDirector] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const handleDelete = (director) => {
    setSelectedDirector(director);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteDirector(selectedDirector.id).unwrap();
      message.success("Xóa đạo diễn thành công!");
    } catch (error) {
      message.error("Xóa đạo diễn thất bại. Vui lòng thử lại!");
    }
    setIsDeleteModalOpen(false);
  };

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "profile_picture",
      key: "profile_picture",
      render: (profile_picture) => (
        <Avatar 
          src={`${API_BASE_URL}/${profile_picture}`}
          size={40}
          onError={(e) => {
            e.target.src = '/placeholder-director.png';
          }}
        />
      ),
    },
    {
      title: "Tên đạo diễn",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Ngày sinh",
      dataIndex: "dob",
      key: "dob",
      render: (dob) => new Date(dob).toLocaleDateString("vi-VN"),
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (gender) => (
        <Tag color={gender === "Male" ? "blue" : "pink"}>
          {gender === "Male" ? "Nam" : "Nữ"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <div className="flex space-x-2">
          <Link to={`/admin/editDirector/${record.id}`}>
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
  if (error) return <div className="text-red-500">Lỗi khi tải dữ liệu!</div>;

  return (
    <>
      <Table
        columns={columns}
        dataSource={directorData?.directors}
        rowKey="id"
        pagination={false}
      />

      <PaginationDefault
        totalItems={directorData?.directors?.length || 0}
        totalPages={Math.ceil(
          (directorData?.directors?.length || 0) / pageSize
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
        Bạn có chắc chắn muốn xóa đạo diễn "{selectedDirector?.name}" không?
      </Modal>
    </>
  );
}
