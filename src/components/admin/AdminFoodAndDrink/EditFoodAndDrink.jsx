import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useUpdateFoodAndDrinkMutation } from "../../../api/foodAndDrinkApi";
import { toast } from "react-toastify";
import { UploadOutlined } from "@ant-design/icons";
import { Form, Input, Select, Button, Upload, Space, message } from "antd";
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

  useEffect(() => {
    // Thiết lập giá trị ban đầu cho form
    form.setFieldsValue({
      name: editItem?.name,
      type: editItem?.type,
      price: editItem?.price
    });
  }, [form, editItem]);

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
      await updateFoodAndDrink({ id: editItem.id, data: formData }).unwrap();
      toast.success("Cập nhật món thành công!");
      setEditForm(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật món:", error);
      toast.error("Cập nhật món thất bại. Vui lòng thử lại.");
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
            <Button icon={<UploadOutlined />}>Tải lên hình ảnh mới</Button>
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
