import { useState, useEffect, useMemo } from "react";
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
import { 
  UploadOutlined, 
  SaveOutlined, 
  RollbackOutlined 
} from "@ant-design/icons";
import {
  useGetMovieByIdQuery,
  useUpdateMovieMutation,
} from "@/api/movieApi";
import { formatImage } from "@/utils/formatImage";

const { Title } = Typography;
const { TextArea } = Input;

export default function EditMovies() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { data: movieData, error, isLoading } = useGetMovieByIdQuery(id, {
    skip: !id,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: false,
    refetchOnFocus: false
  });
  const movie = movieData?.movie;
  const [updateMovie, { isLoading: isUpdating }] = useUpdateMovieMutation();

  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState("");
  const [posterFileName, setPosterFileName] = useState("");
  const [formInitialized, setFormInitialized] = useState(false);

  useEffect(() => {
    if (movie?.poster && !posterPreview) {
      const posterUrl = formatImage(movie.poster);
      setPosterPreview(posterUrl);
      
      const posterPathParts = movie.poster.split('/');
      setPosterFileName(posterPathParts[posterPathParts.length - 1]);
    }
  }, [movie, posterPreview]);

  useEffect(() => {
    if (movie && !formInitialized) {
      const formValues = {
        name: movie.name,
        description: movie.description,
        trailer: movie.trailer,
      };
      
      form.setFieldsValue(formValues);
      setFormInitialized(true);
    }
  }, [movie, form, formInitialized]);

  const handlePosterChange = (info) => {    
    if (info && info.file) {
      const fileObj = info.file.originFileObj || info.file;
      
      setPosterFile(fileObj);
      setPosterFileName(fileObj.name);
      
      const reader = new FileReader();
      reader.onload = () => {
        setPosterPreview(reader.result);
      };
      reader.readAsDataURL(fileObj);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description || "");
      formData.append("trailer", values.trailer || "");
      
      // Thêm các trường bắt buộc khác từ dữ liệu phim hiện tại
      if (movie) {
        formData.append("year", movie.year || "");
        formData.append("country", movie.country || "");
        formData.append("age_rating", movie.age_rating || 0);
        formData.append("duration", movie.duration);
        formData.append("director_id", movie.Director?.id || movie.director_id || "");
        
        if (movie.release_date) {
          formData.append("release_date", movie.release_date);
        }
        
        // Thêm actor_ids, producer_ids, genre_ids nếu có
        if (movie.MovieActors) {
          movie.MovieActors.forEach(ma => {
            if (ma.Actor?.id) formData.append("actor_id", ma.Actor.id);
            else if (ma.actor_id) formData.append("actor_id", ma.actor_id);
          });
        }
        
        if (movie.MovieProducers) {
          movie.MovieProducers.forEach(mp => {
            if (mp.Producer?.id) formData.append("producer_id", mp.Producer.id);
            else if (mp.producer_id) formData.append("producer_id", mp.producer_id);
          });
        }
        
        if (movie.MovieGenres) {
          movie.MovieGenres.forEach(mg => {
            if (mg.Genre?.id) formData.append("genre_id", mg.Genre.id);
            else if (mg.genre_id) formData.append("genre_id", mg.genre_id);
          });
        }
      }
      
      if (posterFile) {
        formData.append("poster", posterFile);
      }

      await updateMovie({
        id,
        movieData: formData
      }).unwrap();
      
      message.success("Cập nhật phim thành công!");
      navigate("/admin/movies");
    } catch (error) {
      console.error("Lỗi khi cập nhật phim:", error);
      message.error("Cập nhật phim thất bại: " + (error.data?.message || "Đã xảy ra lỗi"));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full py-20">
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-red-500 bg-red-50 p-4 rounded-lg">
          Lỗi khi tải dữ liệu: {error.message || "Không thể tải thông tin phim"}
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-amber-500 bg-amber-50 p-4 rounded-lg">
          Không tìm thấy phim
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Title level={3}>Chỉnh Sửa Phim</Title>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <div className="grid grid-cols-1 gap-6">
            <Form.Item
              name="name"
              label="Tên phim"
              rules={[{ required: true, message: "Vui lòng nhập tên phim" }]}
            >
              <Input placeholder="Nhập tên phim" />
            </Form.Item>

            <Form.Item
              name="trailer"
              label="Trailer"
            >
              <Input placeholder="Nhập đường dẫn trailer (YouTube)" />
            </Form.Item>

            <Form.Item
              label="Poster phim"
            >
              <div>
                <Upload
                  listType="picture-card"
                  beforeUpload={() => false}
                  onChange={handlePosterChange}
                  maxCount={1}
                  showUploadList={false}
                  accept="image/*"
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
                {posterFileName && (
                  <div className="mt-2 text-sm text-gray-500 font-semibold">
                    File đã chọn: {posterFileName}
                  </div>
                )}
              </div>
            </Form.Item>

            <Form.Item
              name="description"
              label="Mô tả"
            >
              <TextArea rows={4} placeholder="Nhập mô tả phim" />
            </Form.Item>
          </div>

          <Form.Item className="mb-0 mt-6">
            <Space className="w-full justify-end">
              <Button 
                icon={<RollbackOutlined />}
                onClick={() => navigate("/admin/movies")}
              >
                Quay lại
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
