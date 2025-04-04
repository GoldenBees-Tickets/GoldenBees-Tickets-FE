import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Upload,
  message,
  Typography,
  Space,
  Spin
} from "antd";
import { UploadOutlined, CloseOutlined, SaveOutlined } from "@ant-design/icons";
import { useGetDirectorsQuery, useUpdateDirectorMutation } from "@/api/directorApi";
import dayjs from "dayjs";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const API_BASE_URL = import.meta.env.VITE_SOCKET_URL;

export default function EditDirector() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { data: directorsData, isLoading } = useGetDirectorsQuery();
  const [updateDirector, { isLoading: isUpdating }] = useUpdateDirectorMutation();
  
  const currentDirector = directorsData?.directors?.find(
    (item) => item.id === parseInt(id, 10)
  );

  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (currentDirector) {
      form.setFieldsValue({
        name: currentDirector.name,
        dob: currentDirector.dob ? dayjs(currentDirector.dob) : null,
        bio: currentDirector.bio || "",
        gender: currentDirector.gender || "Male",
      });
      
      if (currentDirector.profile_picture) {
        setPreviewImage(`${API_BASE_URL}/${currentDirector.profile_picture}`);
      }
    }
  }, [currentDirector, form]);

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
      formData.append("dob", values.dob.format("YYYY-MM-DD"));
      formData.append("bio", values.bio || "");
      formData.append("gender", values.gender);
      
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("profile_picture", fileList[0].originFileObj);
      }

      await updateDirector({
        id: parseInt(id, 10),
        formData
      }).unwrap();
      
      message.success("Cập nhật đạo diễn thành công!");
      navigate("/admin/directors");
    } catch (error) {
      console.error("Lỗi khi cập nhật đạo diễn:", error);
      message.error("Cập nhật đạo diễn thất bại!");
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
        <Title level={4}>Chỉnh Sửa Đạo Diễn</Title>
        <Button 
          type="text" 
          icon={<CloseOutlined />} 
          onClick={() => navigate("/admin/directors")}
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
              label="Tên đạo diễn"
              rules={[{ required: true, message: "Vui lòng nhập tên đạo diễn" }]}
            >
              <Input placeholder="Nhập tên đạo diễn" />
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
                      e.target.src = '/placeholder-director.png';
                    }}
                  />
                  <div className="text-xs text-gray-500 mt-1">Ảnh hiện tại</div>
                </div>
              )}
            </Form.Item>
          </div>

          <Form.Item
            name="bio"
            label="Tiểu sử"
          >
            <TextArea rows={4} placeholder="Thông tin tiểu sử của đạo diễn..." />
          </Form.Item>

          <Form.Item className="mb-0 mt-6">
            <Space className="w-full justify-end">
              <Button onClick={() => navigate("/admin/directors")}>
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
