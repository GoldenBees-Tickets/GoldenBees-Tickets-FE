import { Pagination, Select } from "antd";
import { useSearchParams } from "react-router-dom";

const PaginationDefault = ({
  totalItems,
  totalPages,
  currentPage,
  pageSizeOptions = [5, 10, 15],
  onPageChange,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handlePageChange = (page, pageSize) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page);
    params.set("pageSize", pageSize);
    setSearchParams(params);
    onPageChange(page, pageSize);
  };

  return (
    <div className="flex justify-between items-center p-4">
      <div className="flex items-center space-x-2">
        <span>Rows per page:</span>
        <Select
          value={searchParams.get("pageSize") || pageSizeOptions[0]}
          onChange={(value) => handlePageChange(1, value)}
          options={pageSizeOptions.map((size) => ({ value: size, label: size }))}
          className="w-[80px]"
        />
      </div>

      <Pagination
        current={currentPage}
        total={totalItems}
        pageSize={parseInt(searchParams.get("pageSize")) || pageSizeOptions[0]}
        showSizeChanger={false}
        onChange={handlePageChange}
        className="custom-pagination"
      />
    </div>
  );
};

export default PaginationDefault;
