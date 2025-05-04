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
  InputNumber,
  DatePicker,
} from "antd";
import { FiPlus, FiX, FiTrash2 } from "react-icons/fi";
import { useGetCinemaByBranchIdQuery, useGetAllCinemaNotPaginationQuery } from "@/api/cinemaApi";
import { useGetRoomsByCinemaIdQuery } from "@/api/roomApi";
import { useGetMoviesByAddShowtimeQuery } from "@/api/movieApi";
import {
  useCreateShowtimeMutation,
  useLazyGetShowtimeByRoomIdQuery,
} from "@/api/showtimeApi";
import { useGetPriceSettingsQuery } from "@/api/priceSettingApi";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;

// Hàm kiểm tra trùng lịch chiếu (cập nhật để kiểm tra cả ngày và giờ)
const checkDuplicateShowtime = (
  showtimes,
  roomId,
  selectedDate,
  start,
  end
) => {
  return showtimes.some((showtime) => {
    // Kiểm tra nếu cùng phòng và cùng ngày
    const isSameRoom = Number(showtime.room_id) === Number(roomId);
    const isSameDate = showtime.show_date === selectedDate;

    if (!isSameRoom || !isSameDate) return false;

    // Kiểm tra thời gian có bị chồng chéo không
    return (
      (start >= new Date(`2023-01-01T${showtime.start_time}`).getTime() &&
        start < new Date(`2023-01-01T${showtime.end_time}`).getTime()) ||
      (end > new Date(`2023-01-01T${showtime.start_time}`).getTime() &&
        end <= new Date(`2023-01-01T${showtime.end_time}`).getTime()) ||
      (start <= new Date(`2023-01-01T${showtime.start_time}`).getTime() &&
        end >= new Date(`2023-01-01T${showtime.end_time}`).getTime())
    );
  });
};

