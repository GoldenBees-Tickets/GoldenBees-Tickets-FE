import { useState } from "react";
import { Table, Tag, Button, Modal, Spin, message } from "antd";
import { FiEdit2, FiTrash2, FiEye } from "react-icons/fi";
import { useGetCinemasQuery, useDeleteCinemaMutation } from "../../../api/cinemaApi";
import EditCinema from "./EditCinemas";
import PaginationDefault from "@/components/PaginationDefault";

export default function ListCinemas() {
  const { data: cinemaData, error, isLoading } = useGetCinemasQuery();
  const [deleteCinema] = useDeleteCinemaMutation();

  const [selectedCinema, setSelectedCinema] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const handleEdit = (cinema) => {
    setSelectedCinema(cinema);
    setIsEditModalOpen(true);
  };

  const handleDelete = (cinema) => {
    setSelectedCinema(cinema);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteCinema(selectedCinema.id).unwrap();
      message.success("Xóa cinema thành công!");
    } catch (error) {
      message.error("Xóa cinema thất bại. Vui lòng thử lại!");
    }
    setIsDeleteModalOpen(false);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
    },
    {
      title: "Tên Cinema",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Thành phố",
      dataIndex: "city",
      key: "city",
      render: (city) => <Tag color="blue">{city}</Tag>,
    },
    {
      title: "Quận",
      dataIndex: "district",
      key: "district",
    },
    {
      title: "Phường",
      dataIndex: "ward",
      key: "ward",
    },
    {
      title: "Đường",
      dataIndex: "street",
      key: "street",
      ellipsis: true,
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
        dataSource={cinemaData?.cinemas}
        rowKey="id"
        pagination={false}
      />

      <PaginationDefault
        totalItems={cinemaData?.cinemas?.length || 0}
        totalPages={Math.ceil(
          (cinemaData?.cinemas?.length || 0) / pageSize
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
          <EditCinema
            {...selectedCinema}
            setToggleUpdateCinema={setIsEditModalOpen}
          />
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
        Bạn có chắc chắn muốn xóa cinema "{selectedCinema?.name}" không?
      </Modal>
    </>
  );
}
