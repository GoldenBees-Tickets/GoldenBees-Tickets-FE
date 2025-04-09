import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { useGetActorsQuery } from "@/api/actorApi";
import { useGetDirectorsQuery } from "@/api/directorApi";
import { useGetProducersQuery } from "@/api/producerApi";
import { useGetGenresQuery } from "@/api/genreApi";
import dayjs from 'dayjs';
import { formatImage } from "@/utils/formatImage";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

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

  const { data: actorsData } = useGetActorsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: false,
    refetchOnFocus: false
  });
  const actors = actorsData?.actors || [];  

  const { data: directorsData } = useGetDirectorsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: false,
    refetchOnFocus: false
  });
  const directors = directorsData?.directors || [];

  const { data: producersData } = useGetProducersQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: false,
    refetchOnFocus: false
  });
  const producers = producersData?.producers || [];

  const { data: genresData } = useGetGenresQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: false,
    refetchOnFocus: false
  });
  const genres = genresData?.genres || [];

  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState("");
  const [posterFileName, setPosterFileName] = useState("");
  const [formInitialized, setFormInitialized] = useState(false);

  const { actorIds, producerIds, genreIds } = useMemo(() => {
    if (!movie) return { actorIds: [], producerIds: [], genreIds: [] };
    
    let extractedActorIds = [];
    if (Array.isArray(movie.MovieActors) && movie.MovieActors.length > 0) {
      extractedActorIds = movie.MovieActors.map(ma => {
        if (ma.Actor && ma.Actor.id) return ma.Actor.id;
        if (ma.actor_id) return ma.actor_id;
        if (typeof ma === 'object' && ma !== null) {
          for (const key of Object.keys(ma)) {
            if (key.toLowerCase().includes('actor') || key.toLowerCase().includes('diễn viên')) {
              if (typeof ma[key] === 'number') return ma[key];
              if (typeof ma[key] === 'object' && ma[key]?.id) return ma[key].id;
            }
          }
        }
        return null;
      }).filter(id => id !== null);
    } else if (Array.isArray(movie.Actors) && movie.Actors.length > 0) {
      extractedActorIds = movie.Actors.map(actor => actor.id);
    }
    
    let extractedProducerIds = [];
    if (Array.isArray(movie.MovieProducers) && movie.MovieProducers.length > 0) {
      extractedProducerIds = movie.MovieProducers.map(mp => {
        if (mp.Producer && mp.Producer.id) return mp.Producer.id;
        if (mp.producer_id) return mp.producer_id;
        if (typeof mp === 'object' && mp !== null) {
          for (const key of Object.keys(mp)) {
            if (key.toLowerCase().includes('producer') || key.toLowerCase().includes('sản xuất')) {
              if (typeof mp[key] === 'number') return mp[key];
              if (typeof mp[key] === 'object' && mp[key]?.id) return mp[key].id;
            }
          }
        }
        return null;
      }).filter(id => id !== null);
    } else if (Array.isArray(movie.Producers) && movie.Producers.length > 0) {
      extractedProducerIds = movie.Producers.map(producer => producer.id);
    }
    
    let extractedGenreIds = [];
    if (Array.isArray(movie.MovieGenres) && movie.MovieGenres.length > 0) {
      extractedGenreIds = movie.MovieGenres.map(mg => {
        if (mg.Genre && mg.Genre.id) return mg.Genre.id;
        if (mg.genre_id) return mg.genre_id;
        if (typeof mg === 'object' && mg !== null) {
          for (const key of Object.keys(mg)) {
            if (key.toLowerCase().includes('genre') || key.toLowerCase().includes('thể loại')) {
              if (typeof mp[key] === 'number') return mp[key];
              if (typeof mp[key] === 'object' && mp[key]?.id) return mp[key].id;
            }
          }
        }
        return null;
      }).filter(id => id !== null);
    } else if (Array.isArray(movie.Genres) && movie.Genres.length > 0) {
      extractedGenreIds = movie.Genres.map(genre => genre.id);
    }
    
    if (movie.actor_ids && typeof movie.actor_ids === 'string') {
      try {
        const parsedIds = JSON.parse(movie.actor_ids);
        if (Array.isArray(parsedIds) && parsedIds.length > 0) {
          extractedActorIds = parsedIds;
        }
      } catch (e) {
        console.error("Failed to parse actor_ids string:", e);
      }
    }
    
    if (movie.producer_ids && typeof movie.producer_ids === 'string') {
      try {
        const parsedIds = JSON.parse(movie.producer_ids);
        if (Array.isArray(parsedIds) && parsedIds.length > 0) {
          extractedProducerIds = parsedIds;
        }
      } catch (e) {
        console.error("Failed to parse producer_ids string:", e);
      }
    }
    
    if (movie.genre_ids && typeof movie.genre_ids === 'string') {
      try {
        const parsedIds = JSON.parse(movie.genre_ids);
        if (Array.isArray(parsedIds) && parsedIds.length > 0) {
          extractedGenreIds = parsedIds;
        }
      } catch (e) {
        console.error("Failed to parse genre_ids string:", e);
      }
    }
    
    return { 
      actorIds: extractedActorIds, 
      producerIds: extractedProducerIds, 
      genreIds: extractedGenreIds 
    };
  }, [movie]);

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
        year: movie.year,
        country: movie.country,
        description: movie.description,
        trailer: movie.trailer,
        age_rating: movie.age_rating || 0,
        duration: movie.duration,
        director_id: movie.Director?.id || movie.director_id || null,
        actor_ids: actorIds.length > 0 ? actorIds : undefined,
        producer_ids: producerIds.length > 0 ? producerIds : undefined,
        genre_ids: genreIds.length > 0 ? genreIds : undefined,
        release_date: movie.release_date ? dayjs(movie.release_date) : null,
      };
      
      form.setFieldsValue(formValues);
      setFormInitialized(true);
    }
  }, [movie, form, actorIds, producerIds, genreIds, formInitialized]);

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
      formData.append("year", values.year || "");
      formData.append("country", values.country || "");
      formData.append("description", values.description || "");
      formData.append("trailer", values.trailer || "");
      formData.append("age_rating", values.age_rating || 0);
      formData.append("duration", values.duration);
      formData.append("director_id", values.director_id || "");
      
      if (values.release_date) {
        formData.append("release_date", values.release_date.format('YYYY-MM-DD'));
      }
      
      if (values.actor_ids && values.actor_ids.length > 0) {
        values.actor_ids.forEach(actorId => {
          formData.append("actor_id", actorId);
        });
      }
      
      if (values.producer_ids && values.producer_ids.length > 0) {
        values.producer_ids.forEach(producerId => {
          formData.append("producer_id", producerId);
        });
      }
      
      if (values.genre_ids && values.genre_ids.length > 0) {
        values.genre_ids.forEach(genreId => {
          formData.append("genre_id", genreId);
        });
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
              tooltip="Năm sản xuất không được phép chỉnh sửa"
            >
              <InputNumber min={1900} max={new Date().getFullYear()} className="w-full" disabled />
            </Form.Item>

            <Form.Item
              name="release_date"
              label="Ngày khởi chiếu"
              rules={[{ required: true, message: "Vui lòng chọn ngày khởi chiếu" }]}
            >
              <DatePicker 
                className="w-full" 
                format="DD/MM/YYYY"
                placeholder="Chọn ngày khởi chiếu"
              />
            </Form.Item>

            <Form.Item
              name="country"
              label="Quốc gia"
              tooltip="Quốc gia không được phép chỉnh sửa"
            >
              <Input placeholder="Nhập quốc gia sản xuất" disabled />
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
              tooltip="Giới hạn tuổi không được phép chỉnh sửa"
            >
              <InputNumber min={0} className="w-full" disabled />
            </Form.Item>

            <Form.Item
              name="trailer"
              label="Trailer"
              tooltip="Trailer không được phép chỉnh sửa"
            >
              <Input placeholder="Nhập đường dẫn trailer (YouTube)" disabled />
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
              tooltip="Đạo diễn không được phép chỉnh sửa"
            >
              <Select placeholder="Chọn đạo diễn" disabled>
                {directors.map(director => (
                  <Option key={director.id} value={director.id}>{director.name}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="actor_ids"
              label="Diễn viên"
              tooltip="Diễn viên không được phép chỉnh sửa"
            >
              <Select 
                mode="multiple" 
                placeholder="Chọn diễn viên"
                optionFilterProp="children"
                disabled
              >
                {actors.map(actor => (
                  <Option key={actor.id} value={actor.id}>{actor.name}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="producer_ids"
              label="Nhà sản xuất"
              tooltip="Nhà sản xuất không được phép chỉnh sửa"
            >
              <Select 
                mode="multiple" 
                placeholder="Chọn nhà sản xuất"
                optionFilterProp="children"
                disabled
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
