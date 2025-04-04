import ImportantItem from "@/components/icon/ImportantItem";
import ErrorMessage from "@/components/ErrorMessage";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCreatePriceSettingMutation } from "@/api/priceSettingApi";
import { toast } from "react-toastify";

export default function AddPriceSetting() {
  const [searchParams] = useSearchParams();
  const branch_id = searchParams.get("branch_id");

  const navigate = useNavigate();
  const [addPriceSetting] = useCreatePriceSettingMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [holidays, setHolidays] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedName, setSelectedName] = useState("");

  const addHoliday = () => {
    if (selectedDate && selectedName) {
      setHolidays([...holidays, { holiday_date: selectedDate, holiday_name: selectedName }]);
      setSelectedDate("");
      setSelectedName("");
    }
  };

  const removeHoliday = (date) => {
    setHolidays(holidays.filter((h) => h.date !== date));
  };

  const onSubmit = async (data) => {
    const dataSubmit = { ...data, branch_id, holidays };
    const response = await addPriceSetting(dataSubmit);
    if(response?.data?.status == 200) {
      toast.success(response?.data?.message || "Cập nhật giá thành công");
      navigate("/admin/setting");
    } else {
      toast.error(response?.data?.message || "Lỗi không xác định");
      navigate("/admin/setting");
    }
    
  };

  return (
    <div className="bg-white rounded-lg shadow-lg py-4 px-6 w-full">
      <h2 className="text-3xl font-bold text-center">Cài đặt giá vé</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Giá vé ngày thường <ImportantItem />
          </label>
          <input
            type="number"
            placeholder="Nhập giá ngày thường"
            {...register("base_ticket_price", {
              required: "Giá vé thường bắt buộc",
            })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
          />
          {errors.base_ticket_price && (
            <ErrorMessage message={errors.base_ticket_price.message} />
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Giá vé cuối tuần <ImportantItem />
          </label>
          <input
            type="number"
            placeholder="Nhập giá cuối tuần"
            {...register("weekend_ticket_price", {
              required: "Giá cuối tuần bắt buộc",
            })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
          />
          {errors.weekend_ticket_price && (
            <ErrorMessage message={errors.weekend_ticket_price.message} />
          )}
        </div>

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
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
            />
            <input
              type="text"
              value={selectedName}
              placeholder="Tên ngày lễ"
              onChange={(e) => setSelectedName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none"
            />
            <button
              type="button"
              onClick={addHoliday}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg"
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
                    onClick={() => removeHoliday(holiday.date)}
                    className="text-red-500 hover:text-red-700 text-xl"
                  >
                    <IoMdCloseCircleOutline />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-gray-800 hover:bg-gray-900 text-white rounded-lg py-2 transition duration-200"
        >
          Cập nhật
        </button>
      </form>
    </div>
  );
}
