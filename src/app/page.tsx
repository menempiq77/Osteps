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

  const onFinish = async (values: { login: string; password: string }) => {
    await dispatch(login(values));
  };

  return (
    <div className="min-h-screen overflow-hidden font-['Raleway']">
      <div className="w-full min-h-screen bg-[#f5f5f5] shadow-xl z-10 flex overflow-hidden border-none">
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 p-8 flex items-center justify-center">
          <div
            className="max-w-md w-full bg-white py-4 px-4 md:px-8 rounded-[26px] border border-[#C6C5D0] flex flex-col items-center justify-start"
            style={{ boxShadow: "0px 2px 16px 0px #90909A1F" }}
          >
            <div className="w-full flex items-center justify-center">
              <Image
                src={Logo}
                alt="Company Logo"
                width={50}
                height={50}
                className="h-28 rounded-full w-auto"
                priority
              />
            </div>

            <div className="mt-8 w-full">
              <Form layout="vertical" onFinish={onFinish}>
                <Form.Item
                  label="Email Or Username"
                  name="login"
                  rules={[
                    { type: "text", message: "Invalid email address or username" },
                    { required: true, message: "Please input your email or username" },
                  ]}
                  className="[&_.ant-form-item-label>label]:!text-[16px] [&_.ant-form-item-label>label]:font-['Raleway'] !mb-4"
                >
                  <Input
                    placeholder="Enter your email or username"
                    className="focus:!border-green-500 hover:!border-green-400 font-['Raleway'] !px-[16px] !py-[14px]"
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
                      className="float-right text-sm !text-green-600 hover:!text-green-500 font-['Raleway']"
                    >
                      Forgot password?
                    </a>
                  }
                  className="[&_.ant-form-item-label>label]:!text-[16px] [&_.ant-form-item-label>label]:font-['Raleway']"
                >
                  <Input.Password
                    placeholder="Enter your password"
                    className="focus:!border-green-500 hover:!border-green-400 font-['Raleway'] !px-[16px] !py-[14px]"
                    size="large"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={status === 'loading'}
                    className="!bg-green-600 hover:!bg-green-700 w-full text-white !text-[16px] !font-semibold !h-[49px] !rounded-[66px] shadow-sm font-['Raleway']"
                  >
                    {status === 'loading' ? "Signing in..." : "Sign In"}
                  </Button>
                </Form.Item>

                {error && (
                  <div className="text-red-500 text-center mt-4 font-['Raleway']">
                    {error}
                  </div>
                )}
              </Form>
            </div>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-green-400 to-emerald-600 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src={LoginImg}
              alt="Authentication Illustration"
              width={400}
              height={400}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}