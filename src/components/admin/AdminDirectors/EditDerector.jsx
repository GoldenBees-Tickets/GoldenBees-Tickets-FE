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
  Spin,
} from "antd";
import { UploadOutlined, CloseOutlined, SaveOutlined } from "@ant-design/icons";
import { useGetDirectorByIdQuery, useUpdateDirectorMutation } from "@/api/directorApi";
import dayjs from "dayjs";
import { formatImage } from "../../../utils/formatImage";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function EditDirector() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { data: directorData, isLoading } = useGetDirectorByIdQuery(id);
  const [updateDirector, { isLoading: isUpdating }] = useUpdateDirectorMutation();    
  const currentDirector = directorData?.director;

  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (currentDirector) {
      form.setFieldsValue({
        name: currentDirector.name,
        dob: currentDirector.dob ? dayjs(currentDirector.dob) : null,
        bio: currentDirector.bio || "",
        gender: currentDirector.gender || "Male",
      });
      
      if (currentDirector.profile_picture) {
        setPreviewImage(formatImage(currentDirector.profile_picture));
      }
    }
  }, [currentDirector, form]);

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
      
      if (values.dob) {
        const dobString = values.dob.format("YYYY-MM-DD");
        formData.append("dob", dobString);
      }
      
      if (values.bio) {
        formData.append("bio", values.bio);
      }
      
      formData.append("gender", values.gender || "Male");
      
      // Thêm file nếu có
      if (selectedFile) {
        formData.append("profile_picture", selectedFile);
      }

      // Đảm bảo ID là số
      const directorId = parseInt(id, 10);
      
      const result = await updateDirector({
        id: directorId,
        formData: formData
      }).unwrap();
      
      message.success("Cập nhật đạo diễn thành công!");
      navigate("/admin/directors");
    } catch (error) {
      console.error("Update error details:", error);
      message.error("Cập nhật đạo diễn thất bại! " + (error.data?.message || error.message || ""));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full py-20">
        <Spin size="large" />
      </div>
    );
  }

  if (!currentDirector) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-red-500 mb-4">Không tìm thấy thông tin đạo diễn!</div>
          <Button type="primary" onClick={() => navigate("/admin/directors")}>
            Quay lại danh sách
          </Button>
        </div>
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

            <div className="space-y-4">
              <div className="font-medium text-gray-700">Ảnh đại diện</div>
              
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

              {/* Hiển thị ảnh hiện tại nếu không có file mới được chọn */}
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
            </div>
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
