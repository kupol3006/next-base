'use client'

import { useState } from 'react'
import { Layout, Dropdown, Avatar } from 'antd'
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons'
import { signOut } from 'next-auth/react'

const { Header } = Layout

export default function AdminHeader(prop: any) {
    const [isOpen, setIsOpen] = useState(false)
    // const { data: session, status } = useSession();
    const session = prop.session

    const menuItems = [
        { key: 'profile', icon: <UserOutlined />, label: 'My Profile' },
        { key: 'settings', icon: <SettingOutlined />, label: 'Settings' },
        { key: 'logout', icon: <LogoutOutlined />, label: <span className='w-full' onClick={() => signOut()}>Log out</span>, danger: true },
    ]

    return (
        <Header
            className="flex justify-end items-center pr-4"
            style={{ background: '#fff' }}
        >
            <Dropdown
                menu={{ items: menuItems }}
                trigger={['click']}
                open={isOpen}
                onOpenChange={setIsOpen}
                overlayClassName="w-0"
            >
                <div className="flex items-center cursor-pointer">
                    <Avatar
                        src={session?.user.image || ''}
                        size={40}
                        className="bg-purple-200"
                    />
                    <div className="ml-2 text-right">
                        <p className="text-sm font-medium text-gray-900">{session?.user.username || session?.user.name}</p>
                        <p className="text-xs text-gray-500">{session?.user.email}</p>
                    </div>
                </div>
            </Dropdown>
        </Header>
    )
}