import ChangeEmail from "./changeEmail";
import ChangePhone from "./ChangePhone";
import ChangePassword from "./changePassword";
import { useState } from "react";

export default function Infor({user}) {
    const [toggleUpdateEmail, setToggleUpdateEmail] = useState(false);
    const [toggleUpdatePhone, setToggleUpdatePhone] = useState(false);
    const [toggleUpdatePassword, setToggleUpdatePassword] = useState(false);
  return (
    <>
      <div className="grid text-gray-500 grid-cols-2 gap-4">
        <div>
          <label className="text-gray-500 text-sm">Họ và tên</label>
          <div className="flex items-center mt-1">
            {user?.username ? (
              <input
                type="text"
                className="w-full border rounded-lg p-2"
                value={user?.username}
                disabled
              />
            ) : (
              <input
                type="text"
                className="w-full border rounded-lg p-2"
                value="User"
                disabled
              />
            )}

            <span className="ml-2 text-gray-400">
              <i className="fas fa-user"></i>
            </span>
          </div>
        </div>

        <div>
          <label className="text-gray-500 text-sm">Số điện thoại</label>
          <div className="relative mt-1">
            {user?.phone ? (
              <input
                type="email"
                className="w-full border rounded-lg p-2 pr-16"
                value={user?.phone}
                disabled
              />
            ) : (
              <input
                type="text"
                className="w-full border rounded-lg p-2"
                value=""
                disabled
              />
            )}
            <button
              onClick={() => setToggleUpdatePhone(true)}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 text-blue-500 text-sm"
            >
              Thay đổi
            </button>
          </div>
        </div>

        <div>
          <label className="text-gray-500 text-sm">Email</label>
          <div className="relative mt-1">
            {user?.username ? (
              <input
                type="email"
                className="w-full border rounded-lg p-2 pr-16"
                value={user?.email}
                disabled
              />
            ) : (
              <input
                type="email"
                className="w-full border rounded-lg p-2 pr-16"
                value="your-email@gmail.com"
                disabled
              />
            )}

            <button
              onClick={() => setToggleUpdateEmail(true)}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 text-blue-500 text-sm"
            >
              Thay đổi
            </button>
          </div>
        </div>

        <div>
          <label className="text-gray-500 text-sm">Mật khẩu</label>
          <div className="relative mt-1">
            <input
              type="password"
              className="w-full border rounded-lg p-2 pr-16"
              value="********"
              disabled
            />
            <button
              onClick={() => setToggleUpdatePassword(true)}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 text-blue-500 text-sm"
            >
              Thay đổi
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 text-right">
        <button className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600">
          Cập nhật
        </button>
      </div>

      {toggleUpdateEmail && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <ChangeEmail
            userid={user?.id}
            setToggleUpdateEmail={setToggleUpdateEmail}
          />
        </div>
      )}
      {toggleUpdatePhone && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <ChangePhone
            userid={user?.id}
            setToggleUpdatePhone={setToggleUpdatePhone}
          />
        </div>
      )}
      {toggleUpdatePassword && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <ChangePassword
            userid={user?.id}
            setToggleUpdatePassword={setToggleUpdatePassword}
          />
        </div>
      )}
    </>
  );
}
