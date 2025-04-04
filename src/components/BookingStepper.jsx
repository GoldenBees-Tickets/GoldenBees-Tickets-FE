import { Link } from "react-router-dom";

export default function BookingStepper({ currentStep, showtime_id, room_id }) {
  // Các bước trong quy trình đặt vé
  const steps = [
    { name: "Chọn phim / Rạp / Suất", path: `/detail/${showtime_id?.split('-')[0]}` },
    { name: "Chọn ghế", path: `/booking/${showtime_id}` },
    { name: "Chọn thức ăn", path: `/food-selection/${showtime_id}` },
    { name: "Thanh toán", path: `/payment/${showtime_id}` },
    { name: "Xác nhận", path: `/payment-success` },
  ];

  return (
    <div className="w-full max-w-screen-xl mx-auto mb-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          // Tính trạng thái của bước
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isClickable = index <= currentStep;

          return (
            <div
              key={index}
              className="relative flex-1 text-center"
            >
              {/* Kết nối các bước */}
              {index > 0 && (
                <div
                  className={`absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 ${
                    isCompleted ? "bg-orange-500" : "bg-gray-200"
                  }`}
                  style={{ right: "50%", left: "-50%" }}
                ></div>
              )}

              {/* Số thứ tự bước */}
              <div
                className={`relative mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full ${
                  isActive
                    ? "bg-orange-500 text-white"
                    : isCompleted
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {isCompleted ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>

              {/* Tên bước */}
              {isClickable ? (
                <Link
                  to={step.path}
                  className={`text-sm font-medium ${
                    isActive ? "text-orange-500" : isCompleted ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {step.name}
                </Link>
              ) : (
                <span className="text-sm font-medium text-gray-400">
                  {step.name}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
} 