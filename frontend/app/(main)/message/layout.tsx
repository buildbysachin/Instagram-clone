import MessageUsers from "@/component/modals/messageUser";

export default function MessageLayout({ children }: {children: React.ReactNode;}) {
  return (
      <div className="h-screen w-screen flex overflow-hidden">
        <aside className="hidden md:flex h-full">
          <MessageUsers />
        </aside>
        <div
          className="min-h-full flex-1 flex-col overflow-y-auto"
        >
          {children}
        </div>
      </div>

  );
}