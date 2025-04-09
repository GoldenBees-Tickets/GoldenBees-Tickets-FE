import { IoGiftSharp } from "react-icons/io5";
import { BiSolidMedal } from "react-icons/bi";
import { useUpdateUserMutation } from "@/api/userApi";
import { toast } from "react-toastify";
import { formatImage } from "@/utils/formatImage";

export default function LeftAccount({ user }) {  
  
  const [changeImage] = useUpdateUserMutation();
  const spendingMilestones = [
    { label: "0 đ", value: 0 },
    { label: "2,000,000 đ", value: 2000000 },
    { label: "4,000,000 đ", value: 4000000 },
  ];

  const handleUpload = async (e) => {
    const image = e.target.files[0];
    const response = await changeImage({ id: user.id, image });    
    if (response?.data.user.status === 200) {
      toast.success("Cập nhật ảnh thành công");
    } else {
      toast.error(response?.data.error || "Sai mật khẩu");
    }
  };

  const currentSpending = 0;
  const maxSpending = spendingMilestones[spendingMilestones.length - 1].value;

  return (
    <div className="w-full md:w-80 bg-white shadow-lg rounded-xl p-6 border border-gray-200">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-gray-300 shadow-sm">
          {user?.image ? (
            <img
              className="w-full h-full object-cover"
              src={formatImage(user?.image)}
              alt="User avatar"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
              Ảnh
            </div>
          )}
        </div>

        <div className="relative mt-4 w-fit mx-auto">
          <label
            htmlFor="upload"
            className="cursor-pointer inline-flex items-center gap-3 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg before:border-gray-400/60 hover:before:border-gray-300 group before:bg-gray-100 before:absolute before:inset-0 before:rounded-lg before:border before:border-dashed before:transition-transform before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95"
          >
            <img
              className="w-6 relative"
              src="https://www.svgrepo.com/show/485545/upload-cicle.svg"
              alt="Upload icon"
            />
            <span className="font-medium text-sm relative group-hover:text-blue-900">
              Tải ảnh lên
            </span>
          </label>
          <input hidden type="file" id="upload" onChange={handleUpload} />
        </div>

        <h2 className="flex items-center justify-center mt-4 text-lg font-semibold text-gray-900">
          <BiSolidMedal className="text-orange-500 w-6 h-6" />
          <span className="ml-2">{user?.username || "User"}</span>
        </h2>
        <div className="flex items-center justify-center mt-1 text-gray-800 text-sm">
          <IoGiftSharp className="text-orange-500 w-4 h-4" />
          <span className="ml-2">{user?.star} stars</span>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-gray-800 font-medium mb-2">Tổng chi tiêu 2025</h3>
        <div className="relative w-full h-4 bg-gray-200 rounded-md overflow-hidden">
          <div
            className="absolute top-0 left-0 h-4 bg-blue-500 rounded-md"
            style={{ width: `${(currentSpending / maxSpending) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-500">
          {spendingMilestones.map((milestone) => (
            <span key={milestone.value}>{milestone.label}</span>
          ))}
        </div>
      </div>

      <div className="mt-6 border-t pt-4 text-center">
        <p className="text-sm text-gray-600">
          HOTLINE hỗ trợ: <span className="font-medium">19002224</span> (9:00 -
          22:00)
        </p>
      </div>
    </div>
  );
}
