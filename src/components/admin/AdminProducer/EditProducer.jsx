import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Upload,
  message,
  Typography,
  Space,
  Spin
} from "antd";
import { UploadOutlined, CloseOutlined, SaveOutlined } from "@ant-design/icons";
import { useGetProducersQuery, useUpdateProducerMutation } from "@/api/producerApi";

const { Title } = Typography;
const { TextArea } = Input;
const API_BASE_URL = import.meta.env.VITE_SOCKET_URL;

export default function EditProducer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { data: producerData, isLoading } = useGetProducersQuery();
  const [updateProducer, { isLoading: isUpdating }] = useUpdateProducerMutation();
  
  const currentProducer = producerData?.producers?.find(
    (item) => item.id === parseInt(id, 10)
  );

  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (currentProducer) {
      form.setFieldsValue({
        name: currentProducer.name,
        description: currentProducer.description || "",
      });
      
      if (currentProducer.profile_picture) {
        setPreviewImage(`${API_BASE_URL}/${currentProducer.profile_picture}`);
      }
    }
  }, [currentProducer, form]);

  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    
    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(newFileList[0].originFileObj);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description || "");
      
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("profile_picture", fileList[0].originFileObj);
      }

      await updateProducer({
        id: parseInt(id, 10),
        formData
      }).unwrap();
      
      message.success("Cập nhật nhà sản xuất thành công!");
      navigate("/admin/producers");
    } catch (error) {
      console.error("Lỗi khi cập nhật nhà sản xuất:", error);
      message.error("Cập nhật nhà sản xuất thất bại!");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full py-20">
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Title level={4}>Chỉnh Sửa Nhà Sản Xuất</Title>
        <Button 
          type="text" 
          icon={<CloseOutlined />} 
          onClick={() => navigate("/admin/producers")}
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <Form.Item
            name="name"
            label="Tên nhà sản xuất"
            rules={[{ required: true, message: "Vui lòng nhập tên nhà sản xuất" }]}
          >
            <Input placeholder="Nhập tên nhà sản xuất" />
          </Form.Item>

          <Form.Item
            name="profile_picture"
            label="Ảnh đại diện"
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
            {previewImage && fileList.length < 1 && (
              <div className="mt-2">
                <img 
                  src={previewImage} 
                  alt="Ảnh hiện tại"
                  className="w-20 h-20 object-cover rounded"
                  onError={(e) => {
                    e.target.src = '/placeholder-producer.png';
                  }}
                />
                <div className="text-xs text-gray-500 mt-1">Ảnh hiện tại</div>
              </div>
            )}
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <TextArea rows={4} placeholder="Thông tin về nhà sản xuất..." />
          </Form.Item>

          <Form.Item className="mb-0 mt-6">
            <Space className="w-full justify-end">
              <Button onClick={() => navigate("/admin/producers")}>
                Hủy
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={isUpdating}
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
