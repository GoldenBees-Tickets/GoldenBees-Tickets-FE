import { useState, useEffect } from "react";
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
import { useUpdateActorMutation } from "@/api/actorApi";
import PropTypes from "prop-types";
import moment from "moment";
import { formatImage } from "@/utils/formatImage";

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

export default function EditActor({ id, actor, onClose }) {
  const [updateActor, { isLoading: isUpdating }] = useUpdateActorMutation();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (actor) {
      form.setFieldsValue({
        name: actor.name,
        dob: actor.dob ? moment(actor.dob) : null,
        bio: actor.bio,
        gender: actor.gender || "Male",
      });

      if (actor.profile_picture) {
        setFileList([
          {
            uid: "-1",
            name: "profile-picture.jpg",
            status: "done",
            url: formatImage(actor.profile_picture),
          },
        ]);
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

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("profile_picture", fileList[0].originFileObj);
      }

      await updateActor({ id, formData }).unwrap();
      message.success("Cập nhật diễn viên thành công!");
      onClose();
    } catch (error) {
      message.error(
        "Cập nhật diễn viên thất bại: " + (error.data?.message || error.message)
      );
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const handleChange = ({ fileList }) => setFileList(fileList);

  if (!actor) {
    return (
      <div className="flex justify-center items-center p-8">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 relative w-full">
      <Button
        type="text"
        icon={<CloseOutlined />}
        onClick={onClose}
        className="absolute right-2 top-2"
      />

      <div className="text-center mb-6">
        <Title level={4}>Chỉnh Sửa Diễn Viên</Title>
      </div>

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
          name="profile_picture"
          label="Ảnh đại diện"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={handleChange}
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
        </Form.Item>

        <Form.Item name="bio" label="Tiểu sử">
          <TextArea rows={4} placeholder="Nhập tiểu sử diễn viên" />
        </Form.Item>

        <Form.Item className="flex justify-end gap-2 mb-0">
          <Button onClick={onClose}>Hủy</Button>
          <Button type="primary" htmlType="submit" loading={isUpdating}>
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
