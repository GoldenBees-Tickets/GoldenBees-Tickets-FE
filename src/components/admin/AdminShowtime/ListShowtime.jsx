import { useMemo, useState } from "react";
import PaginationDefault from "../../PaginationDefault";
import ConfirmDelete from "../../ConfirmDelete";
import { useGetShowtimesQuery } from "@/api/showtimeApi";
import { Link } from "react-router-dom";

export default function ListShowtime({branch_id}) {
  const [isShowConfirmDelete, setIsShowConfirmDelete] = useState(false);

  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  const {data: list_showtimes} = useGetShowtimesQuery(branch_id, {
    skip: !branch_id,
  });
    
  const renderListShowtime = useMemo(
    () => 
      list_showtimes?.data?.map((showtime) => (
        <tr key={showtime.id} className="even:bg-blue-50">
          <td className="p-4 text-sm text-black">{showtime.id}</td>
          <td className="p-4 text-sm text-black">{showtime.Movie?.name}</td>
          <td className="p-4 text-sm text-black">{showtime.Room?.Cinema?.name}</td>
          <td className="p-4 text-sm text-black">{showtime.Room?.name}</td>
          <td className="p-4 text-sm text-black">{showtime.start_time}</td>
          <td className="p-4 text-sm text-black">{showtime.end_time}</td>
          <td className="p-4">
            <button className="mr-4" title="Edit">
              <Link to={`${showtime.id}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 fill-blue-500 hover:fill-blue-700"
                  viewBox="0 0 348.882 348.882"
                >
                  <path
                    d="m333.988 11.758-.42-.383A43.363 43.363 0 0 0 304.258 0a43.579 43.579 0 0 0-32.104 14.153L116.803 184.231a14.993 14.993 0 0 0-3.154 5.37l-18.267 54.762c-2.112 6.331-1.052 13.333 2.835 18.729 3.918 5.438 10.23 8.685 16.886 8.685h.001c2.879 0 5.693-.592 8.362-1.76l52.89-23.138a14.985 14.985 0 0 0 5.063-3.626L336.771 73.176c16.166-17.697 14.919-45.247-2.783-61.418zM130.381 234.247l10.719-32.134.904-.99 20.316 18.556-.904.99-31.035 13.578zm184.24-181.304L182.553 197.53l-20.316-18.556L294.305 34.386c2.583-2.828 6.118-4.386 9.954-4.386 3.365 0 6.588 1.252 9.082 3.53l.419.383c5.484 5.009 5.87 13.546.861 19.03z"
                    data-original="#000000"
                  />
                  <path
                    d="M303.85 138.388c-8.284 0-15 6.716-15 15v127.347c0 21.034-17.113 38.147-38.147 38.147H68.904c-21.035 0-38.147-17.113-38.147-38.147V100.413c0-21.034 17.113-38.147 38.147-38.147h131.587c8.284 0 15-6.716 15-15s-6.716-15-15-15H68.904C31.327 32.266.757 62.837.757 100.413v180.321c0 37.576 30.571 68.147 68.147 68.147h181.798c37.576 0 68.147-30.571 68.147-68.147V153.388c.001-8.284-6.715-15-14.999-15z"
                    data-original="#000000"
                  />
                </svg>
              </Link>
            </button>
          </td>
        </tr>
      ))
    , [list_showtimes]);

  const handlePageChange = (page, size = pageSize) => {
    setCurrentPage(page);
    setPageSize(size);
  };


  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-800 whitespace-nowrap">
          <tr>
            <th className="p-4 text-left text-sm font-medium text-white">ID</th>
            <th className="p-4 text-left text-sm font-medium text-white">
              Tên phim
            </th>
            <th className="p-4 text-left text-sm font-medium text-white">
              Rạp chiếu
            </th>
            <th className="p-4 text-left text-sm font-medium text-white">
              Phòng chiếu
            </th>
            <th className="p-4 text-left text-sm font-medium text-white">
              Giờ chiếu
            </th>
            <th className="p-4 text-left text-sm font-medium text-white">
              Giờ kết thúc
            </th>
            <th className="p-4 text-left text-sm font-medium text-white">
              Thêm
            </th>
          </tr>
        </thead>
        <tbody className="whitespace-nowrap">
          {!!renderListShowtime?.length ? (
            renderListShowtime
          ) : (
            <tr>
              <td
                colSpan="100%"
                className="text-center py-3 bg-gray-100 text-gray-500"
              >
                No data
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <PaginationDefault
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
      {isShowConfirmDelete && (
        <ConfirmDelete
          id={id_delete}
          setIsShowConfirmDelete={setIsShowConfirmDelete}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
