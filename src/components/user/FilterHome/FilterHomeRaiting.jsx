

export default function FilterHomeRaiting() {
  return (
    <div className="w-full h-60 bg-gray-200 rounded-lg overflow-hidden relative group">
      {/* Banner - Hình ảnh */}
      <img
        src="http://localhost:5173/product/mv2.jpg"
        alt="Banner"
        className="w-full h-full object-cover"
      />

      {/* Button "Mua vé" */}
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out">
        <button className="bg-blue-500 text-white px-6 py-2 rounded-lg text-lg font-semibold hover:bg-blue-600">
          Mua vé
        </button>
      </div>
    </div>
  );
}
