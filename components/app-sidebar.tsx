"use client"

import * as React from "react"
import {
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "Matcha Admin Pannel",
    email: "inof@matcha.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Back-office",
      url: "/",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Statistiques",
          url: "/dashboard/stats",
        },
        {
          title: "Utilisateurs",
          url: "/dashboard/users",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <div className="flex items-center gap-2 px-1.5 py-1">
          <img src="/logomatcha.png" alt="logo" className="h-16 w-auto object-contain block" />
        </div>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
