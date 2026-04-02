"use client"

import * as React from "react"
import Link from "next/link"
import { AppSidebar } from "@/components/app-sidebar"
import { CourseSidebar } from "@/components/course-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { CourseService } from "@/services/courses/courses.service"
import { type Course } from "@/lib/courses-data"

export default function LearnLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const params = useParams()
    const courseId = params?.courseId as string
    const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(null)

    const { data: dbCourses = [] } = useQuery({
        queryKey: ["courses"],
        queryFn: () => CourseService.getCourses(),
    })

    // Sync selected course from URL
    React.useEffect(() => {
        if (courseId && dbCourses.length > 0) {
            const course = dbCourses.find((c: any) => c.id.toString() === courseId)
            if (course) {
                // Map API title to lib topic if necessary, or just use course
                setSelectedCourse({
                    ...course,
                })
            }
        }
    }, [courseId, dbCourses])

    return (
        <SidebarProvider>
            {/* Primary Sidebar: Course list */}
            <AppSidebar
                selectedCourse={selectedCourse}
                onSelectCourse={setSelectedCourse}
            />

            <SidebarInset className="flex flex-row p-0 h-svh overflow-hidden">
                {/* Secondary Sidebar: Modules + Lessons for the selected course */}
                {selectedCourse && (
                    <CourseSidebar course={selectedCourse} />
                )}

                {/* Main content area */}
                <div className="flex flex-1 flex-col overflow-hidden">
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link href="/learn">Courses</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                {selectedCourse && (
                                    <>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            <BreadcrumbPage>{selectedCourse.topic}</BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </>
                                )}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </header>
                    <main className="flex flex-1 flex-col gap-4 p-6 overflow-auto">
                        {children}
                    </main>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
