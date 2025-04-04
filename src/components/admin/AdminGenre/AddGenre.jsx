import { useState } from "react";
import { Form, Input, Button, message, Typography } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useCreateGenreMutation } from "@/api/genreApi";
import PropTypes from 'prop-types';

const { Title, Text } = Typography;

export default function AddGenre({ setAddGenre }) {
  const [form] = Form.useForm();
  const [createGenre, { isLoading }] = useCreateGenreMutation();

  const handleSubmit = async (values) => {
    try {
      const response = await createGenre({ name: values.name }).unwrap();
      if (response?.data) {
        message.success("Thêm thể loại thành công!");
        setAddGenre(false);
        form.resetFields();
      }
    } catch (error) {
      message.error("Thêm thể loại thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 relative w-full max-w-md mx-auto">
      <Button
        type="text"
        icon={<CloseOutlined />}
        onClick={() => setAddGenre(false)}
        className="absolute right-2 top-2"
      />

      <div className="text-center mb-6">
        <Title level={4}>Thêm Thể Loại</Title>
        <Text type="secondary">Nhập thông tin thể loại mới</Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
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
          <Button onClick={() => setAddGenre(false)}>
            Hủy
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={isLoading}
            className="bg-blue-500"
          >
            Thêm
          </Button>
        </div>
      </Form>
    </div>
  );
}

AddGenre.propTypes = {
  setAddGenre: PropTypes.func.isRequired
};
