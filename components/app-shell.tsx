import { Sidebar } from "@/components/sidebar";
import { TopHeader } from "@/components/top-header";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground lab-grid">
      <Sidebar />
      <div className="lg:pl-72">
        <TopHeader />
        <main className="mx-auto w-full max-w-[1720px] px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
