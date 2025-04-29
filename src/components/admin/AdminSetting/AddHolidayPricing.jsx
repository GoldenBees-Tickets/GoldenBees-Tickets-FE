import ImportantItem from "@/components/icon/ImportantItem";
import ErrorMessage from "@/components/ErrorMessage";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCreatePriceSettingMutation, useGetPriceSettingsQuery } from "@/api/priceSettingApi";
import { toast } from "react-toastify";
import { useMemo } from "react";

export default function AddHolidayPricing() {
  const [searchParams] = useSearchParams();
  const branch_id = searchParams.get("branch_id");

  const navigate = useNavigate();
  const [addPriceSetting] = useCreatePriceSettingMutation();
  const { data: priceSettings } = useGetPriceSettingsQuery(branch_id, {
    skip: !branch_id,
  });

  const currentSettings = useMemo(() => priceSettings?.data || {}, [priceSettings]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      holiday_ticket_price: currentSettings?.holiday_ticket_price || 0
    }
  });

  const [holidays, setHolidays] = useState(currentSettings?.holidays || []);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedName, setSelectedName] = useState("");

  const addHoliday = () => {
    if (selectedDate && selectedName) {
      setHolidays([...holidays, { holiday_date: selectedDate, holiday_name: selectedName }]);
      setSelectedDate("");
      setSelectedName("");
    }
  };

  const removeHoliday = (index) => {
    const newHolidays = [...holidays];
    newHolidays.splice(index, 1);
    setHolidays(newHolidays);
  };

  const onSubmit = async (data) => {
    // Giữ lại giá vé thường và cuối tuần từ cài đặt hiện tại
    const dataSubmit = { 
      branch_id,
      base_ticket_price: currentSettings?.base_ticket_price || 0,
      weekend_ticket_price: currentSettings?.weekend_ticket_price || 0,
      holiday_ticket_price: data.holiday_ticket_price,
      holidays: holidays 
    };
    
    const response = await addPriceSetting(dataSubmit);
    if(response?.data?.status == 200) {
      toast.success(response?.data?.message || "Cập nhật giá ngày lễ thành công");
      navigate("/admin/setting");
    } else {
      toast.error(response?.data?.message || "Lỗi không xác định");
      navigate("/admin/setting");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg py-4 px-6 w-full">
      <h2 className="text-3xl font-bold text-center mb-6">Cài đặt giá vé ngày lễ</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6 mt-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giá vé ngày lễ <ImportantItem />
            </label>
            <input
              type="number"
              placeholder="Nhập giá ngày lễ"
              {...register("holiday_ticket_price", {
                required: "Giá ngày lễ bắt buộc",
              })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            />
            {errors.holiday_ticket_price && (
              <ErrorMessage message={errors.holiday_ticket_price.message} />
            )}
          </div>

          {/* Thêm ngày lễ */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chọn ngày lễ áp dụng <ImportantItem />
            </label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                value={selectedName}
                placeholder="Tên ngày lễ"
                onChange={(e) => setSelectedName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={addHoliday}
                className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 rounded-lg"
              >
                Thêm
              </button>
            </div>
          </div>

          {holidays.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Danh sách ngày lễ đã chọn:
              </label>
              <ul className="border border-gray-300 rounded-lg p-3">
                {holidays.map((holiday, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center border-b py-2"
                  >
                    <span>
                      {holiday.holiday_date} - <strong>{holiday.holiday_name}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => removeHoliday(index)}
                      className="text-red-500 hover:text-red-700 text-xl"
                    >
                      <IoMdCloseCircleOutline />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <button 
            type="button" 
            onClick={() => navigate("/admin/setting")}
            className="bg-gray-400 hover:bg-gray-500 text-white rounded-lg py-2 px-4 transition duration-200"
          >
            Hủy
          </button>
          
          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-800 text-white rounded-lg py-2 px-6 transition duration-200"
          >
            Cập nhật
          </button>
        </div>
      </form>
    </div>
  );
} 