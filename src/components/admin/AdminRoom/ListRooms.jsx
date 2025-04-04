import { useGetRoomsQuery, useDeleteRoomMutation } from "@/api/roomApi";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table, Button, Modal, Spin, message } from "antd";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import PaginationDefault from "../../PaginationDefault";

export default function ListRooms() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: listRooms, isLoading, error } = useGetRoomsQuery({ 
    page: currentPage, 
    pageSize 
  });
  const [deleteRoom] = useDeleteRoomMutation();

  const [rooms, setRooms] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (listRooms?.data) {
      setRooms(listRooms?.data.rooms || []);
      setTotalItems(listRooms?.data.totalItems || 0);
      setTotalPages(listRooms?.data.totalPages || 0);
    }
  }, [listRooms]);

  const handlePageChange = (page, size = pageSize) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleDelete = (room) => {
    setSelectedRoom(room);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteRoom(selectedRoom.id);
      message.success("Xóa phòng thành công!");
      setIsDeleteModalOpen(false);
    } catch (error) {
      message.error("Xóa phòng thất bại. Vui lòng thử lại!");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80
    },
    {
      title: "Tên phòng",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Rạp",
      dataIndex: ["Cinema", "name"],
      key: "cinema",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <div className="flex space-x-2">
          <Link to={`${record.id}`}>
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
        dataSource={rooms}
        rowKey="id"
        pagination={false}
        locale={{
          emptyText: "Chưa có phòng nào",
        }}
      />

      <PaginationDefault
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
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
        Bạn có chắc chắn muốn xóa phòng "{selectedRoom?.name}" không?
      </Modal>
    </>
  );
}
