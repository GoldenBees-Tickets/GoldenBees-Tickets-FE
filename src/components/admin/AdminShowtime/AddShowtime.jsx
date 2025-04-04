import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  Form, 
  Select, 
  TimePicker, 
  Button, 
  Table, 
  message, 
  Space, 
  Spin,
  Typography,
  InputNumber
} from "antd";
import { FiPlus, FiX, FiTrash2 } from "react-icons/fi";
import { useGetCinemaByBranchIdQuery } from "@/api/cinemaApi";
import { useGetRoomsByCinemaIdQuery } from "@/api/roomApi";
import { useGetMoviesQuery } from "@/api/movieApi";
import { 
  useCreateShowtimeMutation, 
  useLazyGetShowtimeByRoomIdQuery 
} from "@/api/showtimeApi";
import { useGetPriceSettingsQuery } from "@/api/priceSettingApi";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;

// Hàm kiểm tra trùng lịch chiếu
const checkDuplicateShowtime = (showtimes, roomId, start, end) => {
  return showtimes.some(
    (showtime) => 
      Number(showtime.room_id) === Number(roomId) &&
      ((start >= new Date(showtime.start_time).getTime() && 
        start < new Date(showtime.end_time).getTime()) || 
       (end > new Date(showtime.start_time).getTime() && 
        end <= new Date(showtime.end_time).getTime()) ||
       (start <= new Date(showtime.start_time).getTime() && 
        end >= new Date(showtime.end_time).getTime()))
  );
};

