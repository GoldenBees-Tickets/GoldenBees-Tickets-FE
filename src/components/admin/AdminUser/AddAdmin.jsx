import { useState, useMemo } from "react";
import { Form, Input, Select, Button, message, Typography } from "antd";
import { EyeOutlined, EyeInvisibleOutlined, CloseOutlined } from "@ant-design/icons";
import { useGetBranchesQuery } from "@/api/branchApi";
import { useCreateUserByAdminMutation } from "@/api/userApi";

const { Title } = Typography;
const { Option } = Select;

export default function AddAdmin({ setIsFormCreate }) {
  const { data: branchesData, isLoading: loadingBranches } = useGetBranchesQuery();
  const [addBranchAdmin, { isLoading }] = useCreateUserByAdminMutation();
  const [form] = Form.useForm();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const branches = useMemo(() => branchesData?.branches || [], [branchesData]);

  const onSubmit = async (values) => {
    try {
      const response = await addBranchAdmin(values).unwrap();
      
      if (response.status === 401) {
        message.error(response.message || "Email đã tồn tại");
        return;
      }
      
      if (response.status === 200) {
        message.success(response.message || "Tạo quản trị viên thành công");
        setIsFormCreate(false);
      }
    } catch (error) {
      message.error("Có lỗi xảy ra: " + (error.data?.message || error.message));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 relative w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <Title level={4} className="m-0">Thêm quản trị viên</Title>
        <Button 
          type="text" 
          icon={<CloseOutlined />} 
          onClick={() => setIsFormCreate(false)}
          className="absolute right-2 top-2"
        />
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        requiredMark={false}
      >
        <Form.Item
          name="branch_id"
          label="Chi nhánh"
          rules={[
            { required: true, message: "Vui lòng chọn chi nhánh" }
          ]}
        >
          <Select 
            placeholder="Chọn chi nhánh"
            loading={loadingBranches}
          >
            {branches.map(branch => (
              <Option key={branch.id} value={branch.id}>
                {branch.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="username"
          label="Tên đăng nhập"
          rules={[
            { required: true, message: "Vui lòng nhập tên đăng nhập" }
          ]}
        >
          <Input placeholder="Nhập tên đăng nhập" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" }
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" }
          ]}
        >
          <Input.Password 
            placeholder="Nhập mật khẩu" 
            iconRender={visible => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
            visibilityToggle={{ 
              visible: passwordVisible, 
              onVisibleChange: setPasswordVisible 
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
            Tạo quản trị viên
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
