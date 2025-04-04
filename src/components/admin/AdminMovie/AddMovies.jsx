import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Button,
  Upload,
  message,
  Typography,
  Divider,
  Space
} from "antd";
import { 
  UploadOutlined, 
  PlusOutlined, 
  RollbackOutlined 
} from "@ant-design/icons";
import { useCreateMovieMutation } from "@/api/movieApi";
import { useGetActorsQuery } from "@/api/actorApi";
import { useGetDirectorsQuery } from "@/api/directorApi";
import { useGetProducersQuery } from "@/api/producerApi";
import { useGetGenresQuery } from "@/api/genreApi";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function AddMovies() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState("");
  
  const { data: directorData } = useGetDirectorsQuery();
  const directors = directorData?.directors || [];
  
  const { data: actorData } = useGetActorsQuery();
  const actors = actorData?.actors || [];
  
  const { data: producerData } = useGetProducersQuery();
  const producers = producerData?.producers || [];
  
  const { data: genreData } = useGetGenresQuery();
  const genres = genreData?.genres || [];
  
  const [createMovie, { isLoading }] = useCreateMovieMutation();

  const handlePosterChange = (info) => {
    if (info.file) {
      setPosterFile(info.file.originFileObj);
      
      // Preview image
      const reader = new FileReader();
      reader.onload = () => {
        setPosterPreview(reader.result);
      };
      reader.readAsDataURL(info.file.originFileObj);
    }
  };

  const handleSubmit = async (values) => {
    try {
      // Validate the essential data
      if (!values.director_id) {
        message.error("Vui lòng chọn đạo diễn");
        return;
      }
      
      if (!values.actor_ids || values.actor_ids.length === 0) {
        message.error("Vui lòng chọn ít nhất một diễn viên");
        return;
      }
      
      if (!values.producer_ids || values.producer_ids.length === 0) {
        message.error("Vui lòng chọn ít nhất một nhà sản xuất");
        return;
      }

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("year", values.year);
      formData.append("country", values.country || "");
      formData.append("description", values.description || "");
      formData.append("trailer", values.trailer || "");
      formData.append("age_rating", values.age_rating || 0);
      formData.append("duration", values.duration);
      formData.append("director_id", values.director_id);
      
      // Append multiple actors, producers, and genres
      values.actor_ids.forEach(actorId => {
        formData.append("actor_id", actorId);
      });
      
      values.producer_ids.forEach(producerId => {
        formData.append("producer_id", producerId);
      });
      
      if (values.genre_ids && values.genre_ids.length > 0) {
        values.genre_ids.forEach(genreId => {
          formData.append("genre_id", genreId);
        });
      }
      
      if (posterFile) {
        formData.append("poster", posterFile);
      }

      await createMovie(formData).unwrap();
      message.success("Thêm phim mới thành công!");
      navigate("/admin/movies");
    } catch (error) {
      console.error("Lỗi khi tạo phim:", error);
      message.error("Thêm phim thất bại: " + (error.data?.message || "Đã xảy ra lỗi"));
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Title level={3}>Thêm Phim Mới</Title>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
          initialValues={{
            age_rating: 0
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              name="name"
              label="Tên phim"
              rules={[{ required: true, message: "Vui lòng nhập tên phim" }]}
            >
              <Input placeholder="Nhập tên phim" />
            </Form.Item>

            <Form.Item
              name="year"
              label="Năm sản xuất"
              rules={[
                { required: true, message: "Vui lòng nhập năm sản xuất" },
                {
                  validator: (_, value) => {
                    const currentYear = new Date().getFullYear();
                    if (value && (value < 1900 || value > currentYear)) {
                      return Promise.reject(`Năm sản xuất phải từ 1900 đến ${currentYear}`);
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <InputNumber min={1900} max={new Date().getFullYear()} className="w-full" />
            </Form.Item>

            <Form.Item
              name="country"
              label="Quốc gia"
            >
              <Input placeholder="Nhập quốc gia sản xuất" />
            </Form.Item>

            <Form.Item
              name="duration"
              label="Thời lượng (phút)"
              rules={[
                { required: true, message: "Vui lòng nhập thời lượng phim" },
                { type: 'number', min: 1, max: 240, message: "Thời lượng phải từ 1 đến 240 phút" }
              ]}
            >
              <InputNumber min={1} max={240} className="w-full" />
            </Form.Item>

            <Form.Item
              name="age_rating"
              label="Giới hạn tuổi"
            >
              <InputNumber min={0} className="w-full" />
            </Form.Item>

            <Form.Item
              name="trailer"
              label="Trailer"
            >
              <Input placeholder="Nhập đường dẫn trailer (YouTube)" />
            </Form.Item>

            <Form.Item
              name="poster"
              label="Poster phim"
              valuePropName="fileList"
              getValueFromEvent={e => e && e.fileList}
            >
              <Upload
                listType="picture-card"
                beforeUpload={() => false}
                onChange={handlePosterChange}
                maxCount={1}
                showUploadList={false}
              >
                {posterPreview ? (
                  <div className="relative w-full h-32">
                    <img 
                      src={posterPreview} 
                      alt="Poster" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div>
                    <UploadOutlined />
                    <div className="mt-2">Tải poster</div>
                  </div>
                )}
              </Upload>
              {posterFile && (
                <div className="mt-2 text-sm text-gray-500">
                  File đã chọn: {posterFile.name}
                </div>
              )}
            </Form.Item>
          </div>

          <Form.Item
            name="description"
            label="Mô tả"
            className="col-span-full"
          >
            <TextArea rows={4} placeholder="Nhập mô tả phim" />
          </Form.Item>

          <Divider orientation="left">Diễn viên, Đạo diễn & Thể loại</Divider>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              name="director_id"
              label="Đạo diễn"
              rules={[{ required: true, message: "Vui lòng chọn đạo diễn" }]}
            >
              <Select placeholder="Chọn đạo diễn">
                {directors.map(director => (
                  <Option key={director.id} value={director.id}>{director.name}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="actor_ids"
              label="Diễn viên"
              rules={[{ required: true, message: "Vui lòng chọn ít nhất một diễn viên" }]}
            >
              <Select 
                mode="multiple"
                placeholder="Chọn diễn viên"
                optionFilterProp="children"
              >
                {actors.map(actor => (
                  <Option key={actor.id} value={actor.id}>{actor.name}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="producer_ids"
              label="Nhà sản xuất"
              rules={[{ required: true, message: "Vui lòng chọn ít nhất một nhà sản xuất" }]}
            >
              <Select 
                mode="multiple"
                placeholder="Chọn nhà sản xuất"
                optionFilterProp="children"
              >
                {producers.map(producer => (
                  <Option key={producer.id} value={producer.id}>{producer.name}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="genre_ids"
              label="Thể loại"
            >
              <Select 
                mode="multiple"
                placeholder="Chọn thể loại"
                optionFilterProp="children"
              >
                {genres.map(genre => (
                  <Option key={genre.id} value={genre.id}>{genre.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Form.Item className="mt-6">
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                icon={<PlusOutlined />}
                className="bg-blue-500"
              >
                Thêm phim
              </Button>
              <Button 
                icon={<RollbackOutlined />}
                onClick={() => navigate("/admin/movies")}
              >
                Quay lại
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
