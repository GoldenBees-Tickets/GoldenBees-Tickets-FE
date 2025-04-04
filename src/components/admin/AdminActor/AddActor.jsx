import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Upload,
  message,
  Typography,
  Space
} from "antd";
import { UploadOutlined, CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { useCreateActorMutation } from "@/api/actorApi";
import dayjs from "dayjs";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function AddActor() {
  const [form] = Form.useForm();
  const [createActor, { isLoading }] = useCreateActorMutation();
  const navigate = useNavigate();
  
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState("");

  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("dob", values.dob.format("YYYY-MM-DD"));
      formData.append("bio", values.bio || "");
      formData.append("gender", values.gender);
      
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("profile_picture", fileList[0].originFileObj);
      }

      await createActor(formData).unwrap();
      message.success("Thêm diễn viên thành công!");
      navigate("/admin/actors");
    } catch (error) {
      console.error("Lỗi khi thêm diễn viên:", error);
      message.error("Thêm diễn viên thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Title level={4}>Thêm Diễn Viên Mới</Title>
        <Button 
          type="text" 
          icon={<CloseOutlined />} 
          onClick={() => navigate("/admin/actors")}
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="name"
              label="Tên diễn viên"
              rules={[{ required: true, message: "Vui lòng nhập tên diễn viên" }]}
            >
              <Input placeholder="Nhập tên diễn viên" />
            </Form.Item>

            <Form.Item
              name="dob"
              label="Ngày sinh"
              rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
            >
              <DatePicker 
                className="w-full" 
                format="DD/MM/YYYY"
                disabledDate={current => current && current > dayjs().endOf('day')}
              />
            </Form.Item>

            <Form.Item
              name="gender"
              label="Giới tính"
              initialValue="Male"
              rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
            >
              <Select placeholder="Chọn giới tính">
                <Option value="Male">Nam</Option>
                <Option value="Female">Nữ</Option>
                <Option value="Other">Khác</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="profile_picture"
              label="Ảnh đại diện"
              rules={[{ required: true, message: "Vui lòng tải lên ảnh đại diện" }]}
              valuePropName="fileList"
              getValueFromEvent={e => e && e.fileList}
            >
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={handleFileChange}
                beforeUpload={() => false}
                maxCount={1}
              >
                {fileList.length < 1 && (
                  <div>
                    <UploadOutlined />
                    <div className="mt-2">Tải ảnh</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </div>

          <Form.Item
            name="bio"
            label="Tiểu sử"
          >
            <TextArea rows={4} placeholder="Thông tin tiểu sử của diễn viên..." />
          </Form.Item>

          <Form.Item className="mb-0 mt-6">
            <Space className="w-full justify-end">
              <Button onClick={() => navigate("/admin/actors")}>
                Hủy
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={isLoading}
                icon={<PlusOutlined />}
                className="bg-blue-500"
              >
                Thêm diễn viên
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
