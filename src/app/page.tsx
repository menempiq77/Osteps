"use client";

import { Form, Input, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { login } from "@/features/auth/authSlice";
import Image from "next/image";
import Logo from "@/assets/images/Logo2.jpg";
import LoginImg from "@/assets/images/login.png";
import { useEffect } from "react";

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { status, error, currentUser } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (currentUser) {
      router.push('/dashboard');
    }
  }, [currentUser, router]);

  // Apply theme colors on mount
  useEffect(() => {
    const root = document.documentElement;
    const THEMES = {
      green: {
        primary: "#38C16C",
        soft: "#eef9f2",
        soft2: "#dff3e7",
        border: "#b9e2cd",
        dark: "#2f8f5b",
        shadow: "rgba(22, 101, 52, 0.35)",
        scrollStart: "#34d399",
        scrollEnd: "#16a34a",
      },
    };
    const theme = THEMES.green;
    root.style.setProperty("--primary", theme.primary);
    root.style.setProperty("--theme-soft", theme.soft);
    root.style.setProperty("--theme-soft-2", theme.soft2);
    root.style.setProperty("--theme-border", theme.border);
    root.style.setProperty("--theme-dark", theme.dark);
    root.style.setProperty("--theme-shadow", theme.shadow);
    root.style.setProperty("--theme-scroll-start", theme.scrollStart);
    root.style.setProperty("--theme-scroll-end", theme.scrollEnd);
  }, []);

  const onFinish = async (values: { login: string; password: string }) => {
    await dispatch(login(values));
  };

  return (
    <div className="min-h-[100dvh] bg-white font-['Raleway']">
      <div className="mx-auto flex min-h-[100dvh] w-full">
        {/* Left side - Form */}
        <div className="flex w-full items-center justify-center px-4 py-8 md:w-2/5 md:px-8 md:py-0 bg-white">
          <div className="w-full max-w-sm">
            <div className="w-full flex items-center justify-center mb-8">
              <Image
                src={Logo}
                alt="Company Logo"
                width={80}
                height={80}
                className="w-24 h-24 rounded-full"
                priority
              />
            </div>

            <div className="w-full">
              <Form layout="vertical" onFinish={onFinish}>
                <Form.Item
                  label="Email Or Username"
                  name="login"
                  rules={[
                    { type: "text", message: "Invalid email address or username" },
                    { required: true, message: "Please input your email or username" },
                  ]}
                  className="[&_.ant-form-item-label>label]:!text-sm [&_.ant-form-item-label>label]:text-gray-700 [&_.ant-form-item-label>label]:font-['Raleway'] !mb-4"
                >
                  <Input
                    placeholder="Enter your email or username"
                    className="!px-4 !py-2.5 font-['Raleway'] focus:!border-green-600 hover:!border-green-600 !rounded-lg"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: "Please input your password" },
                    {
                      min: 6,
                      message: "Password must be at least 6 characters",
                    },
                  ]}
                  extra={
                    <a
                      href="#"
                      className="float-right text-xs !text-green-600 hover:!text-green-700 font-['Raleway']"
                    >
                      Forgot password?
                    </a>
                  }
                  className="[&_.ant-form-item-label>label]:!text-sm [&_.ant-form-item-label>label]:text-gray-700 [&_.ant-form-item-label>label]:font-['Raleway']"
                >
                  <Input.Password
                    placeholder="Enter your password"
                    className="!px-4 !py-2.5 font-['Raleway'] focus:!border-green-600 hover:!border-green-600 !rounded-lg"
                    size="large"
                  />
                </Form.Item>

                <Form.Item className="!mb-0 mt-6">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={status === 'loading'}
                    className="!bg-green-600 hover:!bg-green-700 w-full !text-white !text-base !font-semibold !h-12 !rounded-full shadow-sm font-['Raleway']"
                  >
                    {status === 'loading' ? "Signing in..." : "Sign In"}
                  </Button>
                </Form.Item>

                {error && (
                  <div className="text-red-500 text-center text-sm mt-4 font-['Raleway']">
                    {error}
                  </div>
                )}
              </Form>
            </div>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="relative hidden w-3/5 overflow-hidden bg-gray-100 md:block">
          <Image
            src={LoginImg}
            alt="Authentication Illustration"
            width={800}
            height={800}
            className="w-full h-full object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}
