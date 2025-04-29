import { Link } from "react-router-dom";
import { getUser } from "@/utils/getUser";
import { useMemo } from "react";
import { useGetPriceSettingsQuery } from "@/api/priceSettingApi";

export default function TicketPricing() {
  const { data: user } = getUser();
  const userData = useMemo(() => user?.user || {}, [user]);

  const branch_id = userData?.branch_id || null;

  const { data: PriceSettings } = useGetPriceSettingsQuery(branch_id, {
    skip: !branch_id,
  });

  const renderPriceSetting = useMemo(
    () => (
      <tr className="even:bg-blue-50">
        <td className="p-4 text-sm text-black">1</td>
        <td className="p-4 text-sm text-black">
          {PriceSettings?.data?.base_ticket_price}
        </td>
        <td className="p-4 text-sm text-black">
          {PriceSettings?.data?.weekend_ticket_price}
        </td>
        <td className="p-4 text-sm text-black">
          {PriceSettings?.data?.holiday_ticket_price}
        </td>
        <td className="p-4 flex gap-2">
          <Link
            to={`price?branch_id=${userData.branch_id}`}
            className="bg-blue-700 hover:bg-blue-800 text-white rounded-md px-3 py-1.5 text-xs"
            title="Sửa giá vé thường"
          >
            Giá thường
          </Link>
          <Link
            to={`holiday-price?branch_id=${userData.branch_id}`}
            title="Sửa giá vé ngày lễ"
            className="bg-blue-700 hover:bg-blue-800 text-white rounded-md px-3 py-1.5 text-xs"
          >
            Giá ngày lễ
          </Link>
        </td>
      </tr>
    ),
    [PriceSettings, userData]
  );

  return (
    <div className="flex-1 ml-4 bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Quản lý Giá Vé</h2>
        <div className="flex gap-2">
          {PriceSettings?.data == undefined ? (
            <>
              <Link 
                to={`price?branch_id=${userData.branch_id}`}
                className="py-2 px-4 text-sm font-semibold text-white 
                     bg-blue-700 rounded hover:bg-blue-800 focus:outline-none 
                     focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 
                     shadow-md"
              >
                Cập nhật giá vé thường
              </Link>
              <Link 
                to={`holiday-price?branch_id=${userData.branch_id}`}
                className="py-2 px-4 text-sm font-semibold text-white 
                     bg-blue-700 rounded hover:bg-blue-800 focus:outline-none 
                     focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 
                     shadow-md"
              >
                Cập nhật giá vé ngày lễ
              </Link>
            </>
          ) : (
            <>
              <Link
                to={`price?branch_id=${userData.branch_id}`}
                className="py-2 px-4 text-sm font-semibold text-white 
                         bg-blue-700 rounded hover:bg-blue-800 focus:outline-none 
                         focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 
                         shadow-md"
              >
                Sửa giá vé thường
              </Link>
              <Link
                to={`holiday-price?branch_id=${userData.branch_id}`}
                className="py-2 px-4 text-sm font-semibold text-white 
                         bg-blue-700 rounded hover:bg-blue-800 focus:outline-none 
                         focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 
                         shadow-md"
              >
                Sửa giá vé ngày lễ
              </Link>
            </>
          )}
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Bảng giá vé</h3>
        <table className="min-w-full bg-white">
          <thead className="bg-blue-700 whitespace-nowrap">
            <tr>
              <th className="p-4 text-left text-sm font-medium text-white">ID</th>
              <th className="p-4 text-left text-sm font-medium text-white">
                Giá ngày thường
              </th>
              <th className="p-4 text-left text-sm font-medium text-white">
                Giá cuối tuần
              </th>
              <th className="p-4 text-left text-sm font-medium text-white">
                Giá ngày lễ
              </th>
              <th className="p-4 text-left text-sm font-medium text-white">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="whitespace-nowrap">{PriceSettings?.data && renderPriceSetting}</tbody>
        </table>
      </div>
      
      <div className="mt-8">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Ngày lễ đã cài đặt</h3>
          <Link
            to={`holiday-price?branch_id=${userData.branch_id}`}
            className="py-1.5 px-3 text-xs font-semibold text-white 
                     bg-blue-700 rounded hover:bg-blue-800 focus:outline-none 
                     focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 
                     shadow-md"
          >
            Quản lý ngày lễ
          </Link>
        </div>
        {PriceSettings?.data?.holidays && PriceSettings.data.holidays.length > 0 ? (
          <table className="min-w-full bg-white">
            <thead className="bg-blue-700 whitespace-nowrap">
              <tr>
                <th className="p-4 text-left text-sm font-medium text-white">STT</th>
                <th className="p-4 text-left text-sm font-medium text-white">Ngày lễ</th>
                <th className="p-4 text-left text-sm font-medium text-white">Tên ngày lễ</th>
              </tr>
            </thead>
            <tbody className="whitespace-nowrap">
              {PriceSettings.data.holidays.map((holiday, index) => (
                <tr key={index} className="even:bg-blue-50">
                  <td className="p-4 text-sm text-black">{index + 1}</td>
                  <td className="p-4 text-sm text-black">{holiday.holiday_date}</td>
                  <td className="p-4 text-sm text-black">{holiday.holiday_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center py-6 bg-gray-50 rounded-lg">
            <p className="text-gray-500 italic mb-3">Chưa có ngày lễ nào được cài đặt</p>
            <Link
              to={`holiday-price?branch_id=${userData.branch_id}`}
              className="py-2 px-4 text-sm font-semibold text-white 
                      bg-blue-700 rounded hover:bg-blue-800 focus:outline-none 
                      focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 
                      shadow-md"
            >
              Thêm ngày lễ ngay
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
