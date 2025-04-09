
import { useGetProducersQuery } from "../../api/producerApi"; // Hook lấy danh sách nhà sản xuất
import ListProducer from "@/components/admin/AdminProducer/ListProducer"; // Component hiển thị danh sách nhà sản xuất

export default function Producers() {
  // Gọi API để lấy danh sách nhà sản xuất
  const { data: listProducers } = useGetProducersQuery();
  const producers = listProducers?.producers || []; // Nếu không có dữ liệu, gán mảng rỗng

  return (
    <div className="p-1">
      {/* Nút Thêm Nhà Sản Xuất */}
      
      

      {/* Danh sách nhà sản xuất */}
      <div className="p-4">
        <ListProducer producers={producers} /> {/* Truyền danh sách nhà sản xuất vào component */}
      </div>
    </div>
  );
}
