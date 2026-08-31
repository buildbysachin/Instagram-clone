import Slidebar from "@/component/navigation/slidebar";
import MobileBottomBar from "@/component/navigation/mobileBottomBar";

export default function DashboardLayout({ children }: {children: React.ReactNode;}) {
  return (
      <div className="h-screen w-screen flex overflow-hidden">
        <aside className="hidden md:flex h-full">
          <Slidebar />
        </aside>
        <div
          className="min-h-full flex-1 flex-col overflow-y-auto"
        >
          {children}
        </div>

        <aside className="md:hidden fixed bottom-0 bg-slate-950 border-t flex">
          <MobileBottomBar/>
        </aside>
      </div>

  );
}
