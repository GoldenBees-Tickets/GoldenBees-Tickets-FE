import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  useAddMovieMutation, 
  useGetActorsQuery, 
  useGetDirectorsQuery, 
  useGetGenresQuery, 
  useGetMovieQuery, 
  useUpdateMovieMutation 
} from "@/api/movieApi";
import { Form, Input, Button, Select, DatePicker, InputNumber, Upload, message, Spin } from "antd";
import { FiUpload, FiX } from "react-icons/fi";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Option } = Select;

export default function Movie() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [posterPreview, setPosterPreview] = useState("");
  const [backdropPreview, setBackdropPreview] = useState("");
  const [posterFile, setPosterFile] = useState(null);
  const [backdropFile, setBackdropFile] = useState(null);

  const { data: actorsData, isLoading: actorsLoading } = useGetActorsQuery();
  const { data: directorsData, isLoading: directorsLoading } = useGetDirectorsQuery();
  const { data: genresData, isLoading: genresLoading } = useGetGenresQuery();
  const { data: movieData, isLoading: movieLoading } = useGetMovieQuery(id, { skip: !id });

  const [addMovie, { isLoading: addLoading }] = useAddMovieMutation();
  const [updateMovie, { isLoading: updateLoading }] = useUpdateMovieMutation();

  useEffect(() => {
    if (id && movieData?.movie) {
      const movie = movieData.movie;
      setPosterPreview(movie.poster);
      setBackdropPreview(movie.backdrop);

      form.setFieldsValue({
        title: movie.title,
        description: movie.description,
        duration: movie.duration,
        release_date: movie.release_date ? dayjs(movie.release_date) : null,
        director_id: movie.director_id,
        actors: movie.MovieActors?.map(ma => ma.actor_id) || [],
        genres: movie.MovieGenres?.map(mg => mg.genre_id) || [],
        trailer: movie.trailer,
      });
    }
  }, [id, movieData, form]);

  const handleImageChange = (e, setPreview, setFile) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      
      // Adding text fields
      Object.keys(values).forEach(key => {
        if (key === 'release_date') {
          formData.append(key, values[key] ? dayjs(values[key]).format('YYYY-MM-DD') : '');
        } else if (key === 'actors' || key === 'genres') {
          values[key]?.forEach(item => {
            formData.append(`${key}[]`, item);
          });
        } else if (values[key] !== undefined) {
          formData.append(key, values[key]);
        }
      });

      // Adding files
      if (posterFile) {
        formData.append('poster', posterFile);
      }
      
      if (backdropFile) {
        formData.append('backdrop', backdropFile);
      }

      if (id) {
        await updateMovie({ id, formData }).unwrap();
        message.success("Cập nhật phim thành công!");
      } else {
        await addMovie(formData).unwrap();
        message.success("Thêm phim mới thành công!");
      }
      
      navigate('/admin/movies');
    } catch (error) {
      message.error("Lỗi: " + (error.data?.message || error.message));
    }
  };

  if (id && movieLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spin size="large" />
      </div>
    );
  }

  const isLoading = actorsLoading || directorsLoading || genresLoading;
  const isSaving = addLoading || updateLoading;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {id ? "Chỉnh sửa phim" : "Thêm phim mới"}
        </h1>
        <Button 
          icon={<FiX className="text-xl" />} 
          type="text" 
          onClick={() => navigate('/admin/movies')}
          className="flex items-center justify-center"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Spin size="large" />
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="bg-white p-6 rounded-lg shadow"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Form.Item
                name="title"
                label="Tên phim"
                rules={[{ required: true, message: 'Vui lòng nhập tên phim' }]}
              >
                <Input placeholder="Nhập tên phim" />
              </Form.Item>

              <Form.Item
                name="description"
                label="Mô tả"
                rules={[{ required: true, message: 'Vui lòng nhập mô tả phim' }]}
              >
                <TextArea rows={5} placeholder="Mô tả chi tiết về phim" />
              </Form.Item>

              <Form.Item
                name="duration"
                label="Thời lượng (phút)"
                rules={[{ required: true, message: 'Vui lòng nhập thời lượng phim' }]}
              >
                <InputNumber min={1} placeholder="120" className="w-full" />
              </Form.Item>

              <Form.Item
                name="release_date"
                label="Ngày khởi chiếu"
                rules={[{ required: true, message: 'Vui lòng chọn ngày khởi chiếu' }]}
              >
                <DatePicker format="DD/MM/YYYY" className="w-full" />
              </Form.Item>

              <Form.Item
                name="trailer"
                label="Trailer (YouTube URL)"
              >
                <Input placeholder="https://www.youtube.com/watch?v=..." />
              </Form.Item>
            </div>

            <div>
              <Form.Item
                name="director_id"
                label="Đạo diễn"
                rules={[{ required: true, message: 'Vui lòng chọn đạo diễn' }]}
              >
                <Select placeholder="Chọn đạo diễn">
                  {directorsData?.directors.map(director => (
                    <Option key={director.id} value={director.id}>{director.name}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="actors"
                label="Diễn viên"
                rules={[{ required: true, message: 'Vui lòng chọn ít nhất một diễn viên' }]}
              >
                <Select 
                  mode="multiple" 
                  placeholder="Chọn diễn viên"
                  optionFilterProp="children"
                >
                  {actorsData?.actors.map(actor => (
                    <Option key={actor.id} value={actor.id}>{actor.name}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="genres"
                label="Thể loại"
                rules={[{ required: true, message: 'Vui lòng chọn ít nhất một thể loại' }]}
              >
                <Select 
                  mode="multiple" 
                  placeholder="Chọn thể loại"
                  optionFilterProp="children"
                >
                  {genresData?.genres.map(genre => (
                    <Option key={genre.id} value={genre.id}>{genre.name}</Option>
                  ))}
                </Select>
              </Form.Item>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="mb-2 font-medium">Poster</p>
                  <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-[2/3] mb-2 flex items-center justify-center">
                    {posterPreview ? (
                      <img 
                        src={posterPreview} 
                        alt="Poster preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400 text-center p-4">
                        <FiUpload className="mx-auto text-xl mb-2" />
                        <p>Chọn ảnh poster</p>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, setPosterPreview, setPosterFile)}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0 file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                <div>
                  <p className="mb-2 font-medium">Backdrop</p>
                  <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-video mb-2 flex items-center justify-center">
                    {backdropPreview ? (
                      <img 
                        src={backdropPreview} 
                        alt="Backdrop preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400 text-center p-4">
                        <FiUpload className="mx-auto text-xl mb-2" />
                        <p>Chọn ảnh backdrop</p>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, setBackdropPreview, setBackdropFile)}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0 file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button 
              onClick={() => navigate('/admin/movies')} 
              className="mr-2"
            >
              Hủy
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={isSaving}
              className="bg-blue-500"
            >
              {id ? "Cập nhật" : "Thêm phim"}
            </Button>
          </div>
        </Form>
      )}
    </div>
  );
} 