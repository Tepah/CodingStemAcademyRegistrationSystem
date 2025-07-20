"use client"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import Link from "next/link";
import {BookOpenCheck, CalendarFold, Mail, NotebookPen} from "lucide-react";

const options = [
  { label: 'Assignments', link: '/assignments', icon: NotebookPen},
  { label: 'Grades', link: '/grades', icon:  BookOpenCheck},
  { label: 'Messages', link: '/messages', icon: Mail},
  { label: 'Calendar', link: '/calendar', icon: CalendarFold },
  { label: 'Classes', link: '/admin/classes', icon: CalendarFold },
]

export default function NavSecondary({role = null}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <span> Quick Links</span>
      </SidebarGroupLabel>
      <SidebarMenu>
        {options.map((option) => (
          <SidebarMenuItem key={option.label}>
            <SidebarMenuButton asChild>
              {!(role === 'Admin' && option.label === 'Grades' || role === 'Admin' && option.label === 'Assignments' || 
                role === "Teacher" && option.label === 'Grades' || role === 'Admin' && option.label === 'Calendar' || 
                role !== 'Admin' && option.label === 'Classes'
              ) && (
              <Link href={option.link}>
                <option.icon />
                <span>
                  {option.label}
                </span>
              </Link>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
