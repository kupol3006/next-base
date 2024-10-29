'use client'

import React from 'react'
import { Form, Input, Button, Typography, notification, message, Divider } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { sendRequest } from '@/utils/api'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

const { Title } = Typography

export default function Register() {
    const [form] = Form.useForm()
    const router = useRouter()
    const [loading, setLoading] = React.useState(false)

    const onFinish = async (values: any) => {
        console.log('Received values of form: ', values)
        const res = await sendRequest<IBackendRes<Ilogin>>({
            method: 'POST',
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
            body: {
                name: values.username,
                email: values.email,
                password: values.password,
            }
        })
        console.log(res);
        if (res?.data) {
            router.push(`/verify/${res?.data?.id}`)
        }
        else {
            message.error('Registration failed. Please try again.')
        }
    }

    const handleGoogleRegister = async () => {
        setLoading(true)
        await signIn("google", { callbackUrl: "/dashboard" })
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
                <div>
                    <Title level={2} className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </Title>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Join us and start your journey
                    </p>
                </div>
                <Button
                    onClick={handleGoogleRegister}
                    className="w-full h-12 text-lg font-semibold rounded-md border border-gray-300 flex items-center justify-center space-x-2 hover:bg-gray-50 transition duration-150"
                    loading={loading}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                    </svg>
                    <span>Register with Google</span>
                </Button>
                <Divider plain>Or register with email</Divider>
                <Form
                    form={form}
                    name="register"
                    onFinish={onFinish}
                    scrollToFirstError
                    layout="vertical"
                    className="mt-8 space-y-6"
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your Username!', whitespace: true }]}
                    >
                        <Input
                            prefix={<UserOutlined className="text-gray-400" />}
                            placeholder="Username"
                            className="rounded-md h-12"
                        />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        rules={[
                            {
                                type: 'email',
                                message: 'The input is not valid E-mail!',
                            },
                            {
                                required: true,
                                message: 'Please input your E-mail!',
                            },
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined className="text-gray-400" />}
                            placeholder="Email"
                            className="rounded-md h-12"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                        hasFeedback
                    >
                        <Input.Password
                            prefix={<LockOutlined className="text-gray-400" />}
                            placeholder="Password"
                            className="rounded-md h-12"
                        />
                    </Form.Item>

                    <Form.Item
                        name="confirm"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Please confirm your password!',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve()
                                    }
                                    return Promise.reject(new Error('The two passwords that you entered do not match!'))
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="text-gray-400" />}
                            placeholder="Confirm Password"
                            className="rounded-md h-12"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="w-full h-12 text-lg font-semibold rounded-md bg-blue-600 hover:bg-blue-700"
                        >
                            Register
                        </Button>
                    </Form.Item>
                </Form>
                <div className="text-center text-sm">
                    Already have an account?{' '}
                    <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-800">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    )
}