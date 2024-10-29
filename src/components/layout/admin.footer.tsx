'use client';
import { Layout } from 'antd';

const AdminFooter = () => {
    const { Footer } = Layout;

    return (
        <Footer style={{ textAlign: 'center', backgroundColor: '#000' }}>
            Kupol ©{new Date().getFullYear()} Created by @Kupol
        </Footer>
    );
}

export default AdminFooter;