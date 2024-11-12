import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import Dashboardbg from "../assets/dashboardbg.jpg";
import { Form, Input, Button, Typography, message, Divider, Card } from "antd";

const { Title, Text } = Typography;

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    const { email, password } = values;
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      message.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      message.error("Invalid email or password. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden ">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${Dashboardbg})`,
        }}
      ></div>
      <div className="absolute inset-0 bg-black opacity-30"></div>
      <div className="relative z-10 max-w-xl mx-auto p-6">
        <Card className="shadow-lg" style={{ borderRadius: "5px", overflow: "hidden" }}>
          <Title level={2} className="text-center  text-gray-800">
            Admin Login
          </Title>
          <Divider />
          <Text type="secondary" className="block text-center mb-4">
            Welcome, Admin! Please log in to manage your dashboard.
          </Text>
          <Form
           className="bg-gray-100 py-3 px-2 rounded"
            layout="vertical"
            onFinish={handleLogin}
            style={{ width: "100%" }}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please enter your email!" }]}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>

            <Form.Item
    
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please enter your password!" }]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>

            <Form.Item>
              <Button
              type="none"
                className="bg-green-600 text-white font-semibold hover:bg-green-500"
                htmlType="submit"
                loading={loading}
                block
              >
                Login
              </Button>
            </Form.Item>
          </Form>

          {/* Thank You Note */}
          <div className="mt-6 text-center">
            <Text type="success">
              Thank you for taking the time to secure and manage the dashboard.
            </Text>
            <Text type="secondary" className="block mt-2">
              Your role as admin is greatly appreciated!
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
}
