import { useState } from "react";
import { Form, Input, Button, message, Typography, Space, Select } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined, CloseOutlined } from "@ant-design/icons";
import { useAddUserMutation } from "@/api/userApi";

const { Title } = Typography;
const { Option } = Select;

export default function AddUser({ closeModal }) {
  const [form] = Form.useForm();
  const [addUser, { isLoading }] = useAddUserMutation();

  const onFinish = async (values) => {
    try {
      const response = await addUser(values).unwrap();
      message.success("Thêm người dùng thành công!");
      form.resetFields();
      closeModal();
    } catch (error) {
      console.error("Lỗi khi thêm người dùng:", error);
      message.error("Thêm người dùng thất bại: " + (error.data?.message || error.message));
    }
  };

  return (
    <div className="p-6 relative">
      <Button 
        type="text"
        icon={<CloseOutlined />}
        onClick={closeModal}
        className="absolute right-4 top-4"
      />
      
      <Title level={3} className="mb-6 text-center">Thêm người dùng mới</Title>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ role: "user" }}
      >
        <Form.Item
          name="username"
          label="Tên người dùng"
          rules={[{ required: true, message: "Vui lòng nhập tên người dùng" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Nhập tên người dùng" />
        </Form.Item>
        
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" }
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Nhập email" />
        </Form.Item>
        
        <Form.Item
          name="phone"
          label="Số điện thoại"
        >
          <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
        </Form.Item>
        
        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" }
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu" />
        </Form.Item>
        
        <Form.Item
          name="role"
          label="Vai trò"
          rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
        >
          <Select placeholder="Chọn vai trò">
            <Option value="user">Người dùng</Option>
            <Option value="admin">Quản trị viên</Option>
          </Select>
        </Form.Item>
        
        <Form.Item className="mb-0">
          <Space className="w-full justify-end">
            <Button onClick={closeModal}>
              Hủy
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={isLoading}
              className="bg-blue-500"
            >
              Thêm người dùng
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
} 