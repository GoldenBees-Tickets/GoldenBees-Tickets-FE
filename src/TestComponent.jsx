import { useState } from 'react';

export default function TestComponent() {
  const [selectedFile, setSelectedFile] = useState(null);
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
    }
  };
  
  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Test Component</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">File Upload Test</h2>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
            accept="image/*"
          />
          <label
            htmlFor="file-upload"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-blue-600 transition"
          >
            Chọn file
          </label>
          
          {selectedFile && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-700">Tên file: <span className="font-medium">{selectedFile.name}</span></p>
              <p className="text-sm text-gray-700">Kích thước: <span className="font-medium">{(selectedFile.size / 1024).toFixed(2)} KB</span></p>
              <p className="text-sm text-gray-700">Loại: <span className="font-medium">{selectedFile.type}</span></p>
            </div>
          )}
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Role Based Rendering Test</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="border p-4 rounded-lg bg-gray-50">
            <h3 className="font-medium mb-2">Admin View</h3>
            <div className="space-y-2">
              <div className="p-2 bg-green-100 rounded">Dashboard</div>
              <div className="p-2 bg-green-100 rounded">User Management</div>
              <div className="p-2 bg-green-100 rounded">Branch Management</div>
              <div className="p-2 bg-green-100 rounded">Seat Types</div>
              <div className="p-2 bg-green-100 rounded">Movies</div>
            </div>
          </div>
          
          <div className="border p-4 rounded-lg bg-gray-50">
            <h3 className="font-medium mb-2">Branch Admin View</h3>
            <div className="space-y-2">
              <div className="p-2 bg-green-100 rounded">Dashboard</div>
              <div className="p-2 bg-red-100 rounded line-through">User Management</div>
              <div className="p-2 bg-red-100 rounded line-through">Branch Management</div>
              <div className="p-2 bg-red-100 rounded line-through">Seat Types</div>
              <div className="p-2 bg-green-100 rounded">Movies</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 