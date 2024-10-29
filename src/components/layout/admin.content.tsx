'use client';
import { Layout } from "antd";
import React from "react";

const AdminContent = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const { Content } = Layout;
    return (
        <Content style={{ padding: '24px 16px 0', minHeight: '83.7%' }}>
            <div
                style={{
                    padding: 24,
                    minHeight: 'calc(100vh - 157px)',
                    background: "#ccc",
                    borderRadius: "8px",
                }}
            >
                {children}
            </div>
        </Content>
    );
};
export default AdminContent;