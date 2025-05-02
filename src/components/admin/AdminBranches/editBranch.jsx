import { useEffect } from "react";
import { Form, Input, Select, Button, Typography, Space } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import citiesData from "@/public/vietnamAddress.json";
import {
  useUpdateBranchMutation,
} from "@/api/branchApi";

const { Option } = Select;
const { Title } = Typography;

export default function EditBranch({branch, handleAddModalClose}) {  
  const [form] = Form.useForm();
  const [update, { isLoading }] = useUpdateBranchMutation();

  useEffect(() => {
    if (branch) {
      form.setFieldsValue({
        name: branch.name,
        city: branch.city
      });
    }
  }, [branch, form]);

  const onFinish = async (values) => {
    try {
      await update({
        id: branch.id,
        name: values.name,
        city: values.city
      }).unwrap();
      
      toast.success("Cập nhật chi nhánh thành công!");
      form.resetFields();
      handleAddModalClose();
    } catch (error) {
      console.error("Error updating branch:", error);
      toast.error("Cập nhật chi nhánh thất bại. Vui lòng thử lại!");
    }
  };

  return (
    <div className="mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Title level={4}>Chỉnh Sửa Chi Nhánh</Title>
      </div>

      <div>
        <Form
          form={form}
          name="editBranch"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <div>
            <Form.Item
              name="name"
              label="Tên chi nhánh"
              rules={[{ required: true, message: 'Tên chi nhánh là bắt buộc' }]}
            >
              <Input placeholder="Nhập tên chi nhánh" />
            </Form.Item>

            <Form.Item
              name="city"
              label="Thành phố"
              rules={[{ required: true, message: 'Thành phố là bắt buộc' }]}
            >
              <Select
                showSearch
                placeholder="Chọn thành phố"
                optionFilterProp="children"
                filterOption={(input, option) => 
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                allowClear
              >
                {citiesData.map(city => (
                  <Option key={city.Id} value={city.Name}>
                    {city.Name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Form.Item className="mb-0 mt-6">
            <Space className="w-full justify-end">
              <Button onClick={() => navigate("/admin/branches")}>
                Hủy
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={isLoading}
                icon={<SaveOutlined />}
                className="bg-blue-500"
              >
                Cập nhật
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
