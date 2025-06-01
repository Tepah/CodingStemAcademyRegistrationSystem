"use client"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import {BookOpenCheck, CalendarFold, Mail, NotebookPen} from "lucide-react";

const options = [
  { label: 'Assignments', link: '/assignments', icon: NotebookPen},
  { label: 'Grades', link: '/grades', icon:  BookOpenCheck},
  { label: 'Messages', link: '/messages', icon: Mail},
  { label: 'Calendar', link: '/calendar', icon: CalendarFold },
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
                role === "Teacher" && option.label === 'Grades'
              ) && (
              <a href={option.link}>
                <option.icon />
                <span>
                  {option.label}
                </span>
              </a>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
