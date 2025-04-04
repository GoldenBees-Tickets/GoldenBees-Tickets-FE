import { useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useUpdateUserMutation } from "@/api/userApi";
import { toast } from "react-toastify";

export default function ChangeImage({ setToggleUpdateImage, userid }) {
  const [updateImage] = useUpdateUserMutation();

  const [showPassword, setShowPassword] = useState(false);
  const [errorPassword, setErrorPassword] = useState("");

  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleUpdateImage = async (e) => {
    e.preventDefault();

    setErrorPassword("");

    const response = await updateImage({id: userid, image, password});    
    if (response.data.user.status === 200) {
      toast.success("Cập nhật ảnh thành công");
      setToggleUpdateImage(false);
    } else {
      setErrorPassword("Sai mật khẩu");
    }
  };
  return (
    <form action="" onSubmit={handleUpdateImage}>
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <div className="flex relative justify-center items-center mb-4">
          <h2 className="text-lg font-semibold">Thay đổi ảnh</h2>
          <IoMdCloseCircleOutline
            className="absolute right-0 text-gray-400 cursor-pointer hover:text-gray-800 transition duration-200"
            size={24}
            onClick={() => setToggleUpdateImage(false)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cập nhật ảnh
          </label>
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-orange-100"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mật khẩu
          </label>
          <div className="relative flex items-center">
            <input
              type={showPassword ? "text" : "password"}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-orange-100"
            />
            {showPassword ? (
              <FaEye
                onClick={() => setShowPassword(false)}
                className="w-[16px] text-gray-400 absolute right-2 cursor-pointer"
              />
            ) : (
              <FaEyeSlash
                onClick={() => setShowPassword(true)}
                className="w-[16px] text-gray-400 absolute right-2 cursor-pointer"
              />
            )}
          </div>
          <small className="text-red-500">{errorPassword}</small>
        </div>
        <button
          type="submit"
          className="w-full bg-orange-500 text-white rounded-lg py-2 hover:bg-orange-600 transition duration-200"
        >
          Cập nhật
        </button>
      </div>
    </form>
  );
}
