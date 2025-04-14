import ChangeEmail from "./ChangeEmail";
import ChangePhone from "./ChangePhone";
import ChangePassword from "./ChangePassword";
import { useState } from "react";

export default function Infor({user}) {
    const [toggleUpdateEmail, setToggleUpdateEmail] = useState(false);
    const [toggleUpdatePhone, setToggleUpdatePhone] = useState(false);
    const [toggleUpdatePassword, setToggleUpdatePassword] = useState(false);
  return (
    <>
      <div className="grid text-gray-500 grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="text-gray-500 text-xs sm:text-sm">Họ và tên</label>
          <div className="flex items-center mt-1">
            {user?.username ? (
              <input
                type="text"
                className="w-full border rounded-lg p-1.5 sm:p-2 text-sm sm:text-base"
                value={user?.username}
                disabled
              />
            ) : (
              <input
                type="text"
                className="w-full border rounded-lg p-1.5 sm:p-2 text-sm sm:text-base"
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
          <label className="text-gray-500 text-xs sm:text-sm">Số điện thoại</label>
          <div className="relative mt-1">
            {user?.phone ? (
              <input
                type="email"
                className="w-full border rounded-lg p-1.5 sm:p-2 pr-16 text-sm sm:text-base"
                value={user?.phone}
                disabled
              />
            ) : (
              <input
                type="text"
                className="w-full border rounded-lg p-1.5 sm:p-2 pr-16 text-sm sm:text-base"
                value=""
                disabled
              />
            )}
            <button
              onClick={() => setToggleUpdatePhone(true)}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 text-blue-500 text-xs sm:text-sm"
            >
              Thay đổi
            </button>
          </div>
        </div>

        <div>
          <label className="text-gray-500 text-xs sm:text-sm">Email</label>
          <div className="relative mt-1">
            {user?.username ? (
              <input
                type="email"
                className="w-full border rounded-lg p-1.5 sm:p-2 pr-16 text-sm sm:text-base"
                value={user?.email}
                disabled
              />
            ) : (
              <input
                type="email"
                className="w-full border rounded-lg p-1.5 sm:p-2 pr-16 text-sm sm:text-base"
                value="your-email@gmail.com"
                disabled
              />
            )}

            <button
              onClick={() => setToggleUpdateEmail(true)}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 text-blue-500 text-xs sm:text-sm"
            >
              Thay đổi
            </button>
          </div>
        </div>

        <div>
          <label className="text-gray-500 text-xs sm:text-sm">Mật khẩu</label>
          <div className="relative mt-1">
            <input
              type="password"
              className="w-full border rounded-lg p-1.5 sm:p-2 pr-16 text-sm sm:text-base"
              value="********"
              disabled
            />
            <button
              onClick={() => setToggleUpdatePassword(true)}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 text-blue-500 text-xs sm:text-sm"
            >
              Thay đổi
            </button>
          </div>
        </div>
      </div>

      {toggleUpdateEmail && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center z-50 p-4">
          <div className="max-w-[90vw] w-full md:max-w-md mx-auto">
            <ChangeEmail
              userid={user?.id}
              setToggleUpdateEmail={setToggleUpdateEmail}
            />
          </div>
        </div>
      )}
      {toggleUpdatePhone && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center z-50 p-4">
          <div className="max-w-[90vw] w-full md:max-w-md mx-auto">
            <ChangePhone
              userid={user?.id}
              setToggleUpdatePhone={setToggleUpdatePhone}
            />
          </div>
        </div>
      )}
      {toggleUpdatePassword && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center z-50 p-4">
          <div className="max-w-[90vw] w-full md:max-w-md mx-auto">
            <ChangePassword
              userid={user?.id}
              setToggleUpdatePassword={setToggleUpdatePassword}
            />
          </div>
        </div>
      )}
    </>
  );
}
