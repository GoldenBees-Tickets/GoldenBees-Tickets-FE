import { Card, Form, Input, InputNumber, Select, DatePicker, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCreatePromotionMutation } from "../../../api/promotionApi";

const { Option } = Select;

const generateCouponCode = (applicableTo) => {
  const prefixMap = {
    ticket: "TICKET",
    food: "FOOD",
    total_bill: "BILL",
    other: "OTHER",
  };

  const prefix = prefixMap[applicableTo] || "PROMO";
  const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();

  return `${prefix}-${randomCode}`;
};

export default function AddPromotion() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [createPromotion] = useCreatePromotionMutation();
  const [couponCode, setCouponCode] = useState("");

  const handleApplicableToChange = (value) => {
    const newCode = generateCouponCode(value);
    setCouponCode(newCode);
    form.setFieldsValue({ code: newCode });
  };

  const handleSubmit = async (values) => {
    try {
        const formattedValues = {
            ...values,
            start_date: values.start_date ? values.start_date.format("YYYY-MM-DD") : null,
            end_date: values.end_date ? values.end_date.format("YYYY-MM-DD") : null,
          };
                  
      const response = await createPromotion(formattedValues).unwrap();
      if(response.status === 409) {
        message.error(response.message || "Mã giảm giá đã tồn tại!");
        return;
      }
      message.success(response.message || "Tạo mã giảm giá thành công!");      
      navigate("/admin/promotions");
    } catch (error) {
      console.error("Failed to create promotion:", error);
    }
  };

  return (
    <Card title="Thêm Mã Giảm Giá" className="w-full">
      <Form 
        layout="vertical" 
        form={form} 
        onFinish={handleSubmit} 
        initialValues={{ discount_type: "percentage", applicable_to: "ticket" }}
      >
        <Form.Item name="name" label="Tên khuyến mãi" rules={[{ required: true, message: "Tên khuyến mãi là bắt buộc" }]}> 
          <Input placeholder="VD: Giảm giá mùa hè" />
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <Input.TextArea rows={2} placeholder="Mô tả chương trình khuyến mãi" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item name="applicable_to" label="Áp dụng cho" rules={[{ required: true, message: "Vui lòng chọn đối tượng áp dụng" }]}> 
            <Select onChange={handleApplicableToChange}>
              <Option value="ticket">Vé xem phim</Option>
              <Option value="food">Thức ăn</Option>
              <Option value="total_bill">Tổng hóa đơn</Option>
              <Option value="other">Khác</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="code" label="Mã giảm giá" rules={[{ required: true, message: "Vui lòng nhập mã giảm giá" }]}> 
            <Input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item name="discount_type" label="Loại giảm giá" rules={[{ required: true, message: "Bắt buộc" }]}>
            <Select>
              <Option value="percentage">Theo phần trăm</Option>
              <Option value="fixed_amount">Theo số tiền</Option>
            </Select>
          </Form.Item>

          <Form.Item name="discount_value" label="Giá trị giảm" rules={[{ required: true, message: "Vui lòng nhập giá trị giảm" }]}> 
            <InputNumber className="w-full" min={1} placeholder="VD: 10 hoặc 50000" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item name="min_order_value" label="Giá trị đơn tối thiểu">
            <InputNumber className="w-full" min={0} placeholder="VD: 100000" />
          </Form.Item>

          <Form.Item name="max_discount" label="Giảm tối đa">
            <InputNumber className="w-full" min={0} placeholder="VD: 50000" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item name="usage_limit" label="Giới hạn số lần sử dụng">
            <InputNumber className="w-full" min={1} placeholder="VD: 100" />
          </Form.Item>

          <Form.Item name="per_user_limit" label="Giới hạn mỗi người dùng">
            <InputNumber className="w-full" min={1} placeholder="VD: 5" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item name="start_date" label="Ngày bắt đầu" rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu" }]}> 
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item name="end_date" label="Ngày kết thúc" rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc" }]}> 
            <DatePicker className="w-full" />
          </Form.Item>
        </div>

        <Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={() => navigate("/admin/promotions")}>Hủy</Button>
            <Button type="primary" htmlType="submit">Thêm mã</Button>
          </div>
        </Form.Item>
      </Form>
    </Card>
  );
}