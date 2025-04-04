import { useState } from "react";
import { Table, Tag, Button, Modal, Spin, message } from "antd";
import { FiEdit2, FiTrash2, FiEye } from "react-icons/fi";
import {
  useGetPromotionsQuery,
  useDeletePromotionMutation,
} from "@/api/promotionApi";
import { useNavigate } from "react-router-dom";
import PaginationDefault from "@/components/PaginationDefault";
import EditPromotionModal from "./EditPromotion";

export default function ListPromotions() {
  const { data: promotionData, error, isLoading } = useGetPromotionsQuery();
  const [deletePromotion] = useDeletePromotionMutation();
  const navigate = useNavigate();

  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const handleViewDetail = (promotion) => {
    setSelectedPromotion(promotion);
    setDetailModalOpen(true);
  };

  const handleDelete = (promotion) => {
    setSelectedPromotion(promotion);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deletePromotion(selectedPromotion.id).unwrap();
      message.success("Xóa khuyến mãi thành công!");
    } catch {
      message.error("Xóa khuyến mãi thất bại. Vui lòng thử lại!");
    }
    setDeleteModalOpen(false);
  };

  const handleEdit = (promotion) => {
    if (new Date(promotion.end_date) < new Date()) {
      message.error("Mã giảm giá đã hết hạn, không thể chỉnh sửa!");
      return;
    }
    setSelectedPromotion(promotion);
    setEditModalOpen(true);
  };
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("vi-VN");

  const columns = [
    {
      title: "Mã giảm giá",
      dataIndex: "code",
      key: "code",
      render: (code) => <Tag color="blue">{code}</Tag>,
      width: 120, // Giới hạn độ rộng
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giảm giá",
      dataIndex: "discount_value",
      key: "discount_value",
      width: 150,
      render: (value, record) =>
        record.discount_type === "percentage"
          ? `${value}%`
          : `${value.toLocaleString()}đ`,
    },
    {
      title: "Thời gian",
      key: "time",
      render: (_, record) =>
        `${formatDate(record.start_date)} - ${formatDate(record.end_date)}`,
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, record) =>
        new Date(record.end_date) > new Date() ? (
          <Tag color="green">Đang áp dụng</Tag>
        ) : (
          <Tag color="red">Hết hạn</Tag>
        ),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button icon={<FiEye />} onClick={() => handleViewDetail(record)} />
          <Button icon={<FiEdit2 />} onClick={() => handleEdit(record)} />
          <Button
            danger
            icon={<FiTrash2 />}
            onClick={() => handleDelete(record)}
          />
        </div>
      ),
    },
  ];

  if (isLoading)
    return <Spin className="flex justify-center mt-10" size="large" />;
  if (error) return <div className="text-red-500">Lỗi khi tải dữ liệu!</div>;

  return (
    <div>
      <Table
        columns={columns}
        dataSource={promotionData?.promotions}
        rowKey="id"
        pagination={false}
      />

      <PaginationDefault
        totalItems={promotionData?.promotions?.length || 0}
        totalPages={Math.ceil(
          (promotionData?.promotions?.length || 0) / pageSize
        )}
        currentPage={currentPage}
        onPageChange={(page, newSize) => {
          setCurrentPage(page);
          if (newSize) setPageSize(newSize);
        }}
      />

      {/* Modal xem chi tiết */}
      <Modal
        open={isDetailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        footer={null}
        title="Chi tiết khuyến mãi"
      >
        {selectedPromotion && (
          <div className="space-y-2">
            <p>
              <strong>Tên:</strong> {selectedPromotion.name}
            </p>
            <p>
              <strong>Mã:</strong> {selectedPromotion.code}
            </p>
            <p>
              <strong>Giảm giá:</strong>{" "}
              {selectedPromotion.discount_type === "percentage"
                ? `${selectedPromotion.discount_value}%`
                : `${selectedPromotion.discount_value.toLocaleString()}đ`}
            </p>
            <p>
              <strong>Thời gian:</strong>{" "}
              {formatDate(selectedPromotion.start_date)} -{" "}
              {formatDate(selectedPromotion.end_date)}
            </p>
            <p>
              <strong>Mô tả:</strong>{" "}
              {selectedPromotion.description || "Không có mô tả"}
            </p>
          </div>
        )}
      </Modal>

      {/* Modal xác nhận xóa */}
      <Modal
        open={isDeleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        onOk={confirmDelete}
        okText="Xóa"
        okButtonProps={{ danger: true }}
        title="Xác nhận xóa"
      >
        Bạn có chắc chắn muốn xóa mã giảm giá "{selectedPromotion?.name}" không?
      </Modal>

      {/* Modal chỉnh sửa */}
      <EditPromotionModal
        visible={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        promotion={selectedPromotion}
      />
    </div>
  );
}
