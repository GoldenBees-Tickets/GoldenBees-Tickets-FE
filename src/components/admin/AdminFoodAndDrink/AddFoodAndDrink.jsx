import { useState } from "react";
import PropTypes from "prop-types";
import { useAddFoodAndDrinkMutation } from "../../../api/foodAndDrinkApi";
import { toast } from "react-toastify";
import { Form, Input, Select, Button, Space, message } from "antd";
import { FiUpload, FiX } from "react-icons/fi";

const { Option } = Select;

const AddFoodAndDrink = ({ setAddForm }) => {
  const [form] = Form.useForm();
  const [addFoodAndDrink] = useAddFoodAndDrinkMutation();
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      console.log("Form values:", values);
      
      // Tạo FormData object
      const formData = new FormData();
      formData.append("name", values.name || "");
      formData.append("type", values.type || "");
      formData.append("price", values.price || "0");
      
      if (imageFile) {
        formData.append("profile_picture", imageFile);
        console.log("Adding image to form data:", imageFile.name);
      }
      
      // Log FormData để kiểm tra
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${key === 'profile_picture' ? 'File Object' : value}`);
      }

      // Gọi API với FormData
      const response = await addFoodAndDrink(formData).unwrap();
      console.log("API Response:", response);
      toast.success("Thêm món thành công!");
      setAddForm(false);
    } catch (error) {
      console.error("Lỗi khi thêm món:", error);
      toast.error(`Thêm món thất bại: ${error.data?.message || "Vui lòng thử lại"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xử lý việc chọn file
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log("File selected:", file);
    
    if (file) {
      setImageFile(file);
      
      // Tạo URL để preview ảnh
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
      
      // Thông báo thành công
      message.success(`Tải lên ${file.name} thành công`);
    }
  };
  
  // Xử lý việc xóa hình preview
  const handleClosePreview = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setImageFile(null);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      autoComplete="off"
      encType="multipart/form-data"
    >
      <Form.Item
        label="Tên món"
        name="name"
        rules={[{ required: true, message: 'Vui lòng nhập tên món!' }]}
      >
        <Input placeholder="Nhập tên món..." />
      </Form.Item>

      <Form.Item
        label="Loại"
        name="type"
        rules={[{ required: true, message: 'Vui lòng chọn loại món!' }]}
      >
        <Select placeholder="Chọn loại">
          <Option value="food">Đồ ăn</Option>
          <Option value="drink">Đồ uống</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Giá (VNĐ)"
        name="price"
        rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
      >
        <Input type="number" min={0} placeholder="Nhập giá..." />
      </Form.Item>

      <Form.Item label="Hình ảnh">
        <div className="mt-1 flex justify-center px-3 py-3 border-2 border-gray-200 border-dashed rounded-lg hover:border-gray-300 transition-colors duration-200">
          <div className="space-y-2 text-center">
            {imagePreview ? (
              <div className="relative w-24 h-24 mx-auto">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleClosePreview}
                  className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full transform translate-x-1/2 -translate-y-1/2 hover:bg-red-600"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <>
                <FiUpload className="mx-auto h-8 w-8 text-gray-400" />
                <div className="flex justify-center text-sm text-gray-600">
                  <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                    <span>Tải ảnh lên</span>
                    <input
                      type="file"
                      className="sr-only"
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                  </label>
                  <p className="pl-1">hoặc kéo thả</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF tối đa 10MB</p>
              </>
            )}
          </div>
        </div>
      </Form.Item>

      <Form.Item className="mb-0">
        <Space className="w-full justify-end">
          <Button onClick={() => setAddForm(false)}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            Thêm món
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

AddFoodAndDrink.propTypes = {
  setAddForm: PropTypes.func.isRequired,
};

export default AddFoodAndDrink;
