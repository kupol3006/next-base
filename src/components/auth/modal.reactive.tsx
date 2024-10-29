'use client'

import React, { useState } from 'react'
import { Modal, Steps, Input, Button, message, notification } from 'antd'
import { UserOutlined, SafetyOutlined, CheckOutlined, MailOutlined, SendOutlined } from '@ant-design/icons'
import { sendRequest } from '@/utils/api'

export default function ModalReactive({ isOpen, onClose, email }: { isOpen: boolean, onClose: () => void, email: string }) {
    const [currentStep, setCurrentStep] = useState(0)
    const [verificationCode, setVerificationCode] = useState('')
    const [userId, setUserId] = useState('')

    const handleResend = async () => {
        const res = await sendRequest<IBackendRes<Ilogin>>({
            method: 'POST',
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/retry-active`,
            body: {
                email: email
            }
        })
        console.log(res);
        if (res?.data) {
            setUserId(res?.data?.id)
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

    const handleVerification = async () => {
        const res = await sendRequest<IBackendRes<Ilogin>>({
            method: 'POST',
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/check-code`,
            body: {
                id: userId,
                code: verificationCode
            }
        })
        console.log(res);
        if (res?.data) {
            setCurrentStep(2) // Move to the "Done" step
            message.success('Verification successful. Your account is now active.')
        }
        else {
            notification.error({
                message: 'Verification failed',
                description: res?.message || 'Something went wrong'
            })
        }
    }

    const steps = [
        {
            title: 'Login',
            icon: <UserOutlined />,
            content: (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700">Welcome Back!</h3>
                    <Input
                        prefix={<MailOutlined className="text-blue-500" />}
                        value={email}
                        disabled
                        className="w-full h-12 text-lg rounded-lg border-2 border-gray-300 focus:border-blue-500 transition-colors"
                    />
                    <Button
                        type="primary"
                        onClick={handleResend}
                        icon={<SendOutlined />}
                        className="w-full h-12 text-lg font-semibold rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors"
                    >
                        Send Verification Code
                    </Button>
                </div>
            ),
        },
        {
            title: 'Verification',
            icon: <SafetyOutlined />,
            content: (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700">Enter Verification Code</h3>
                    <p className="text-sm text-gray-500">We've sent a code to your email. Please enter it below.</p>
                    <Input
                        prefix={<SafetyOutlined className="text-blue-500" />}
                        placeholder="Enter code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="w-full h-12 text-lg rounded-lg border-2 border-gray-300 focus:border-blue-500 transition-colors"
                    />
                    <div className="flex space-x-4">
                        <Button
                            type="primary"
                            onClick={handleVerification}
                            className="flex-1 h-12 text-lg font-semibold rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors"
                        >
                            Submit
                        </Button>
                    </div>
                </div>
            ),
        },
        {
            title: 'Done',
            icon: <CheckOutlined />,
            content: (
                <div className="space-y-4 text-center">
                    <CheckOutlined className="text-6xl text-green-500" />
                    <h3 className="text-2xl font-semibold text-gray-700">Verification Complete</h3>
                    <p className="text-sm text-gray-500">Your account has been successfully activated. You can now log in and use all features.</p>
                    <Button
                        type="primary"
                        onClick={onClose}
                        className="w-full h-12 text-lg font-semibold rounded-lg bg-green-500 hover:bg-green-600 transition-colors"
                    >
                        Close and Log In
                    </Button>
                </div>
            ),
        },
    ]

    return (
        <Modal
            title={
                <div>
                    <h2 className='mb-2'>Active Account</h2>
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
            onCancel={onClose}
            footer={null}
            width={480}
            className="rounded-2xl overflow-hidden"
            maskClosable={false}
        >
            <div className="p-4 bg-gray-50 rounded-xl">
                {steps[currentStep].content}
            </div>
        </Modal>
    )
}