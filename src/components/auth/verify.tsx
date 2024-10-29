'use client'

import React, { useState } from 'react'
import { Form, Input, Button, Typography, message, notification } from 'antd'
import { LockOutlined } from '@ant-design/icons'
import { sendRequest } from '@/utils/api'
import { useRouter } from 'next/navigation'

const { Title, Text } = Typography

export default function Verify(props: any) {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const { id } = props;
    const router = useRouter()

    const onFinish = async (values: { id: string; code: string }) => {
        setLoading(true)
        try {
            // Simulating API call to verify the code
            await new Promise(resolve => setTimeout(resolve, 700))
            console.log('Verification code submitted:', values.code)

            // Here you would typically redirect the user or update their account status
            const res = await sendRequest<IBackendRes<Ilogin>>({
                method: 'POST',
                url: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/check-code`,
                body: {
                    id: values.id,
                    code: values.code
                }
            })
            console.log(res);
            if (res?.data) {
                router.push(`/auth/login`)
                message.success('Verification successful. Please login.')
            }
            else {
                notification.error({
                    message: 'Verification failed',
                    description: res?.message || 'Something went wrong'
                })
            }
        } catch (error) {
            message.error('Verification failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-cyan-50 to-blue-50 p-4">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <div className="text-center">
                    <Title level={2} className="text-3xl font-bold text-gray-900">
                        Verify Your Email
                    </Title>
                    <Text className="text-sm text-gray-600">
                        We've sent a verification code to your email. Please enter it below.
                    </Text>
                </div>

                <Form
                    form={form}
                    name="verification"
                    onFinish={onFinish}
                    layout="vertical"
                    className="mt-8 space-y-6"
                >
                    <Form.Item
                        name="id"
                        initialValue={id}
                    >
                        <Input
                            className="rounded-md h-12"
                            disabled
                        />
                    </Form.Item>

                    <Form.Item
                        name="code"
                        rules={[{ required: true, message: 'Please input the verification code!' }]}
                    >
                        <Input
                            prefix={<LockOutlined className="text-gray-400" />}
                            placeholder="Verification code"
                            className="rounded-md h-12"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="w-full h-12 text-lg font-semibold rounded-md bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            loading={loading}
                        >
                            Verify
                        </Button>
                    </Form.Item>
                </Form>

                <div className="text-center">
                    <Text className="text-sm text-gray-600">
                        Didn't receive the code?{' '}
                        <Button type="link" className="p-0 h-auto text-blue-500 hover:text-blue-600">
                            Resend
                        </Button>
                    </Text>
                </div>
            </div>
        </div>
    )
}