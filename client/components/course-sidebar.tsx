"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { BookOpen, ChevronRight } from "lucide-react"

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
import { ScrollArea } from "@/components/ui/scroll-area"
import { type Course } from "@/lib/courses-data"

interface CourseSidebarProps extends React.ComponentProps<typeof Sidebar> {
    course: Course
}

export function CourseSidebar({ course, ...props }: CourseSidebarProps) {
    const params = useParams()
    const activeLessonTag = params?.lessonTag as string

    return (
        <Sidebar collapsible="none" className="border-l w-64 shrink-0" {...props}>
            <SidebarHeader className="px-4 py-3 border-b">
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-md bg-background border border-border`}>
                        <BookOpen className="size-4 text-primary" />
                    </div>
                    <span className="font-semibold text-sm">{course.topic}</span>
                </div>
            </SidebarHeader>
            <SidebarContent className="overflow-hidden">
                <ScrollArea className="h-full">
                    <SidebarGroup>
                        <SidebarGroupLabel>Modules</SidebarGroupLabel>
                        <SidebarMenu>
                            {course.modules.map((module) => (
                                <Collapsible key={module.id} defaultOpen className="group/collapsible">
                                    <SidebarMenuItem className="mb-2">
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton className="font-medium h-auto py-2 items-start gap-3">
                                                <span className="flex-1 text-left whitespace-normal leading-tight">{module.title}</span>
                                                <ChevronRight className="mt-0.5 ml-auto size-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub className="mr-0 pr-0">
                                                {module.lessons.map((lesson) => (
                                                    <SidebarMenuSubItem key={lesson.id}>
                                                        <SidebarMenuSubButton asChild isActive={lesson.tag === activeLessonTag} className="h-auto py-1.5 px-3">
                                                            <Link
                                                                href={`/learn/${course.tag}/${module.tag}/${lesson.tag}`}
                                                                className={`whitespace-normal leading-snug ${lesson.tag === activeLessonTag ? "text-primary font-medium" : ""}`}
                                                            >
                                                                {lesson.title}
                                                            </Link>
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
                </ScrollArea>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}
