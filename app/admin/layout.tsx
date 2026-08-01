import ToastNotification from "@/components/ui/ToastNotification";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <div className="min-h-screen bg-slate-100 md:flex">
                <aside className="border-slate-200 bg-white/90 backdrop-blur md:h-screen md:w-80 md:border-r">
                    <AdminSidebar />
                </aside>

                <main className="md:flex-1 md:h-screen md:overflow-y-scroll bg-slate-100 p-5 lg:p-8">
                    {children}
                </main>
            </div>

            <ToastNotification />
        </>
    )
}
