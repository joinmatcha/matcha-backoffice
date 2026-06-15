"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  BriefcaseBusiness,
  ClipboardList,
  LayoutDashboard,
  LifeBuoy,
  Sparkles,
  SlidersHorizontal,
  Users,
} from "lucide-react"
import { AccountMenu } from "@/components/layout/account-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const navItems = [
  { title: "Vue d'ensemble", url: "/dashboard", icon: LayoutDashboard },
  { title: "Utilisateurs", url: "/dashboard/users", icon: Users },
  { title: "Métiers", url: "/dashboard/jobs", icon: BriefcaseBusiness },
  { title: "Personnalité", url: "/dashboard/personality", icon: Sparkles },
  { title: "Bilan", url: "/dashboard/bilan", icon: ClipboardList },
  {
    title: "Style professionnel",
    url: "/dashboard/work-style",
    icon: SlidersHorizontal,
  },
  { title: "Support", url: "/dashboard/support", icon: LifeBuoy },
  { title: "Statistiques", url: "/dashboard/stats", icon: BarChart3 },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <div className="flex h-24 flex-col justify-center gap-1 px-4">
          <div className="flex items-center">
            <Image
              src="/matcha-logo.svg"
              alt="Matcha"
              width={132}
              height={56}
              className="h-14 w-auto object-contain"
              style={{ width: "auto" }}
              priority
            />
          </div>
          <span className="text-xs font-semibold text-muted-foreground group-data-[collapsible=icon]:hidden">
            Back-office
          </span>
        </div>

        <SidebarGroup className="px-3">
          <SidebarGroupLabel className="text-[11px] font-bold uppercase tracking-normal text-muted-foreground">
            Administration
          </SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => {
              const isActive =
                pathname === item.url ||
                (item.url !== "/dashboard" && pathname.startsWith(item.url))

              return (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    size="lg"
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <AccountMenu />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
