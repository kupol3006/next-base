'use client'

import React, { useState } from 'react'
import { Modal, Steps, Input, Button, Form, message, notification } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined, SafetyOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { sendRequest } from '@/utils/api'

interface VerificationModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function ModalChangePassword({ isOpen, onClose }: VerificationModalProps) {
    const [currentStep, setCurrentStep] = useState(0)
    const [form] = Form.useForm()
    const [userEmail, setUserEmail] = useState('')

    const handleNextStep = async () => {
        const res = await sendRequest<IBackendRes<Ilogin>>({
            method: 'POST',
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`,
            body: {
                email: form.getFieldValue('email')
            }
        })
        console.log(res);
        if (res?.data) {
            setUserEmail(res?.data?.email)
            message.info('Verification code sent. Please check your email.')
            setCurrentStep(1)
        }
        else {
            notification.error({
                message: 'Send email failed',
                description: res?.message || 'Something went wrong'
            })
        }
    }

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const res = await sendRequest<IBackendRes<Ilogin>>({
                method: 'POST',
                url: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/change-password`,
                body: {
                    email: userEmail,
                    code: values.verificationCode,
                    password: values.password
                }
            });

            console.log(res);
            if (res?.data) {
                message.success('Password changed successfully. Please login again.')
                setCurrentStep(2)
            } else {
                notification.error({
                    message: 'Password change failed',
                    description: res?.message || 'Something went wrong'
                })
            }
        } catch (errorInfo) {
            console.log('Validation failed:', errorInfo);
        }
    }

    const steps = [
        {
            title: 'Confirm Email',
            icon: <UserOutlined />,
            content: (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700">Confirm Your Email</h3>
                    <p className="text-sm text-gray-500">We'll send a verification code to this email address.</p>
                    <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}>
                        <Input
                            prefix={<MailOutlined className="text-blue-500" />}
                            placeholder="Enter your email"
                            className="w-full h-12 text-lg rounded-lg border-2 border-gray-300 focus:border-blue-500 transition-colors"
                        />
                    </Form.Item>
                    <Button
                        type="primary"
                        onClick={handleNextStep}
                        className="w-full h-12 text-lg font-semibold rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors"
                    >
                        Send Verification Code
                    </Button>
                </div>
            ),
        },
        {
            title: 'Verify & Set Password',
            icon: <SafetyOutlined />,
            content: (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700">Verify and Set New Password</h3>
                    <p className="text-sm text-gray-500">Enter the verification code sent to your email and set a new password.</p>
                    <Form.Item
                        name="verificationCode"
                        rules={[{ required: true, message: 'Please input the verification code!' }]}
                    >
                        <Input
                            prefix={<SafetyOutlined className="text-blue-500" />}
                            placeholder="Verification Code"
                            className="w-full h-12 text-lg rounded-lg border-2 border-gray-300 focus:border-blue-500 transition-colors"
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: 'Please input your new password!' },
                            { min: 8, message: 'Password must be at least 8 characters long' },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="text-blue-500" />}
                            placeholder="New Password"
                            className="w-full h-12 text-lg rounded-lg border-2 border-gray-300 focus:border-blue-500 transition-colors"
                        />
                    </Form.Item>
                    <Form.Item
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Please confirm your new password!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve()
                                    }
                                    return Promise.reject(new Error('The two passwords do not match!'))
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="text-blue-500" />}
                            placeholder="Confirm New Password"
                            className="w-full h-12 text-lg rounded-lg border-2 border-gray-300 focus:border-blue-500 transition-colors"
                        />
                    </Form.Item>
                    <Button
                        type="primary"
                        onClick={handleSubmit}
                        className="w-full h-12 text-lg font-semibold rounded-lg bg-green-500 hover:bg-green-600 transition-colors"
                    >
                        Verify and Set Password
                    </Button>
                </div>
            ),
        },
        {
            title: 'Done',
            icon: <CheckCircleOutlined />,
            content: (
                <div className="space-y-4 text-center">
                    <CheckCircleOutlined className="text-6xl text-green-500" />
                    <h3 className="text-2xl font-semibold text-gray-700">Password Changed Successfully</h3>
                    <p className="text-sm text-gray-500">Your password has been updated. You can now log in with your new password.</p>
                    <Button
                        type="primary"
                        onClick={() => { onClose(); setCurrentStep(0); form.resetFields() }}
                        className="w-full h-12 text-lg font-semibold rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors"
                    >
                        Close
                    </Button>
                </div>
            ),
        },
    ]

    return (
        <Modal
            title={
                <div >
                    <h2 className='mb-2'>Change Password</h2>
                    <Steps
                        current={currentStep}
                        items={steps.map((step) => ({
                            title: step.title,
                            icon: step.icon,
                        }))}
                        className="mb-8"
                    />
                </div>
            }
            open={isOpen}
            onCancel={() => { onClose(); setCurrentStep(0); form.resetFields() }}
            footer={null}

            width={480}
            className="rounded-2xl overflow-hidden"
            maskClosable={false}
        >
            <Form form={form} layout="vertical" className="p-4 bg-gray-50 rounded-xl">
                {steps[currentStep].content}
            </Form>
        </Modal>
    )
}