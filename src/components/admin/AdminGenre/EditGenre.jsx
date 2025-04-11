import { Form, Input, Button, message, Typography } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useUpdateGenreMutation } from "@/api/genreApi";
import PropTypes from 'prop-types';

const { Title, Text } = Typography;

export default function EditGenre({ id, name, setToggleUpdateGenre }) {
  const [form] = Form.useForm();
  const [updateGenre, { isLoading }] = useUpdateGenreMutation();

  const handleSubmit = async (values) => {
    try {
      await updateGenre({ id, name: values.name }).unwrap();      
      message.success("Cập nhật thể loại thành công!");
      setToggleUpdateGenre(false);
    } catch (error) {
      message.error("Cập nhật thể loại thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="p-6 relative w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <Title level={4}>Chỉnh Sửa Thể Loại</Title>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ name }}
        requiredMark={false}
      >
        <Form.Item
          name="name"
          label="Tên thể loại"
          rules={[
            { required: true, message: "Vui lòng nhập tên thể loại" },
            { min: 3, message: "Tên thể loại phải có ít nhất 3 ký tự" }
          ]}
        >
          <Input placeholder="Nhập tên thể loại" />
        </Form.Item>

        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={() => setToggleUpdateGenre(false)}>
            Hủy
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={isLoading}
            className="bg-blue-500"
          >
            Cập nhật
          </Button>
        </div>
      </Form>
    </div>
  );
}

EditGenre.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  setToggleUpdateGenre: PropTypes.func.isRequired
};
