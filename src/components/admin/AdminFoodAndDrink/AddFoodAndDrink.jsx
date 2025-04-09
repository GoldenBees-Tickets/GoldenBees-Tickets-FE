import { useState } from "react";
import PropTypes from "prop-types";
import { useAddFoodAndDrinkMutation } from "../../../api/foodAndDrinkApi";
import { toast } from "react-toastify";
import { UploadOutlined } from "@ant-design/icons";
import { Form, Input, Select, Button, Upload, Space, message } from "antd";

const { Option } = Select;

const AddFoodAndDrink = ({ setAddForm }) => {
  const [form] = Form.useForm();
  const [addFoodAndDrink] = useAddFoodAndDrinkMutation();
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("type", values.type);
    formData.append("price", values.price);
    
    if (imageFile) {
      formData.append("profile_picture", imageFile);
    }

    try {
      await addFoodAndDrink(formData).unwrap();
      toast.success("Thêm món thành công!");
      setAddForm(false);
    } catch (error) {
      console.error("Lỗi khi thêm món:", error);
      toast.error("Thêm món thất bại. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (info) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} được tải lên thành công`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} tải lên thất bại.`);
    }
    
    const file = info.file.originFileObj;
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error(`${file.name} không phải là file hình ảnh`);
      }
      return false;
    },
    onChange: handleFileChange,
    showUploadList: false,
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      autoComplete="off"
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
        <div className="flex flex-col space-y-2">
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
          </Upload>
          
          {imagePreview && (
            <div className="mt-3">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-32 h-32 object-cover rounded-lg border border-gray-200"
              />
            </div>
          )}
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

export default AddFoodAndDrink;
