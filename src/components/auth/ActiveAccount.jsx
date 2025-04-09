import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button, Result, Spin, Typography, Card } from "antd";
import { useActiveAccountMutation, useResendActiveAccountMutation } from "@/api/authApi";

const { Title, Text } = Typography;

export default function ActiveAccount() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  const [activeAccount] = useActiveAccountMutation();
  const [resendActivation] = useResendActiveAccountMutation();
  
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const activateAccount = async () => {
    setLoading(true);
    try {
      if (!email || !token) {
        throw new Error("Thông tin kích hoạt không hợp lệ!");
      }

      const response = await activeAccount({ email, token }).unwrap();
      
      if (response.success) {
        setSuccess(true);
        setSuccessMessage(response.message || "Kích hoạt tài khoản thành công!");
      } else {
        setError(response.message || "Có lỗi xảy ra khi kích hoạt tài khoản");
      }
    } catch (error) {
      setError(
        error.data?.message || 
        error.message || 
        "Có lỗi xảy ra khi kích hoạt tài khoản"
      );
    } finally {
      setLoading(false);
    }
  };

  const requestNewActivation = async () => {
    setLoading(true);
    try {
      if (!email) {
        throw new Error("Email không tồn tại!");
      }

      const response = await resendActivation({ email }).unwrap();
      
      if (response.success) {
        setSuccess(true);
        setSuccessMessage("Đã gửi lại email kích hoạt. Vui lòng kiểm tra hộp thư của bạn.");
      } else {
        setError(response.message || "Không thể gửi lại email kích hoạt");
      }
    } catch (error) {
      setError(
        error.data?.message || 
        error.message || 
        "Không thể gửi lại email kích hoạt"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (email && token) {
      activateAccount();
    } else {
      setLoading(false);
      setError("Đường dẫn kích hoạt không hợp lệ!");
    }
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Card className="p-8 shadow-md w-full max-w-md">
          <div className="text-center">
            <Spin size="large" />
            <Title level={3} className="mt-4">Đang kích hoạt tài khoản...</Title>
            <Text type="secondary">Vui lòng đợi trong giây lát</Text>
          </div>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Result
          status="success"
          title={successMessage}
          subTitle="Bây giờ bạn có thể đăng nhập và sử dụng dịch vụ của chúng tôi."
          extra={[
            <Button type="primary" key="login">
              <Link to="/login">Đăng nhập ngay</Link>
            </Button>
          ]}
        />
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <Result
        status="error"
        title="Không thể kích hoạt tài khoản"
        extra={[
          <Button type="primary" key="resend" onClick={requestNewActivation}>
            Gửi lại email kích hoạt
          </Button>,
          <Button key="login">
            <Link to="/login">Quay lại đăng nhập</Link>
          </Button>
        ]}
      />
    </div>
  );
}
