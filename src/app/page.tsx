"use client";

import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { login } from "@/features/auth/authSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Logo from "@/assets/images/Logo2.png";
import LoginImg from "@/assets/images/LoginImg4.jpg";
import { useEffect } from "react";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { status, error, currentUser } = useSelector((state: RootState) => state.auth);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (currentUser) {
      router.push('/dashboard');
    }
  }, [currentUser, router]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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
                width={80}
                height={80}
                className="h-36 w-auto"
                priority
              />
            </div>

            <div className="mt-8 w-full">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[16px] font-['Raleway']">Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your email"
                            className="focus:!border-green-500 hover:!border-green-400 font-['Raleway'] px-[16px] py-[14px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center">
                          <FormLabel className="text-[16px] font-['Raleway']">Password</FormLabel>
                          <a
                            href="#"
                            className="text-sm text-green-600 hover:text-green-500 font-['Raleway']"
                          >
                            Forgot password?
                          </a>
                        </div>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter your password"
                            className="focus:!border-green-500 hover:!border-green-400 font-['Raleway'] px-[16px] py-[14px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={status === 'loading'}
                    className="bg-green-600 hover:bg-green-700 w-full text-white text-[16px] font-semibold h-[49px] rounded-[66px] shadow-sm font-['Raleway']"
                  >
                    {status === 'loading' ? "Signing in..." : "Sign In"}
                  </Button>

                  {error && (
                    <div className="text-red-500 text-center mt-4 font-['Raleway']">
                      {error}
                    </div>
                  )}
                </form>
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