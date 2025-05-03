import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useUpdateFoodAndDrinkMutation } from "../../../api/foodAndDrinkApi";
import { toast } from "react-toastify";
import { FiUpload, FiX, FiRefreshCw } from "react-icons/fi";
import { Form, Input, Select, Button, Space, message } from "antd";
import { formatImage } from "@/utils/formatImage";

const { Option } = Select;

const EditFoodAndDrink = ({ setEditForm, editItem }) => {
  const [form] = Form.useForm();
  const [updateFoodAndDrink] = useUpdateFoodAndDrinkMutation();
  const [imagePreview, setImagePreview] = useState(
    editItem?.profile_picture ? formatImage(editItem.profile_picture) : null
  );
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDefaultImage, setIsDefaultImage] = useState(true); // Để theo dõi ảnh mặc định hay ảnh mới

  useEffect(() => {
    // Thiết lập giá trị ban đầu cho form
    form.setFieldsValue({
      name: editItem?.name,
      type: editItem?.type,
      price: editItem?.price
    });
  }, [form, editItem]);

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      // Tạo FormData object
      const formData = new FormData();
      formData.append("name", values.name || "");
      formData.append("type", values.type || "");
      formData.append("price", values.price || "0");
      
      if (imageFile) {
        formData.append("profile_picture", imageFile);
      } else if (!isDefaultImage && !imagePreview) {
        // Gửi null khi người dùng đã xóa ảnh
        formData.append("profile_picture", "null");
      }

      // Gọi API với FormData
      const response = await updateFoodAndDrink({ 
        id: editItem.id, 
        data: formData 
      }).unwrap();
      
      toast.success("Cập nhật món thành công!");
      setEditForm(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật món:", error);
      toast.error(`Cập nhật món thất bại: ${error.data?.message || "Vui lòng thử lại"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xử lý việc chọn file
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      setImageFile(file);
      setIsDefaultImage(false);
      
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
      // Nếu là hình được tạo bằng URL.createObjectURL, hủy URL để tránh rò rỉ bộ nhớ
      if (imageFile) {
        URL.revokeObjectURL(imagePreview);
      }
      
      // Reset về trạng thái không có ảnh
      setImageFile(null);
      setImagePreview(null);
      setIsDefaultImage(false); // Đánh dấu là đã xóa ảnh gốc
    }
  };

  // Khôi phục lại ảnh gốc
  const handleRestoreOriginalImage = () => {
    if (editItem?.profile_picture) {
      setImagePreview(formatImage(editItem.profile_picture));
      setImageFile(null);
      setIsDefaultImage(true);
      message.success("Đã khôi phục ảnh gốc");
    }
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
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/100?text=No+Image';
                  }}
                />
                <button
                  type="button"
                  onClick={handleClosePreview}
                  className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full transform translate-x-1/2 -translate-y-1/2 hover:bg-red-600"
                  title="Xóa ảnh"
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
            
            {(!imagePreview && editItem?.profile_picture && !isDefaultImage) && (
              <div className="mt-2">
                <Button 
                  type="dashed" 
                  size="small" 
                  icon={<FiRefreshCw className="mr-1" />} 
                  onClick={handleRestoreOriginalImage}
                >
                  Khôi phục ảnh gốc
                </Button>
              </div>
            )}
          </div>
        </div>
      </Form.Item>

      <Form.Item className="mb-0">
        <Space className="w-full justify-end">
          <Button onClick={() => setEditForm(false)}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            Cập nhật
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
export default EditFoodAndDrink;
