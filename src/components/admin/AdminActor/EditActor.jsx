import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  message,
  Upload,
  Typography,
  Spin,
} from "antd";
import { CloseOutlined, UploadOutlined } from "@ant-design/icons";
import { useUpdateActorMutation, useGetActorByIdQuery } from "@/api/actorApi";
import PropTypes from 'prop-types';
import moment from "moment";
import { formatImage } from "@/utils/formatImage";

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

export default function EditActor({ id: propId, actor: propActor, onClose: propOnClose }) {
  const params = useParams();
  const navigate = useNavigate();
  const [updateActor, { isLoading: isUpdating }] = useUpdateActorMutation();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Xác định xem đang ở chế độ trang hay modal
  const isPageMode = !propOnClose;
  
  const actorId = propId || parseInt(params.id, 10);
  console.log("actorId", actorId);
  
  const { data: fetchedActor, isLoading: isLoadingActor } = useGetActorByIdQuery(
    actorId, 
    { skip: !isPageMode || !!propActor }
  );
  console.log("fetchedActor", fetchedActor);
  
  // Actor data từ prop hoặc từ API
  const actor = fetchedActor?.actor || {};
  
  // Hàm đóng modal hoặc quay lại trang danh sách
  const handleClose = () => {
    if (propOnClose) {
      propOnClose();
    } else {
      navigate("/admin/actors");
    }
  };

  useEffect(() => {
    if (actor) {
      form.setFieldsValue({
        name: actor.name,
        dob: actor.dob ? moment(actor.dob) : null,
        bio: actor.bio,
        gender: actor.gender || "Male",
      });

      if (actor.profile_picture) {
        setPreviewImage(formatImage(actor.profile_picture));
      }
    }
  }, [actor, form]);

  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("gender", values.gender);

      if (values.dob) {
        formData.append("dob", values.dob.format("YYYY-MM-DD"));
      }

      if (values.bio) {
        formData.append("bio", values.bio);
      }

      if (selectedFile) {
        formData.append("profile_picture", selectedFile);
      }

      // Debug FormData
      console.log("FormData keys:");
      for (let key of formData.keys()) {
        console.log("Key:", key);
      }
      
      console.log("FormData entries:");
      for (let entry of formData.entries()) {
        if (entry[0] === 'profile_picture') {
          console.log("File:", entry[1].name, "Type:", entry[1].type, "Size:", entry[1].size);
        } else {
          console.log(entry[0], ":", entry[1]);
        }
      }

      await updateActor({ id: actorId, formData }).unwrap();
      message.success("Cập nhật diễn viên thành công!");
      handleClose();
    } catch (error) {
      message.error(
        "Cập nhật diễn viên thất bại: " + (error.data?.message || error.message)
      );
    }
  };

  const handleFileChange = (info) => {
    const { fileList: newFileList } = info;
    setFileList(newFileList);
    
    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      // Lưu file đã chọn
      setSelectedFile(newFileList[0].originFileObj);
      
      // Tạo preview cho file
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(newFileList[0].originFileObj);
    } else {
      setSelectedFile(null);
    }
  };

  if (isLoadingActor || (!actor && !isPageMode)) {
    return (
      <div className="flex justify-center items-center p-8">
        <Spin size="large" />
      </div>
    );
  }

  if (!actor && isPageMode) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-red-500 mb-4">Không tìm thấy thông tin diễn viên!</div>
          <Button type="primary" onClick={() => navigate("/admin/actors")}>
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  // UI cho cả trang và modal
  const content = (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      requiredMark={false}
    >
      <Form.Item
        name="name"
        label="Tên diễn viên"
        rules={[
          { required: true, message: "Vui lòng nhập tên diễn viên" },
          { min: 2, message: "Tên diễn viên phải có ít nhất 2 ký tự" },
        ]}
      >
        <Input placeholder="Nhập tên diễn viên" />
      </Form.Item>

      <Form.Item
        name="dob"
        label="Ngày sinh"
        rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
      >
        <DatePicker
          format="DD/MM/YYYY"
          placeholder="Chọn ngày sinh"
          style={{ width: "100%" }}
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
        </Select>
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
              <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
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
                e.target.src = '/placeholder-actor.png';
              }}
            />
            <div className="text-xs text-gray-500 mt-1">Ảnh hiện tại</div>
          </div>
        )}
      </Form.Item>

      <Form.Item name="bio" label="Tiểu sử">
        <TextArea rows={4} placeholder="Nhập tiểu sử diễn viên" />
      </Form.Item>

      <Form.Item className="flex justify-end gap-2 mb-0">
        <Button onClick={handleClose}>Hủy</Button>
        <Button type="primary" htmlType="submit" loading={isUpdating}>
          Cập nhật
        </Button>
      </Form.Item>
    </Form>
  );

  // Render dựa theo chế độ
  if (isPageMode) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Title level={4}>Chỉnh Sửa Diễn Viên</Title>
          <Button 
            type="text" 
            icon={<CloseOutlined />} 
            onClick={handleClose}
          />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          {content}
        </div>
      </div>
    );
  }
  
  // Chế độ modal
  return (
    <div className="bg-white rounded-lg p-6 relative w-full">
      <Button
        type="text"
        icon={<CloseOutlined />}
        onClick={handleClose}
        className="absolute right-2 top-2"
      />

      <div className="text-center mb-6">
        <Title level={4}>Chỉnh Sửa Diễn Viên</Title>
      </div>

      {content}
    </div>
  );
}

EditActor.propTypes = {
  id: PropTypes.number,
  actor: PropTypes.object,
  onClose: PropTypes.func
};
