import OrderSiderbar from "@/components/order/OrderSiderbar";
import OrderSummary from "@/components/order/OrderSummary";
import ToastNotification from "@/components/ui/ToastNotification";

export const dynamic = 'force-dynamic'


export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {

        return(
            <>
                <div className="min-h-screen bg-slate-100 md:flex">
                    <OrderSiderbar />
                 

                <main className="md:flex-1 md:h-screen md:overflow-y-scroll p-5 lg:p-8">
                    {children}
                </main>

                    <OrderSummary/>
                </div>

                <ToastNotification/>
            </>
        )
  }
