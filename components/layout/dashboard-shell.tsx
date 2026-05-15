import { AppSidebar } from "@/components/layout/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export function DashboardShell({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider className="bg-transparent">
      <AppSidebar />
      <SidebarInset className="bg-transparent">{children}</SidebarInset>
    </SidebarProvider>
  )
}
