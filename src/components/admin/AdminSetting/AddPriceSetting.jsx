import ImportantItem from "@/components/icon/ImportantItem";
import ErrorMessage from "@/components/ErrorMessage";
import { useForm } from "react-hook-form";
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

  const onSubmit = async (data) => {
    const dataSubmit = { 
      branch_id,
      base_ticket_price: data.base_ticket_price,
      weekend_ticket_price: data.weekend_ticket_price,
      // Giữ giá ngày lễ hiện tại nếu có
      holiday_ticket_price: data.holiday_ticket_price || 0,
      holidays: []
    };
    
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
      <h2 className="text-3xl font-bold text-center mb-6">Cài đặt giá vé thường</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6 mt-4">
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            />
            {errors.weekend_ticket_price && (
              <ErrorMessage message={errors.weekend_ticket_price.message} />
            )}
          </div>
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
