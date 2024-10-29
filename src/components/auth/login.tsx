'use client'

import React from 'react'
import { Form, Input, Button, Checkbox, Typography, notification, Divider, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { authenticate } from '@/utils/actions'
import { useRouter } from 'next/navigation'
import ModalReactive from './modal.reactive'
import ModalChangePassword from './modal.forgotpass'
import { signIn, useSession, getCsrfToken } from 'next-auth/react'
import { sendRequest } from '@/utils/api'

const { Title } = Typography

export default function Login() {
    const [form] = Form.useForm()
    const router = useRouter()
    const [isOpen, setIsOpen] = React.useState(false)
    const [email, setEmail] = React.useState('')
    const [isOpen2, setIsOpen2] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const onFinish = async (values: any) => {
        const { username, password } = values
        const res = await authenticate(username, password)
        if (res.error) {
            notification.error({
                message: "Login failed",
                description: res.error
            })
            if (res.error === "Tài khoản chưa được kích hoạt.") {
                setEmail(username)
                setIsOpen(true)
            }
        } else {
            notification.success({
                message: "Login success",
                description: "Welcome back!"
            })
            router.push("/dashboard")
        }
    }

    const handleGoogleLogin = async () => {
        setLoading(true)
        await signIn("google", { callbackUrl: "/dashboard" })
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
                <div>
                    <Title level={2} className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Welcome Back
                    </Title>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Sign in to your account
                    </p>
                </div>
                <Button
                    onClick={handleGoogleLogin}
                    className="w-full h-12 text-lg font-semibold rounded-md border border-gray-300 flex items-center justify-center space-x-2 hover:bg-gray-50 transition duration-150"
                    loading={loading}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                    </svg>
                    <span>Sign in with Google</span>
                </Button>
                <Divider plain>Or</Divider>
                <Form
                    form={form}
                    name="login"
                    onFinish={onFinish}
                    className="mt-8 space-y-6"
                    layout="vertical"
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your Username!' }]}
                    >
                        <Input
                            prefix={<UserOutlined className="text-gray-400" />}
                            placeholder="Username"
                            className="rounded-md h-12"
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="text-gray-400" />}
                            placeholder="Password"
                            className="rounded-md h-12"
                        />
                    </Form.Item>
                    <div className="flex items-center justify-between">
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>
                        <Button type="link" onClick={() => setIsOpen2(true)} className="text-blue-600 hover:text-blue-800">
                            Forgot password?
                        </Button>
                    </div>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="w-full h-12 text-lg font-semibold rounded-md bg-blue-600 hover:bg-blue-700">
                            Sign In
                        </Button>
                    </Form.Item>
                </Form>
                <div className="text-center text-sm">
                    Don't have an account?{' '}
                    <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-800">
                        Sign up now
                    </Link>
                </div>
            </div>
            <ModalReactive isOpen={isOpen} onClose={() => setIsOpen(false)} email={email} />
            <ModalChangePassword isOpen={isOpen2} onClose={() => setIsOpen2(false)} />
        </div>
    )
}