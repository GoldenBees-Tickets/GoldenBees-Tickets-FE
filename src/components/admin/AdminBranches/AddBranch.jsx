import { Select, Input, Form, Button, Typography, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import citiesData from "@/public/vietnamAddress.json";
import { useCreateBranchMutation } from "@/api/branchApi";
import { toast } from "react-toastify";

const { Option } = Select;
const { Title } = Typography;

export default function AddBranch({handleAddModalClose}) {
  const [form] = Form.useForm();
  const [Add, { isLoading }] = useCreateBranchMutation();

  const onFinish = async (values) => {    
    try {
      const branchData = {
        name: values.name,
        city: values.city,
      };
      
      await Add(branchData).unwrap();
      toast.success("Thêm chi nhánh thành công!");
      form.resetFields();
      handleAddModalClose(); 
    } catch (error) {
      console.error("Thêm chi nhánh thất bại:", error);
      toast.error("Thêm chi nhánh thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Title level={4}>Thêm Chi Nhánh Mới</Title>
      </div>

      <div>
        <Form
          form={form}
          name="addBranch"
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
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={isLoading}
                icon={<PlusOutlined />}
                className="bg-blue-500"
              >
                Thêm chi nhánh
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