// Hàm kiểm tra khoảng cách thời gian giữa các suất chiếu (tối thiểu 15 phút)
const checkMinimumTimeGap = (showtimes, roomId, selectedDate, start, end) => {
  const MIN_GAP_MINUTES = 15;
  const MIN_GAP_MILLISECONDS = MIN_GAP_MINUTES * 60 * 1000;

  // Lọc các suất chiếu cùng phòng, cùng ngày
  const relevantShowtimes = showtimes.filter(
    (showtime) =>
      Number(showtime.room_id) === Number(roomId) &&
      showtime.show_date === selectedDate
  );

  for (const showtime of relevantShowtimes) {
    const showtimeStart = new Date(
      `2023-01-01T${showtime.start_time}`
    ).getTime();
    const showtimeEnd = new Date(`2023-01-01T${showtime.end_time}`).getTime();

    // Kiểm tra suất chiếu mới bắt đầu trước khi suất hiện tại kết thúc cộng thêm khoảng thời gian tối thiểu
    if (start <= showtimeEnd + MIN_GAP_MILLISECONDS && end > showtimeStart) {
      return {
        hasError: true,
        message: `Suất chiếu phải cách suất trước ít nhất ${MIN_GAP_MINUTES} phút!`,
      };
    }

    // Kiểm tra suất chiếu mới kết thúc sau khi suất hiện tại bắt đầu trừ đi khoảng thời gian tối thiểu
    if (end >= showtimeStart - MIN_GAP_MILLISECONDS && start < showtimeEnd) {
      return {
        hasError: true,
        message: `Suất chiếu phải cách suất sau ít nhất ${MIN_GAP_MINUTES} phút!`,
      };
    }
  }

  return { hasError: false };
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
  const [movieReleaseDate, setMovieReleaseDate] = useState(null);

  // API calls
  const { data: priceSettings } = useGetPriceSettingsQuery(branch_id, {
    skip: !branch_id,
  });
  
  // Lấy dữ liệu rạp phim dựa trên branch_id
  const { data: cinemasDataByBranch, isLoading: cinemasLoadingByBranch } =
    useGetCinemaByBranchIdQuery(branch_id, {
      skip: !branch_id
    });
    
  // Lấy tất cả rạp phim khi không có branch_id
  const { data: allCinemasData, isLoading: allCinemasLoading } =
    useGetAllCinemaNotPaginationQuery({
      skip: !!branch_id
    });

  const { data: moviesData, isLoading: moviesLoading } = useGetMoviesByAddShowtimeQuery();
  
  const { data: roomsData, isLoading: roomsLoading } =
    useGetRoomsByCinemaIdQuery(selectedCinema, {
      skip: !selectedCinema,
    });
  const [checkShowtime] = useLazyGetShowtimeByRoomIdQuery();
  const [addShowtime, { isLoading: submitting }] = useCreateShowtimeMutation();

  // Dữ liệu đã xử lý
  const cinemas = useMemo(() => {
    // Nếu có branch_id, sử dụng dữ liệu từ cinemasDataByBranch
    if (branch_id !== "null") {      
      return cinemasDataByBranch?.cinemas || [];
    }
    // Nếu không có branch_id, sử dụng dữ liệu từ allCinemasData
    return allCinemasData?.data || [];
  }, [branch_id, cinemasDataByBranch, allCinemasData]);
  
  const movies = useMemo(() => moviesData?.data || [], [moviesData]);
  const rooms = useMemo(() => roomsData?.data || [], [roomsData]);
  const basePrice = useMemo(
    () => priceSettings?.data?.base_ticket_price || 55000,
    [priceSettings]
  );  

  useEffect(() => {
    if (selectedMovie) {
      const movie = movies.find((m) => m.id === Number(selectedMovie));
      if (movie) {
        setMovieDuration(movie.duration || 0);
        setMovieReleaseDate(
          movie.release_date ? dayjs(movie.release_date) : null
        );
      }
    } else {
      setMovieReleaseDate(null);
    }
  }, [selectedMovie, movies]);

  useEffect(() => {
    // Thiết lập giá trị mặc định cho ngày là hôm nay
    form.setFieldsValue({ show_date: dayjs() });
  }, [form]);

  // Tự động tính toán giờ kết thúc khi người dùng chọn giờ bắt đầu
  useEffect(() => {
    const startTime = form.getFieldValue('start_time');
    if (startTime && movieDuration > 0) {
      // Tính toán giờ kết thúc = giờ bắt đầu + thời lượng phim + 15 phút buffer
      const endTime = dayjs(startTime).add(movieDuration + 15, 'minute');
      
      // Cập nhật giá trị trong form
      form.setFieldsValue({ end_time: endTime });
    }
  }, [form.getFieldValue('start_time'), movieDuration]);

  const handleCinemaChange = (value) => {
    setSelectedCinema(value);
    form.setFieldsValue({ room_id: undefined });
  };

  const handleMovieChange = (value) => {
    setSelectedMovie(value);

    // Update show_date field validation
    if (value) {
      const movie = movies.find((m) => m.id === Number(value));
      if (movie && movie.release_date) {
        const releaseDate = dayjs(movie.release_date);
        const currentShowDate = form.getFieldValue("show_date");

        if (currentShowDate && currentShowDate.isBefore(releaseDate, "day")) {
          form.setFieldsValue({ show_date: releaseDate });
        }
      }
    }
  };

  // Xử lý khi người dùng chọn giờ bắt đầu
  const handleStartTimeChange = (time) => {
    if (time && movieDuration > 0) {
      // Tính toán giờ kết thúc = giờ bắt đầu + thời lượng phim + 15 phút buffer
      const endTime = dayjs(time).add(movieDuration + 15, 'minute');
      
      // Cập nhật giá trị trong form
      form.setFieldsValue({ end_time: endTime });
    }
  };

  const addShowtimeToList = async () => {
    try {
      // Validate form trước khi thêm
      const values = await form.validateFields();

      const startTime = dayjs(values.start_time).format("HH:mm");
      const endTime = dayjs(values.end_time).format("HH:mm");
      const showDate = dayjs(values.show_date).format("YYYY-MM-DD");

      // Kiểm tra thời gian bắt đầu phải lớn hơn thời gian hiện tại ít nhất 1 giờ
      const currentDateTime = dayjs();
      const selectedDateTime = dayjs(
        `${showDate} ${startTime}`,
        "YYYY-MM-DD HH:mm"
      );
      const minimumDateTime = currentDateTime.add(1, "hour");

      if (selectedDateTime.isBefore(minimumDateTime)) {
        message.error(
          "Thời gian bắt đầu phải cách thời gian hiện tại ít nhất 1 giờ!"
        );
        return;
      }

      // Kiểm tra ngày chiếu phải sau hoặc bằng ngày phát hành phim
      if (movieReleaseDate) {
        const showDateObj = dayjs(showDate);
        if (showDateObj.isBefore(movieReleaseDate, "day")) {
          message.error(
            `Ngày chiếu phải từ ngày phát hành phim (${movieReleaseDate.format(
              "DD/MM/YYYY"
            )}) trở đi!`
          );
          return;
        }
      }

      // Kiểm tra xem end_time có phải sau start_time đủ thời lượng phim không
      const startMinutes =
        dayjs(values.start_time).hour() * 60 +
        dayjs(values.start_time).minute();
      const endMinutes =
        dayjs(values.end_time).hour() * 60 + dayjs(values.end_time).minute();
      const duration = endMinutes - startMinutes;

      if (duration < movieDuration) {
        message.error(`Thời gian chiếu phải ít nhất ${movieDuration} phút!`);
        return;
      }

      // Kiểm tra giới hạn thời gian kết thúc không quá thời lượng phim + 30 phút
      const MAX_BUFFER_MINUTES = 30;
      const maxDuration = movieDuration + MAX_BUFFER_MINUTES;

      if (duration > maxDuration) {
        message.error(
          `Thời gian chiếu không được vượt quá ${maxDuration} phút (thời lượng phim + ${MAX_BUFFER_MINUTES} phút)!`
        );
        return;
      }

      // Kiểm tra trùng lịch
      const start = new Date(`2023-01-01T${startTime}`).getTime();
      const end = new Date(`2023-01-01T${endTime}`).getTime();

      const isDuplicate = checkDuplicateShowtime(
        selectedShowtimes,
        values.room_id,
        showDate,
        start,
        end
      );

      if (isDuplicate) {
        message.error(
          "Suất chiếu bị trùng trong cùng phòng và cùng ngày! Vui lòng chọn giờ hoặc ngày khác."
        );
        return;
      }

      // Kiểm tra khoảng cách tối thiểu giữa các suất chiếu
      const timeGapCheck = checkMinimumTimeGap(
        selectedShowtimes,
        values.room_id,
        showDate,
        start,
        end
      );

      if (timeGapCheck.hasError) {
        message.error(timeGapCheck.message);
        return;
      }

      // Kiểm tra trùng lịch từ server
      const result = await checkShowtime({
        room_id: values.room_id,
        start_time: startTime,
        end_time: endTime,
        show_date: showDate, // Thêm ngày chiếu vào API check
      });

      if (result?.error?.status === 409) {
        message.error(
          "Suất chiếu bị trùng với lịch hiện có! Vui lòng chọn giờ hoặc ngày khác."
        );
        return;
      }

      // Tìm thông tin phim và phòng
      const movie = movies.find((m) => m.id === Number(values.movie_id));
      const room = rooms.find((r) => r.id === Number(values.room_id));

      // Thêm vào danh sách
      const newShowtimeData = {
        id: Date.now(),
        cinema_id: values.cinema_id,
        movie_id: values.movie_id,
        room_id: values.room_id,
        show_date: showDate,
        start_time: startTime,
        end_time: endTime,
        base_price: values.price || basePrice,
        movie_name: movie?.name || "Không xác định",
        room_name: room?.name || "Không xác định",
      };

      setSelectedShowtimes([...selectedShowtimes, newShowtimeData]);

      // Reset form fields (giữ nguyên các trường đã chọn, chỉ reset thời gian)
      form.setFieldsValue({
        start_time: undefined,
        end_time: undefined,
        room_id: undefined,
        price: basePrice,
      });

      message.success("Đã thêm suất chiếu vào danh sách");
    } catch (error) {
      console.error("Form validation error:", error);
    }
  };

  const handleRemoveShowtime = (id) => {
    setSelectedShowtimes(selectedShowtimes.filter((item) => item.id !== id));
  };

  const handleSubmit = async () => {
    if (selectedShowtimes.length === 0) {
      message.error("Vui lòng thêm ít nhất một suất chiếu!");
      return;
    }

    setLoading(true);
    try {
      const formattedData = selectedShowtimes.map(
        ({
          movie_id,
          room_id,
          start_time,
          end_time,
          base_price,
          show_date,
        }) => ({
          movie_id,
          room_id,
          start_time,
          end_time,
          show_date, // Thêm ngày chiếu vào dữ liệu gửi lên server
          base_price,
        })
      );

      const response = await addShowtime(formattedData).unwrap();
      message.success("Tạo suất chiếu thành công");
      navigate("/admin/showtimes");
    } catch (error) {
      message.error(
        "Đã xảy ra lỗi khi tạo suất chiếu: " +
          (error.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // Disable dates before release date or past dates
  const disableDates = (current) => {
    const isPastDate = current && current < dayjs().startOf("day");

    // If we have a release date, also disable dates before release date
    if (movieReleaseDate) {
      return isPastDate || current.isBefore(movieReleaseDate, "day");
    }

    return isPastDate;
  };

  // Columns for the showtimes table
  const columns = [
    {
      title: "#",
      key: "index",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Phim",
      dataIndex: "movie_name",
      key: "movie_name",
    },
    {
      title: "Phòng",
      dataIndex: "room_name",
      key: "room_name",
    },
    {
      title: "Ngày chiếu",
      dataIndex: "show_date",
      key: "show_date",
    },
    {
      title: "Giờ chiếu",
      key: "time",
      render: (_, record) => `${record.start_time} - ${record.end_time}`,
    },
    {
      title: "Giá vé",
      dataIndex: "base_price",
      key: "base_price",
      render: (price) => `${price.toLocaleString("vi-VN")} VND`,
    },
    {
      title: "Thao tác",
      key: "action",
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

  const isDataLoading =
    (branch_id ? cinemasLoadingByBranch : allCinemasLoading) || 
    moviesLoading || 
    (selectedCinema && roomsLoading);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Title level={4}>Thêm Suất Chiếu Mới</Title>
        <Button
          icon={<FiX />}
          onClick={() => navigate("/admin/showtimes")}
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
            initialValues={{
              price: basePrice,
              show_date: dayjs(),
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Form.Item
                name="cinema_id"
                label="Rạp chiếu"
                rules={[{ required: true, message: "Vui lòng chọn rạp chiếu" }]}
              >
                <Select
                  placeholder="Chọn rạp chiếu"
                  onChange={handleCinemaChange}
                >
                  {cinemas.map((cinema) => (
                    <Option key={cinema.id} value={cinema.id}>
                      {cinema.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="movie_id"
                label="Phim"
                rules={[{ required: true, message: "Vui lòng chọn phim" }]}
              >
                <Select 
                  placeholder="Chọn phim" 
                  onChange={handleMovieChange}
                  showSearch
                  optionFilterProp="label"
                  filterOption={(input, option) => 
                    (option?.label || '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={movies.map((movie) => ({
                    value: movie.id,
                    label: `${movie.name} - ${movie.duration} phút`
                  }))}
                />
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Form.Item
                name="room_id"
                label="Phòng chiếu"
                rules={[{ required: true, message: "Vui lòng chọn phòng" }]}
              >
                <Select placeholder="Chọn phòng" disabled={!selectedCinema}>
                  {rooms.map((room) => (
                    <Option key={room.id} value={room.id}>
                      {room.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="show_date"
                label="Ngày chiếu"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày chiếu" },
                  {
                    validator: (_, value) => {
                      if (
                        movieReleaseDate &&
                        value &&
                        value.isBefore(movieReleaseDate, "day")
                      ) {
                        return Promise.reject(
                          `Ngày chiếu phải từ ngày phát hành phim (${movieReleaseDate.format(
                            "DD/MM/YYYY"
                          )}) trở đi!`
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <DatePicker
                  className="w-full"
                  format="DD/MM/YYYY"
                  disabledDate={disableDates}
                />
              </Form.Item>

              <Form.Item
                name="price"
                label="Giá vé (VND)"
                rules={[{ required: true, message: "Vui lòng nhập giá vé" }]}
              >
                <InputNumber
                  className="w-full"
                  min={10000}
                  step={1000}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Form.Item
                name="start_time"
                label="Giờ bắt đầu"
                rules={[
                  { required: true, message: "Vui lòng chọn giờ bắt đầu" },
                ]}
              >
                <TimePicker 
                  format="HH:mm" 
                  className="w-full" 
                  minuteStep={5} 
                  onChange={handleStartTimeChange}
                  placeholder={movieDuration > 0 ? `Chọn giờ bắt đầu (Thời lượng: ${movieDuration} phút)` : "Chọn giờ bắt đầu"}
                />
              </Form.Item>

              <Form.Item
                name="end_time"
                label="Giờ kết thúc"
                rules={[
                  { required: true, message: "Vui lòng chọn giờ kết thúc" },
                ]}
                tooltip={
                  movieDuration > 0
                    ? `Thời lượng phim: ${movieDuration} phút + 15 phút quảng cáo`
                    : undefined
                }
              >
                <TimePicker 
                  format="HH:mm" 
                  className="w-full" 
                  minuteStep={5} 
                  placeholder="Tự động tính toán khi chọn giờ bắt đầu"
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
          <Title level={5}>
            Danh sách suất chiếu ({selectedShowtimes.length})
          </Title>
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
            <Button onClick={() => navigate("/admin/showtimes")}>Hủy</Button>
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
