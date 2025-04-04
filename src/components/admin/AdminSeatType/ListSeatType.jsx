import { useState, useEffect } from "react";
import { Table, Button, Modal, Spin, message } from "antd";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { useGetListSeatTypesQuery, useDeleteSeatTypeMutation } from "@/api/seatTypeApi";
import UpdateSeatType from "./UpdateSeatType";
import PaginationDefault from "@/components/PaginationDefault";
import AddSeatType from "./AddSeatType";

export default function ListSeatType() {
  const { data: listSeatTypes, isLoading } = useGetListSeatTypesQuery();
  const [deleteSeatType] = useDeleteSeatTypeMutation();
  
  const [isShowFormUpdate, setIsShowFormUpdate] = useState(false);
  const [isShowFormCreate, setIsShowFormCreate] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSeatType, setSelectedSeatType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const handleEdit = (seatType) => {
    setSelectedSeatType(seatType);
    setIsShowFormUpdate(true);
  };

  const handleDelete = (seatType) => {
    setSelectedSeatType(seatType);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteSeatType(selectedSeatType.id).unwrap();
      message.success("Xóa loại ghế thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa loại ghế:", error);
      message.error("Xóa loại ghế thất bại!");
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
      title: "Loại ghế",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Màu sắc",
      dataIndex: "color",
      key: "color",
      render: (color) => (
        <div className="flex items-center space-x-2">
          <div
            className="w-8 h-8 rounded-lg border shadow-sm"
            style={{ backgroundColor: color }}
          />
          <span className="text-sm text-gray-600">{color}</span>
        </div>
      ),
    },
    {
      title: "Giá thêm",
      dataIndex: "price_offset",
      key: "price_offset",
      render: (price) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(price)}
        </span>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <span>
          {new Date(date).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      ),
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

  const seatTypes = listSeatTypes?.seat_types || [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Danh Sách Loại Ghế</h2>
        <Button
          type="primary"
          icon={<FiPlus />}
          onClick={() => setIsShowFormCreate(true)}
          className="flex items-center bg-blue-500"
        >
          Thêm Loại Ghế
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={seatTypes}
        rowKey="id"
        pagination={false}
      />

      <PaginationDefault
        totalItems={seatTypes.length || 0}
        totalPages={Math.ceil((seatTypes.length || 0) / pageSize)}
        currentPage={currentPage}
        onPageChange={(page, newSize) => {
          setCurrentPage(page);
          if (newSize) setPageSize(newSize);
        }}
      />

      {isShowFormUpdate && (
        <UpdateSeatType
          seat_type={selectedSeatType}
          setIsShowFormUpdate={setIsShowFormUpdate}
        />
      )}

      {isShowFormCreate && (
        <AddSeatType
          isShowFormCreate={setIsShowFormCreate}
        />
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
        Bạn có chắc chắn muốn xóa loại ghế "{selectedSeatType?.type}" không?
      </Modal>
    </div>
  );
}
