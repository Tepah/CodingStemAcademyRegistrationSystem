"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  User2,
  ChevronUp,
  Command
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/router";
import { NavClasses } from "@/components/sidebars/nav-classes";
import axios from "axios";
import config from "@/config";
import NavSecondary from "@/components/sidebars/nav-secondary";
import Link from "next/link";
import { getCurrentSemester } from "@/components/api/api";
import { Skeleton } from "@/components/ui/skeleton";


export function AppSidebar({ ...props }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [classes, setClasses] = useState([]);
  const [semester, setSemester] = useState(null);
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = jwtDecode(token);
      console.log(user)
      setUser(user['sub']);
    } else {
      console.log("Token not found in local storage");
      window.location.href = "/";
    }
    getCurrentSemester().then((sem) => {
      console.log("Semester fetched:", sem);
      setSemester(sem);
    }
    ).catch((error) => {
      console.error("Error fetching semester:", error);
    });
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      axios.get(`${config.backendUrl}/student-classes-by-semester`, {
        params: {
          student_id: user['id'],
          semester_id: semester['id']
        },
      })
        .then((response) => {
          console.log(response.data);
          setClasses(response.data['classes']);
        })
        .catch((error) => {
          console.error("Error fetching classes:", error);
        });
    };

    const fetchClassesTeacher = async () => {
      console.log("Fetching classes for teacher");
      axios.get(`${config.backendUrl}/teacher-classes-by-semester`, {
        params: {
          teacher_id: user['id'],
          semester_id: semester['id'],
        },
      })
        .then((response) => {
          console.log(response.data);
          setClasses(response.data['classes']);
        })
        .catch((error) => {
          console.error("Error fetching classes:", error);
        });
    }

    if (user['id'] && semester) {
      if (user['role'] === 'Student') {
        console.log("Fetching classes for student");
        fetchClasses().then(() => console.log("Fetched classes"));
      } else if (user['role'] === 'Teacher') {
        fetchClassesTeacher().then(() => console.log("Fetched classes for teacher"));
      }
      setLoading(false);
    }
  }, [user, semester]);

  const handleSignOutClick = () => {
    localStorage.removeItem('token');
    router.push("/").then(() => console.log("Redirected to login page"));
  }

  return (
    <Sidebar className="top-[--header-height] !h-[calc(100svh-var(--header-height))]"
      {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="font-semibold text-center">Stem Action Teen Institution</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {(loading && user["role"] !== 'Admin') ? (
          <SidebarGroup>
        <SidebarGroupLabel>
          <span> Classes</span>
        </SidebarGroupLabel>
          <div className="flex flex-col items-center justify-center gap-2">
            <Skeleton className="w-full h-[30px]" />
            <Skeleton className="w-full h-[30px]" />
            <Skeleton className="w-full h-[30px]" />
          </div>
          </SidebarGroup>
        ) :
          user["role"] !== 'Admin' ? (
            <NavClasses classes={classes} />
          ) : null}
        <NavSecondary role={user["role"]} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton>
                <User2 /> {user['first_name'] ? user['first_name'] + " " + user['last_name'] : "User"}
                <ChevronUp className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              className="w-[--radix-popper-anchor-width]"
            >
              <DropdownMenuItem
                onClick={handleSignOutClick}>
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
