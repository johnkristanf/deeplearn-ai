"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import { type Course } from "@/lib/courses-data"

interface CourseSidebarProps extends React.ComponentProps<typeof Sidebar> {
    course: Course
}

export function CourseSidebar({ course, ...props }: CourseSidebarProps) {
    const Icon = course.icon

    return (
        <Sidebar collapsible="none" className="border-l w-64 shrink-0" {...props}>
            <SidebarHeader className="px-4 py-3 border-b">
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-md bg-background border border-border`}>
                        <Icon className={`size-4 ${course.color}`} />
                    </div>
                    <span className="font-semibold text-sm">{course.title}</span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Modules</SidebarGroupLabel>
                    <SidebarMenu>
                        {course.modules.map((module) => (
                            <Collapsible key={module.id} defaultOpen className="group/collapsible">
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton className="font-medium">
                                            <span>{module.title}</span>
                                            <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {module.lessons.map((lesson) => (
                                                <SidebarMenuSubItem key={lesson.id}>
                                                    <SidebarMenuSubButton asChild>
                                                        <Link href={lesson.url}>{lesson.title}</Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}
