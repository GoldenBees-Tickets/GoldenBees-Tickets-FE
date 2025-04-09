import { useState } from "react";
import { Link } from "react-router-dom";
import { Table, Button, Modal, Spin, message, Input, Space } from "antd";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { SearchOutlined, CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";
import { useGetProducersQuery, useDeleteProducerMutation } from "@/api/producerApi";
import PaginationDefault from "@/components/PaginationDefault";
import { formatImage } from "@/utils/formatImage";

const { Search } = Input;

export default function ListProducers() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProducer, setSelectedProducer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  // Gọi API với các tham số phân trang và lọc
  const { data: producerData, error, isLoading } = useGetProducersQuery({
    page: currentPage,
    limit: pageSize,
    search: searchValue,
    sort_order: sortOrder
  });
  
  const [deleteProducer] = useDeleteProducerMutation();

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

  const handleSearch = (value) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchText("");
    setSearchValue("");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  const handlePageChange = (page, newPageSize) => {
    if (newPageSize !== pageSize) {
        setPageSize(newPageSize);
    }
    setCurrentPage(page);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    setCurrentPage(1);
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
      title: (
        <div 
          className="flex items-center cursor-pointer select-none" 
          onClick={toggleSortOrder}
        >
          Tên nhà sản xuất
          <div className="flex flex-col ml-1">
            <CaretUpOutlined 
              className={`text-[10px] ${sortOrder === "asc" ? "text-blue-500" : "text-gray-400"}`}
              style={{ marginBottom: -2 }}
            />
            <CaretDownOutlined 
              className={`text-[10px] ${sortOrder === "desc" ? "text-blue-500" : "text-gray-400"}`}
            />
          </div>
        </div>
      ),
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
  if (error) return <div className="text-red-500">Lỗi khi tải dữ liệu!</div>;

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

      <div className="mb-4">
        <Space size="middle">
          <Search
            placeholder="Tìm kiếm nhà sản xuất..."
            allowClear
            onSearch={handleSearch}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
            prefix={<SearchOutlined className="text-gray-400" />}
          />
          {(searchValue || sortOrder !== "desc") && (
            <Button onClick={handleReset}>Xóa bộ lọc</Button>
          )}
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={producerData?.producers || []}
        rowKey="id"
        pagination={false}
        locale={{
          emptyText: "Chưa có nhà sản xuất nào",
        }}
      />

      <div className="mt-4">
        <PaginationDefault
          current={producerData?.pagination?.currentPage || 1}
          total={producerData?.pagination?.total || 0}
          pageSize={pageSize}
          onChange={handlePageChange}
          showSizeChanger={false}
          pageSizeOptions={[5, 10, 15]}
        />
      </div>

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
