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
import { useGetProducerByIdQuery, useUpdateProducerMutation } from "@/api/producerApi";
import { formatImage } from "@/utils/formatImage";

const { Title } = Typography;
const { TextArea } = Input;

export default function EditProducer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { data: producerData, isLoading } = useGetProducerByIdQuery(id);
  const [updateProducer, { isLoading: isUpdating }] = useUpdateProducerMutation();
  
  const currentProducer = producerData?.producer;

  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (currentProducer) {
      form.setFieldsValue({
        name: currentProducer.name,
        description: currentProducer.description || "",
      });
      
      if (currentProducer.profile_picture) {
        setPreviewImage(formatImage(currentProducer.profile_picture));
      }
    }
  }, [currentProducer, form]);

  const handleFileChange = (info) => {
    const { fileList: newFileList } = info;
    setFileList(newFileList);
    
    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      const file = newFileList[0].originFileObj;
      
      // Lưu file để gửi lên server
      setSelectedFile(file);
      
      // Tạo preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
    }
  };

  const handleSubmit = async (values) => {
    try {      
      const formData = new FormData();
      formData.append("name", values.name);
      
      if (values.description) {
        formData.append("description", values.description);
      }
      
      // Thêm file nếu có
      if (selectedFile) {
        formData.append("profile_picture", selectedFile);
      }

      // Đảm bảo ID là số
      const producerId = parseInt(id, 10);

      const result = await updateProducer({
        id: producerId,
        formData
      }).unwrap();
      
      message.success("Cập nhật nhà sản xuất thành công!");
      navigate("/admin/producers");
    } catch (error) {
      console.error("Lỗi khi cập nhật nhà sản xuất:", error);
      message.error("Cập nhật nhà sản xuất thất bại: " + (error.data?.message || error.message || ""));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full py-20">
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  if (!currentProducer) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-red-500 mb-4">Không tìm thấy thông tin nhà sản xuất!</div>
          <Button type="primary" onClick={() => navigate("/admin/producers")}>
            Quay lại danh sách
          </Button>
        </div>
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
            label="Ảnh đại diện"
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
