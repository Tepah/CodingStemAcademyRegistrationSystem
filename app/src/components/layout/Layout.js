"use client";

import React from "react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebars/app-sidebar"
import { Separator } from "@/components/ui/separator";
import { DashboardSidebar } from "@/components/sidebars/DashboardSidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function Layout({ children, breadcrumbs }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background border-b">
          <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
            <SidebarTrigger />
            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-4"
            />
          {breadcrumbs && (
              <Breadcrumb className="justify-start">
                <BreadcrumbList>
                  {breadcrumbs.map((breadcrumb, index) => (
                    <React.Fragment key={index}>
                      <BreadcrumbItem>
                        <BreadcrumbLink href={breadcrumb.href} className={`${index < breadcrumbs.length - 1 ? "text-muted-foreground" : "font-bold text-foreground"}`}>
                          {breadcrumb.name}
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      {index < breadcrumbs.length - 1 && (
                        <BreadcrumbSeparator />
                      )}
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            )}
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}

export function LayoutWithCalendar({ children, breadcrumbs }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background border-b">
          <div className="flex items-center gap-1 px-4 lg:gap-2 lg:px-6">
            <SidebarTrigger />
            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-4"
            />
            {breadcrumbs && (
              <Breadcrumb className="justify-start">
                <BreadcrumbList>
                  {breadcrumbs.map((breadcrumb, index) => (
                    <BreadcrumbItem key={index}>
                       <BreadcrumbLink href={breadcrumb.href} className={`${index < breadcrumbs.length - 1 ? "text-muted-foreground" : "font-bold text-foreground"}`}>
                          {breadcrumb.name}
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            )}
          </div>
        </header>
        {children}
      </SidebarInset>
      <DashboardSidebar />
    </SidebarProvider>
  )
}