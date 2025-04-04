import { useEffect, useState } from "react";
import { useAddShowtimeMutation, useGetBranchesQuery, useGetCinemasQuery, useGetMoviesListQuery, useGetRoomsQuery } from "@/api/showtimeApi";
import { Button, Form, Select, DatePicker, TimePicker, InputNumber, message, Spin } from "antd";
import { FiX } from "react-icons/fi";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export default function Showtime({ closeModal }) {
  const [branches, setBranches] = useState([]);
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [form] = Form.useForm();

  const { data: branchesData, isLoading: branchesLoading } = useGetBranchesQuery();
  const { data: cinemasData, isLoading: cinemasLoading } = useGetCinemasQuery(selectedBranch || "");
  const { data: roomsData, isLoading: roomsLoading } = useGetRoomsQuery(selectedCinema || "");
  const { data: moviesData, isLoading: moviesLoading } = useGetMoviesListQuery();
  const [addShowtime, { isLoading: addLoading }] = useAddShowtimeMutation();

  useEffect(() => {
    if (branchesData?.branches) {
      setBranches(branchesData.branches);
    }
  }, [branchesData]);

  useEffect(() => {
    if (cinemasData?.cinemas) {
      setCinemas(cinemasData.cinemas);
    }
  }, [cinemasData]);

  useEffect(() => {
    if (roomsData?.rooms) {
      setRooms(roomsData.rooms);
    }
  }, [roomsData]);

  useEffect(() => {
    if (moviesData?.movies) {
      setMovies(moviesData.movies);
    }
  }, [moviesData]);

  const handleBranchChange = (value) => {
    setSelectedBranch(value);
    setSelectedCinema(null);
    form.setFieldsValue({ cinema_id: undefined, room_id: undefined });
  };

  const handleCinemaChange = (value) => {
    setSelectedCinema(value);
    form.setFieldsValue({ room_id: undefined });
  };

  const onFinish = async (values) => {
    try {
      const formattedValues = {
        ...values,
        show_date: dayjs(values.show_date).format("YYYY-MM-DD"),
        start_time: dayjs(values.start_time).format("HH:mm"),
        end_time: dayjs(values.end_time).format("HH:mm"),
      };

      await addShowtime(formattedValues).unwrap();
      message.success("Thêm lịch chiếu thành công!");
      closeModal();
    } catch (error) {
      message.error("Lỗi khi thêm lịch chiếu: " + (error.data?.message || error.message));
    }
  };

  const isLoading = branchesLoading || cinemasLoading || roomsLoading || moviesLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Thêm lịch chiếu mới</h2>
        <Button 
          type="text" 
          icon={<FiX className="text-xl" />} 
          onClick={closeModal} 
          className="flex items-center justify-center"
        />
      </div>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="branch_id"
            label="Chi nhánh"
            rules={[{ required: true, message: "Vui lòng chọn chi nhánh" }]}
          >
            <Select
              placeholder="Chọn chi nhánh"
              onChange={handleBranchChange}
              options={branches.map((branch) => ({
                value: branch.id,
                label: branch.name,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="cinema_id"
            label="Rạp chiếu"
            rules={[{ required: true, message: "Vui lòng chọn rạp chiếu" }]}
          >
            <Select
              placeholder="Chọn rạp chiếu"
              onChange={handleCinemaChange}
              disabled={!selectedBranch}
              options={cinemas.map((cinema) => ({
                value: cinema.id,
                label: cinema.name,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="room_id"
            label="Phòng chiếu"
            rules={[{ required: true, message: "Vui lòng chọn phòng chiếu" }]}
          >
            <Select
              placeholder="Chọn phòng chiếu"
              disabled={!selectedCinema}
              options={rooms.map((room) => ({
                value: room.id,
                label: room.name,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="movie_id"
            label="Phim"
            rules={[{ required: true, message: "Vui lòng chọn phim" }]}
          >
            <Select
              placeholder="Chọn phim"
              options={movies.map((movie) => ({
                value: movie.id,
                label: movie.title,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="show_date"
            label="Ngày chiếu"
            rules={[{ required: true, message: "Vui lòng chọn ngày chiếu" }]}
          >
            <DatePicker 
              className="w-full" 
              format="DD/MM/YYYY"
              disabledDate={(current) => current && current < dayjs().startOf('day')}
            />
          </Form.Item>

          <Form.Item
            name="start_time"
            label="Giờ bắt đầu"
            rules={[{ required: true, message: "Vui lòng chọn giờ bắt đầu" }]}
          >
            <TimePicker 
              className="w-full" 
              format="HH:mm"
            />
          </Form.Item>

          <Form.Item
            name="end_time"
            label="Giờ kết thúc"
            rules={[{ required: true, message: "Vui lòng chọn giờ kết thúc" }]}
          >
            <TimePicker 
              className="w-full" 
              format="HH:mm"
            />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá vé"
            rules={[{ required: true, message: "Vui lòng nhập giá vé" }]}
          >
            <InputNumber
              className="w-full"
              min={0}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              addonAfter="VND"
            />
          </Form.Item>
        </div>

        <Form.Item className="mt-6">
          <Button 
            type="primary" 
            htmlType="submit" 
            className="bg-blue-500 w-full"
            loading={addLoading}
          >
            Thêm lịch chiếu
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
} 