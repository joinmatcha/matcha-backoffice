"use client"

import { useRouter } from "next/navigation"
import { LogOut, UserRound } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { adminApi } from "@/lib/api/admin"

export function AccountMenu() {
  const router = useRouter()

  async function handleLogout() {
    await adminApi.logout().catch(() => null)
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => null)
    router.replace("/login")
    router.refresh()
  }

  return (
    <SidebarMenu className="px-3 pb-3">
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg">
              <Avatar className="size-9 rounded-2xl">
                <AvatarFallback className="rounded-2xl bg-primary text-sm font-bold text-primary-foreground">
                  MA
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Matcha Admin</span>
                <span className="truncate text-xs">Back-office</span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-2xl border-border/80"
            side="right"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="flex items-center gap-2 text-sm font-normal">
              <UserRound className="size-4" />
              Session administrateur
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