export default function AddShowtime() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  const branch_id = searchParams.get("branch_id");
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieDuration, setMovieDuration] = useState(0);
  const [selectedShowtimes, setSelectedShowtimes] = useState([]);
  const [loading, setLoading] = useState(false);

  // API calls
  const { data: priceSettings } = useGetPriceSettingsQuery(branch_id, { skip: !branch_id });
  const { data: cinemasData, isLoading: cinemasLoading } = useGetCinemaByBranchIdQuery(branch_id);
  const { data: moviesData, isLoading: moviesLoading } = useGetMoviesQuery();
  const { data: roomsData, isLoading: roomsLoading } = useGetRoomsByCinemaIdQuery(selectedCinema, { 
    skip: !selectedCinema 
  });
  const [checkShowtime] = useLazyGetShowtimeByRoomIdQuery();
  const [addShowtime, { isLoading: submitting }] = useCreateShowtimeMutation();

  // Dữ liệu đã xử lý
  const cinemas = useMemo(() => cinemasData?.cinemas || [], [cinemasData]);
  const movies = useMemo(() => moviesData?.movies || [], [moviesData]);
  const rooms = useMemo(() => roomsData?.data || [], [roomsData]);
  const basePrice = useMemo(() => priceSettings?.data?.base_ticket_price || 55000, [priceSettings]);

  useEffect(() => {
    if (selectedMovie) {
      const movie = movies.find(m => m.id === Number(selectedMovie));
      if (movie) {
        setMovieDuration(movie.duration || 0);
      }
    }
  }, [selectedMovie, movies]);

  const handleCinemaChange = (value) => {
    setSelectedCinema(value);
    form.setFieldsValue({ room_id: undefined });
  };

  const handleMovieChange = (value) => {
    setSelectedMovie(value);
  };

  const addShowtimeToList = async () => {
    try {
      // Validate form trước khi thêm
      const values = await form.validateFields();
      
      const startTime = dayjs(values.start_time).format('HH:mm');
      const endTime = dayjs(values.end_time).format('HH:mm');
      
      // Kiểm tra xem end_time có phải sau start_time đủ thời lượng phim không
      const startMinutes = dayjs(values.start_time).hour() * 60 + dayjs(values.start_time).minute();
      const endMinutes = dayjs(values.end_time).hour() * 60 + dayjs(values.end_time).minute();
      const duration = endMinutes - startMinutes;
      
      if (duration < movieDuration) {
        message.error(`Thời gian chiếu phải ít nhất ${movieDuration} phút!`);
        return;
      }

      // Kiểm tra trùng lịch
      const start = new Date(`2023-01-01T${startTime}`).getTime();
      const end = new Date(`2023-01-01T${endTime}`).getTime();
      
      const isDuplicate = checkDuplicateShowtime(
        selectedShowtimes,
        values.room_id,
        start,
        end
      );

      if (isDuplicate) {
        message.error("Suất chiếu bị trùng trong cùng phòng! Vui lòng chọn giờ khác.");
        return;
      }

      // Kiểm tra trùng lịch từ server
      const result = await checkShowtime({
        room_id: values.room_id,
        start_time: startTime,
        end_time: endTime,
      });

      if (result?.error?.status === 409) {
        message.error("Suất chiếu bị trùng với lịch hiện có! Vui lòng chọn giờ khác.");
        return;
      }

      // Tìm thông tin phim và phòng
      const movie = movies.find(m => m.id === Number(values.movie_id));
      const room = rooms.find(r => r.id === Number(values.room_id));
      
      // Thêm vào danh sách
      const newShowtimeData = {
        id: Date.now(),
        cinema_id: values.cinema_id,
        movie_id: values.movie_id,
        room_id: values.room_id,
        start_time: startTime,
        end_time: endTime,
        base_price: values.price || basePrice,
        movie_name: movie?.name || "Không xác định",
        room_name: room?.name || "Không xác định"
      };

      setSelectedShowtimes([...selectedShowtimes, newShowtimeData]);
      
      // Reset form fields
      form.setFieldsValue({ 
        start_time: undefined, 
        end_time: undefined, 
        room_id: undefined,
        price: basePrice
      });
      
      message.success("Đã thêm suất chiếu vào danh sách");
    } catch (error) {
      console.error("Form validation error:", error);
    }
  };

  const handleRemoveShowtime = (id) => {
    setSelectedShowtimes(selectedShowtimes.filter(item => item.id !== id));
  };

  const handleSubmit = async () => {
    if (selectedShowtimes.length === 0) {
      message.error("Vui lòng thêm ít nhất một suất chiếu!");
      return;
    }

    setLoading(true);
    try {
      const formattedData = selectedShowtimes.map(({ 
        movie_id, room_id, start_time, end_time, base_price 
      }) => ({
        movie_id,
        room_id,
        start_time,
        end_time,
        base_price
      }));
      
      const response = await addShowtime(formattedData).unwrap();
      message.success("Tạo suất chiếu thành công");
      navigate("/admin/showtimes");
    } catch (error) {
      message.error("Đã xảy ra lỗi khi tạo suất chiếu: " + (error.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Disable past times
  const disablePastTime = (current) => {
    const today = dayjs().startOf('day');
    return current && current < today;
  };

  // Columns for the showtimes table
  const columns = [
    {
      title: '#',
      key: 'index',
      width: 60,
      render: (_, __, index) => index + 1
    },
    {
      title: 'Phim',
      dataIndex: 'movie_name',
      key: 'movie_name',
    },
    {
      title: 'Phòng',
      dataIndex: 'room_name',
      key: 'room_name',
    },
    {
      title: 'Giờ chiếu',
      key: 'time',
      render: (_, record) => `${record.start_time} - ${record.end_time}`
    },
    {
      title: 'Giá vé',
      dataIndex: 'base_price',
      key: 'base_price',
      render: (price) => `${price.toLocaleString('vi-VN')} VND`
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button 
          type="text" 
          danger 
          icon={<FiTrash2 />} 
          onClick={() => handleRemoveShowtime(record.id)}
        />
      ),
    },
  ];

  const isDataLoading = cinemasLoading || moviesLoading || (selectedCinema && roomsLoading);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Title level={4}>Thêm Suất Chiếu Mới</Title>
        <Button 
          icon={<FiX />} 
          onClick={() => navigate('/admin/showtimes')}
          type="text"
        />
      </div>

      {isDataLoading ? (
        <div className="flex justify-center py-10">
          <Spin size="large" />
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <Form
            form={form}
            layout="vertical"
            initialValues={{ price: basePrice }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Form.Item
                name="cinema_id"
                label="Rạp chiếu"
                rules={[{ required: true, message: 'Vui lòng chọn rạp chiếu' }]}
              >
                <Select 
                  placeholder="Chọn rạp chiếu" 
                  onChange={handleCinemaChange}
                >
                  {cinemas.map(cinema => (
                    <Option key={cinema.id} value={cinema.id}>
                      {cinema.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="movie_id"
                label="Phim"
                rules={[{ required: true, message: 'Vui lòng chọn phim' }]}
              >
                <Select 
                  placeholder="Chọn phim"
                  onChange={handleMovieChange}
                >
                  {movies.map(movie => (
                    <Option key={movie.id} value={movie.id}>
                      {movie.name} - {movie.duration} phút
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Form.Item
                name="room_id"
                label="Phòng chiếu"
                rules={[{ required: true, message: 'Vui lòng chọn phòng' }]}
              >
                <Select 
                  placeholder="Chọn phòng" 
                  disabled={!selectedCinema}
                >
                  {rooms.map(room => (
                    <Option key={room.id} value={room.id}>
                      {room.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="start_time"
                label="Giờ bắt đầu"
                rules={[{ required: true, message: 'Vui lòng chọn giờ bắt đầu' }]}
              >
                <TimePicker 
                  format="HH:mm" 
                  className="w-full" 
                  disabledDate={disablePastTime}
                  minuteStep={5}
                />
              </Form.Item>

              <Form.Item
                name="end_time"
                label="Giờ kết thúc"
                rules={[{ required: true, message: 'Vui lòng chọn giờ kết thúc' }]}
                tooltip={movieDuration > 0 ? `Thời lượng phim: ${movieDuration} phút` : undefined}
              >
                <TimePicker 
                  format="HH:mm" 
                  className="w-full"
                  minuteStep={5}
                />
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Form.Item
                name="price"
                label="Giá vé (VND)"
                rules={[{ required: true, message: 'Vui lòng nhập giá vé' }]}
              >
                <InputNumber
                  className="w-full"
                  min={10000}
                  step={1000}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </div>

            <div className="text-right">
              <Button 
                type="primary" 
                icon={<FiPlus />} 
                onClick={addShowtimeToList}
                className="bg-blue-500"
              >
                Thêm vào danh sách
              </Button>
            </div>
          </Form>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <Title level={5}>Danh sách suất chiếu ({selectedShowtimes.length})</Title>
          <Text type="secondary">
            Các suất chiếu sẽ được lưu sau khi bạn nhấn nút "Lưu lịch chiếu"
          </Text>
        </div>

        <Table 
          columns={columns} 
          dataSource={selectedShowtimes}
          rowKey="id"
          pagination={false}
          locale={{ emptyText: "Chưa có suất chiếu nào" }}
          className="mb-6"
        />

        <div className="flex justify-end mt-6">
          <Space>
            <Button onClick={() => navigate('/admin/showtimes')}>
              Hủy
            </Button>
            <Button 
              type="primary" 
              onClick={handleSubmit} 
              loading={loading || submitting}
              disabled={selectedShowtimes.length === 0}
              className="bg-blue-500"
            >
              Lưu lịch chiếu
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
}
