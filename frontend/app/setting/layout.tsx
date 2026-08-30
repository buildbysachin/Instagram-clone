import Setting from "@/component/settingComponent";

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-full w-full flex overflow-hidden">
            {/* Setting Sidebar */}
            <aside className="hidden md:flex shrink-0 h-full border-r border-slate-800">
                <Setting />
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 h-full overflow-y-auto">
                {children}
            </main>
        </div>
    );
}