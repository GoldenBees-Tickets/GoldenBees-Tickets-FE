import { useState } from "react";
import { Form, Input, Button, DatePicker, Spin, message } from "antd";
import dayjs from "dayjs";
import { useUpdateHolidayPricingMutation } from "@/api/priceSettingApi";

export default function UpdateHolidayItem({ onCancel, holidayItem, priceSettingId }) {
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [updateHolidayItem] = useUpdateHolidayPricingMutation();

  // Khởi tạo form với giá trị ban đầu
  const initialValues = {
    holiday_date: holidayItem ? dayjs(holidayItem.holiday_date) : null,
    holiday_name: holidayItem?.holiday_name || '',
  };

  const onFinish = async (values) => {
    try {
      setSubmitLoading(true);
      
      if (!holidayItem || !priceSettingId) {
        message.error("Không tìm thấy thông tin ngày lễ để cập nhật!");
        return;
      }
      
      const formattedDate = values.holiday_date.format('YYYY-MM-DD');
      
      const payload = {
        id: holidayItem.id,
        holiday_date: formattedDate,
        holiday_name: values.holiday_name
      };
      
      // Update holiday item
      await updateHolidayItem(payload).unwrap();
      message.success("Cập nhật ngày lễ thành công!");
      
      onCancel(); // Close modal on success
    } catch (error) {
      message.error(error?.data?.message || "Có lỗi xảy ra khi cập nhật ngày lễ!");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Spin spinning={submitLoading}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={initialValues}
        requiredMark={false}
      >
        <Form.Item
          name="holiday_date"
          label="Ngày lễ"
          rules={[{ required: true, message: "Vui lòng chọn ngày lễ!" }]}
        >
          <DatePicker 
            className="w-full" 
            format="YYYY-MM-DD"
            placeholder="Chọn ngày"
          />
        </Form.Item>
        
        <Form.Item
          name="holiday_name"
          label="Tên ngày lễ"
          rules={[{ required: true, message: "Vui lòng nhập tên ngày lễ!" }]}
        >
          <Input placeholder="Nhập tên ngày lễ" />
        </Form.Item>

        <Form.Item className="flex justify-end mt-6">
          <div className="flex gap-2">
            <Button onClick={onCancel}>Hủy</Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={submitLoading}
              className="bg-blue-700"
            >
              Cập nhật
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Spin>
  );
} 