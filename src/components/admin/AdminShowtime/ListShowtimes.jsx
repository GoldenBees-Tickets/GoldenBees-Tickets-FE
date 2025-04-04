import { useState, useMemo, useEffect } from "react";
import { useGetShowtimesQuery } from "@/api/showtimeApi";
import { Table, Button, Modal, Spin, Tag, message } from "antd";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import PaginationDefault from "@/components/PaginationDefault";
import dayjs from "dayjs";

export default function ListShowtimes({ branch_id }) {
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const { data: showtimesData, isLoading, error } = useGetShowtimesQuery(branch_id, {
    skip: !branch_id
  });

  const showtimes = useMemo(() => 
    showtimesData?.showtimes || showtimesData?.data || [], 
    [showtimesData]
  );

  useEffect(() => {
    if (showtimesData?.data?.totalItems) {
      setTotalItems(showtimesData.data.totalItems);
      setTotalPages(showtimesData.data.totalPages);
    } else {
      setTotalItems(showtimes.length);
      setTotalPages(Math.ceil(showtimes.length / pageSize));
    }
  }, [showtimesData, showtimes, pageSize]);


  const handlePageChange = (page, newSize) => {
    setCurrentPage(page);
    if (newSize) setPageSize(newSize);
  };

  const columns = [
    {
      title: "Phim",
      dataIndex: ["Movie", "title"],
      key: "movie",
      render: (title, record) => (
        <div className="flex items-center">
          <img 
            src={record.Movie?.poster || "https://placehold.co/100x150"} 
            alt={title || record.Movie?.name}
            className="w-10 h-14 object-cover rounded mr-2"
          />
          <span className="font-medium">{title || record.Movie?.name}</span>
        </div>
      )
    },
    {
      title: "Rạp",
      dataIndex: ["Cinema", "name"],
      key: "cinema",
      render: (name, record) => (
        <div>
          <div>{name || record.Room?.Cinema?.name}</div>
          <div className="text-xs text-gray-500">{record.Room?.name}</div>
        </div>
      )
    },
    {
      title: "Thời gian",
      key: "time",
      render: (_, record) => (
        <div>
          <div>{dayjs(record.show_date).format("DD/MM/YYYY")}</div>
          <div className="text-xs text-gray-500">
            {record.start_time} - {record.end_time}
          </div>
        </div>
      )
    },
    {
      title: "Giá vé",
      dataIndex: "price",
      key: "price",
      render: (price, record) => (
        <span>{(price || record.base_price)?.toLocaleString("vi-VN")} VND</span>
      )
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, record) => {
        const showDate = dayjs(record.show_date);
        const now = dayjs();
        const isPast = showDate.isBefore(now, "day");

        return isPast ? (
          <Tag color="default">Đã chiếu</Tag>
        ) : (
          <Tag color="green">Sắp chiếu</Tag>
        );
      }
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button 
            type="primary" 
            icon={<FiEdit />} 
            size="small"
            className="flex items-center"
          />
        </div>
      )
    }
  ];

  if (isLoading) return <Spin className="flex justify-center mt-10" size="large" />;
  if (error) return <div className="text-red-500">Lỗi khi tải dữ liệu lịch chiếu!</div>;

  // Calculate pagination for client-side pagination if needed
  const paginatedData = showtimesData?.data?.showtimes || 
    showtimes.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div>
      <Table
        columns={columns}
        dataSource={paginatedData}
        rowKey="id"
        pagination={false}
        locale={{
          emptyText: "Chưa có lịch chiếu nào",
        }}
      />

      <PaginationDefault
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

    </div>
  );
} 