import { auth } from "@/auth";
import AdminContent from "@/components/layout/admin.content";
import AdminFooter from "@/components/layout/admin.footer";
import AdminHeader from "@/components/layout/admin.header";
import AdminSidebar from "@/components/layout/admin.sidebar";
import React from "react";

const AdminLayout = async ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const session = await auth();

    return (
        <div style={{ minHeight: '100vh', display: 'flex' }}>
            <AdminSidebar />
            <div className="w-full">
                <AdminHeader session={session} />
                <AdminContent>
                    {children}
                </AdminContent>
                <AdminFooter />
            </div>
        </div>
    );
}
export default AdminLayout;