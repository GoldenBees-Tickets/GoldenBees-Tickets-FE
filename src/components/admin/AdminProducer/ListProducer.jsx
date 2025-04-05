import { useState } from "react";
import { Link } from "react-router-dom";
import { Table, Button, Modal, Spin, message } from "antd";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { useGetProducersQuery, useDeleteProducerMutation } from "@/api/producerApi";
import PaginationDefault from "@/components/PaginationDefault";
import { formatImage } from "@/utils/formatImage";


export default function ListProducers() {
  const { data: producerData, isLoading } = useGetProducersQuery();
  const [deleteProducer] = useDeleteProducerMutation();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProducer, setSelectedProducer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  

  const handleEdit = (producer) => {
    // Link to edit page is handled in the column definition
  };

  const handleDelete = (producer) => {
    setSelectedProducer(producer);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteProducer(selectedProducer.id).unwrap();
      message.success("Xoá nhà sản xuất thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa nhà sản xuất:", error);
      message.error("Xoá nhà sản xuất thất bại. Vui lòng thử lại.");
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
      title: "Hình ảnh",
      dataIndex: "profile_picture",
      key: "profile_picture",
      width: 100,
      render: (profile_picture, record) => (
        <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100">
          <img
            src={formatImage(profile_picture)}
            alt={record.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/placeholder-producer.png';
            }}
          />
        </div>
      ),
    },
    {
      title: "Tên nhà sản xuất",
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
            href={`/admin/editProducer/${record.id}`}
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Danh Sách Nhà Sản Xuất</h2>
          <p className="text-xs text-gray-600">Quản lý thông tin các nhà sản xuất phim</p>
        </div>
        <Link to="../addProducer">
          <Button
            type="primary"
            icon={<FiPlus />}
            className="flex items-center bg-blue-500"
          >
            Thêm Nhà Sản Xuất
          </Button>
        </Link>
      </div>

      <Table
        columns={columns}
        dataSource={producerData?.producers}
        rowKey="id"
        pagination={false}
      />

      <PaginationDefault
        totalItems={producerData?.producers?.length || 0}
        totalPages={Math.ceil(
          (producerData?.producers?.length || 0) / pageSize
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
        Bạn có chắc chắn muốn xóa nhà sản xuất "{selectedProducer?.name}" không?
      </Modal>
    </div>
  );
}
