import { useState, useEffect } from "react";
import { Form, Input, Button, message, Typography, Space, Spin } from "antd";
import { CloseOutlined, SaveOutlined } from "@ant-design/icons";
import { useUpdateSeatTypesMutation } from "@/api/seatTypeApi";
import PropTypes from 'prop-types';

const { Title } = Typography;

UpdateSeatType.propTypes = {
  setIsShowFormUpdate: PropTypes.func.isRequired,
  seat_type: PropTypes.shape({
    id: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    price_offset: PropTypes.number.isRequired,
  }).isRequired,
};

export default function UpdateSeatType({ setIsShowFormUpdate, seat_type }) {
  const [form] = Form.useForm();
  const [updateSeatType, { isLoading }] = useUpdateSeatTypesMutation();
  const [color, setColor] = useState(seat_type?.color || "#000000");

  useEffect(() => {
    if (seat_type) {
      form.setFieldsValue({
        id: seat_type.id,
        type: seat_type.type,
        color: seat_type.color,
        price_offset: seat_type.price_offset
      });
      setColor(seat_type.color);
    }
  }, [seat_type, form]);

  const onSubmit = async (values) => {
    try {
      const response = await updateSeatType(values).unwrap();      
      message.success(response?.message || "Cập nhật loại ghế thành công!");
      setIsShowFormUpdate(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật loại ghế:", error);
      message.error("Cập nhật loại ghế thất bại!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999] backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg p-6 relative w-full max-w-md mx-auto">
        <div className="flex justify-between items-center mb-4">
          <Title level={4} className="m-0">Chỉnh Sửa Loại Ghế</Title>
          <Button 
            type="text" 
            icon={<CloseOutlined />} 
            onClick={() => setIsShowFormUpdate(false)}
            className="absolute right-2 top-2"
          />
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onSubmit}
          requiredMark={false}
        >
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>

          <Form.Item
            name="type"
            label="Tên loại ghế"
            rules={[
              { required: true, message: "Vui lòng nhập tên loại ghế" }
            ]}
          >
            <Input placeholder="VIP, Regular, etc." />
          </Form.Item>

          <Form.Item
            name="color"
            label="Màu sắc"
            rules={[
              { required: true, message: "Vui lòng chọn màu sắc" }
            ]}
          >
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={color}
                onChange={(e) => {
                  setColor(e.target.value);
                  form.setFieldsValue({ color: e.target.value });
                }}
                className="w-10 h-10 border-0 p-0 cursor-pointer"
              />
              <Input 
                value={color} 
                className="flex-1" 
                readOnly
              />
            </div>
          </Form.Item>

          <Form.Item
            name="price_offset"
            label="Giá thêm"
            rules={[
              { required: true, message: "Vui lòng nhập giá thêm" },
              { 
                type: 'number', 
                min: 0, 
                message: "Giá thêm không được âm"
              }
            ]}
          >
            <Input 
              prefix="₫" 
              type="number" 
              placeholder="20000" 
            />
          </Form.Item>

          <Form.Item className="mb-0 mt-6">
            <Space className="w-full justify-end">
              <Button 
                onClick={() => setIsShowFormUpdate(false)}
              >
                Hủy
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={isLoading}
                icon={<SaveOutlined />}
                className="bg-blue-500"
              >
                Lưu thay đổi
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
