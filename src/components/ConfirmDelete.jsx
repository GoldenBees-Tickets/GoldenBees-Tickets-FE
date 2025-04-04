export default function ConfirmDelete({ id, setIsShowConfirmDelete, onDelete }) {
    return (
      <div
        id="deleteModal"
        tabIndex={-1}
        aria-hidden="true"
        className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 w-full h-full"
      >
        <div className="relative p-4 w-full max-w-md bg-white rounded-lg shadow-lg">
          {/* Nút đóng */}
          <button
            onClick={() => setIsShowConfirmDelete(false)}
            type="button"
            className="text-gray-400 absolute top-2.5 right-2.5 hover:text-gray-900"
          >
            ✖
          </button>
  
          {/* Biểu tượng & Nội dung */}
          <div className="text-center p-5">
            <svg
              className="w-12 h-12 mx-auto text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <p className="mb-4 text-gray-600">Are you sure you want to delete this item?</p>
  
            {/* Nút hành động */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsShowConfirmDelete(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                No, Cancel
              </button>
              <button
                onClick={() => onDelete(id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  