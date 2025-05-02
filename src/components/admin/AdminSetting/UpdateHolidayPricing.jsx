import { useState, useEffect } from "react";
import { Form, Input, Button, DatePicker, Table, Spin, Space, message, Popconfirm } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useUpdateHolidayPricingMutation } from "@/api/priceSettingApi";

export default function UpdateHolidayPricing({ onCancel, currentData, holidayData }) {
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [holidays, setHolidays] = useState([]);

  const [updateHolidayPricing] = useUpdateHolidayPricingMutation();

  // Initialize with existing data
  useEffect(() => {
    if (holidayData && holidayData.length > 0) {
      setHolidays(holidayData.map(holiday => ({
        holiday_date: holiday.holiday_date,
        holiday_name: holiday.holiday_name,
        key: Math.random().toString(36).substring(2, 9)
      })));
    }
  }, [holidayData]);

  const handleAddHoliday = () => {
    const values = form.getFieldsValue(['new_holiday_date', 'new_holiday_name']);
    
    if (!values.new_holiday_date || !values.new_holiday_name) {
      message.error('Vui lòng nhập đầy đủ thông tin ngày lễ!');
      return;
    }

    const formattedDate = dayjs(values.new_holiday_date).format('YYYY-MM-DD');
    
    const newHoliday = {
      holiday_date: formattedDate,
      holiday_name: values.new_holiday_name,
      key: Math.random().toString(36).substring(2, 9)
    };
    
    setHolidays([...holidays, newHoliday]);
    
    // Reset form fields
    form.setFieldsValue({
      new_holiday_date: null,
      new_holiday_name: ''
    });
  };

  const handleDeleteHoliday = (key) => {
    setHolidays(holidays.filter(holiday => holiday.key !== key));
  };

  const onFinish = async () => {
    try {
      setSubmitLoading(true);
      
      if (!currentData || !currentData.id) {
        message.error("Không tìm thấy thông tin giá vé để cập nhật danh sách ngày lễ!");
        return;
      }
      
      const payload = {
        id: currentData.id,
        holiday_ticket_price: currentData.holiday_ticket_price,
        holidays: holidays.map(({ holiday_date, holiday_name }) => ({
          holiday_date,
          holiday_name
        }))
      };
      
      // Update existing holiday pricing
      await updateHolidayPricing(payload).unwrap();
      message.success("Cập nhật danh sách ngày lễ thành công!");
      
      onCancel(); // Close modal on success
    } catch (error) {
      message.error(error?.data?.message || "Có lỗi xảy ra khi cập nhật danh sách ngày lễ!");
    } finally {
      setSubmitLoading(false);
    }
  };

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      render: (_, __, index) => index + 1
    },
    {
      title: 'Ngày lễ',
      dataIndex: 'holiday_date',
      key: 'holiday_date',
    },
    {
      title: 'Tên ngày lễ',
      dataIndex: 'holiday_name',
      key: 'holiday_name',
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Popconfirm
          title="Xóa ngày lễ?"
          description="Bạn có chắc muốn xóa ngày lễ này?"
          onConfirm={() => handleDeleteHoliday(record.key)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Button danger icon={<DeleteOutlined />} size="small" />
        </Popconfirm>
      ),
    },
  ];

  return (
    <Spin spinning={submitLoading}>
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
      >
        <div className="mt-2 mb-3">
          <h3 className="text-base font-medium">Cập nhật danh sách ngày lễ</h3>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="flex flex-wrap gap-4 items-end">
            <Form.Item
              name="new_holiday_date"
              label="Ngày lễ"
              className="mb-0 flex-1 min-w-[200px]"
            >
              <DatePicker 
                className="w-full" 
                format="YYYY-MM-DD"
                placeholder="Chọn ngày"
              />
            </Form.Item>
            
            <Form.Item
              name="new_holiday_name"
              label="Tên ngày lễ"
              className="mb-0 flex-1 min-w-[200px]"
            >
              <Input placeholder="Nhập tên ngày lễ" />
            </Form.Item>
            
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleAddHoliday}
              className="bg-blue-700"
            >
              Thêm
            </Button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={holidays}
          pagination={false}
          className="mb-6"
          locale={{
            emptyText: "Chưa có ngày lễ nào được thêm"
          }}
          size="small"
        />

        <Form.Item className="flex justify-end mt-6">
          <Space>
            <Button onClick={onCancel}>Hủy</Button>
            <Button 
              type="primary" 
              onClick={onFinish} 
              loading={submitLoading}
              className="bg-blue-700"
            >
              Cập nhật
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Spin>
  );
} 