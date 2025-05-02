import { useState, useEffect } from "react";
import { Form, Input, Button, Spin, message } from "antd";
import { useUpdatePriceSettingMutation } from "@/api/priceSettingApi";

export default function UpdatePriceSetting({ onCancel, currentData }) {
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [updatePriceSetting] = useUpdatePriceSettingMutation();
  // Set form values from existing data
  useEffect(() => {
    if (currentData) {
      form.setFieldsValue({
        base_ticket_price: currentData.base_ticket_price,
        weekend_ticket_price: currentData.weekend_ticket_price,
        holiday_ticket_price: currentData.holiday_ticket_price,
      });
    }
  }, [currentData, form]);

  const onFinish = async (values) => {
    try {
      setSubmitLoading(true);
      
      if (!currentData || !currentData.id) {
        message.error("Không tìm thấy thông tin giá vé để cập nhật!");
        return;
      }
      
      // Update existing price setting
      await updatePriceSetting({
        id: currentData.id,
        ...values
      }).unwrap();
      
      message.success("Cập nhật giá vé thành công!");
      onCancel(); // Close modal on success
    } catch (error) {
      message.error(error?.data?.message || "Có lỗi xảy ra khi cập nhật giá vé!");
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
        className="mt-4"
        requiredMark={false}
        initialValues={{
          base_ticket_price: currentData?.base_ticket_price || 0,
          weekend_ticket_price: currentData?.weekend_ticket_price || 0,
          holiday_ticket_price: currentData?.holiday_ticket_price || 0,
        }}
      >
        <Form.Item
          name="base_ticket_price"
          label="Giá vé ngày thường"
          rules={[
            { required: true, message: "Vui lòng nhập giá vé ngày thường!" },
            {
              type: "number",
              min: 0,
              message: "Giá không được âm!",
              transform: (value) => Number(value),
            },
          ]}
        >
          <Input 
            placeholder="Nhập giá vé ngày thường" 
            suffix="VND"
            type="number"
          />
        </Form.Item>

        <Form.Item
          name="weekend_ticket_price"
          label="Giá vé cuối tuần"
          rules={[
            { required: true, message: "Vui lòng nhập giá vé cuối tuần!" },
            {
              type: "number",
              min: 0,
              message: "Giá không được âm!",
              transform: (value) => Number(value),
            },
          ]}
        >
          <Input 
            placeholder="Nhập giá vé cuối tuần" 
            suffix="VND"
            type="number"
          />
        </Form.Item>

        <Form.Item
          name="holiday_ticket_price"
          label="Giá vé ngày lễ"
          rules={[
            { required: true, message: "Vui lòng nhập giá vé ngày lễ!" },
            {
              type: "number",
              min: 0,
              message: "Giá không được âm!",
              transform: (value) => Number(value),
            },
          ]}
        >
          <Input 
            placeholder="Nhập giá vé ngày lễ" 
            suffix="VND"
            type="number"
          />
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