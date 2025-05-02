import { useState, useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import {
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { useUpdateAdminMutation } from "@/api/userApi";

export default function UpdateAdmin({ onClose, adminData }) {
  const [updateAdmin, { isLoading }] = useUpdateAdminMutation();
  const [form] = Form.useForm();
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    // Thiết lập giá trị ban đầu cho form
    if (adminData) {
      form.setFieldsValue({
        username: adminData.username,
        email: adminData.email,
      });
    }
  }, [adminData, form]);

  const onSubmit = async (values) => {
    try {
      // Nếu mật khẩu trống, không gửi lên
      const dataToSubmit = { ...values };
      if (!dataToSubmit.password) {
        delete dataToSubmit.password;
      }

      const response = await updateAdmin({
        id: adminData.id,
        ...dataToSubmit
      }).unwrap();

      message.success("Cập nhật quản trị viên thành công");
      onClose();
    } catch (error) {
      message.error("Có lỗi xảy ra: " + (error.data?.message || error.message));
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 relative mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-medium m-0">Chỉnh sửa quản trị viên</h4>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        requiredMark={false}
      >
        <Form.Item
          name="username"
          label="Tên đăng nhập"
          rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập" }]}
        >
          <Input placeholder="Nhập tên đăng nhập" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Mật khẩu mới (không điền nếu không đổi)"
          rules={[
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
          ]}
        >
          <Input.Password
            placeholder="Nhập mật khẩu mới"
            iconRender={(visible) =>
              visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
            }
            visibilityToggle={{
              visible: passwordVisible,
              onVisibleChange: setPasswordVisible,
            }}
          />
        </Form.Item>

        <Form.Item className="mb-0 mt-4">
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            className="w-full bg-blue-500"
          >
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
} 