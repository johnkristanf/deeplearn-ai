"use client"

import * as React from "react"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { CourseDrawer } from "./course-drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BrainCircuit, SquarePen, BookOpen } from "lucide-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { CourseService } from "@/services/courses/courses.service"
import type { CourseResponse } from "@/types/courses"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  selectedCourse?: any | null
  onSelectCourse?: (course: any) => void
}

export function AppSidebar({ selectedCourse, onSelectCourse, ...props }: AppSidebarProps) {
  const [topic, setTopic] = React.useState("")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
  const [courseData, setCourseData] = React.useState<CourseResponse | null>(null)

  const { data: dbCourses = [] } = useQuery({
    queryKey: ["courses"],
    queryFn: () => CourseService.getCourses(),
  })

  const generateCourseMutation = useMutation({
    mutationFn: (payload: { topic: string }) => CourseService.generateCourse(payload),
  })
  const isLoading = generateCourseMutation.isPending

  const handleCreateCourse = () => {
    if (!topic.trim()) return

    setCourseData(null)

    generateCourseMutation.mutate(
      { topic },
      {
        onSuccess: (data) => {
          console.log("Course API response:", data)
          setCourseData(data)
          setIsDialogOpen(false)
          setIsDrawerOpen(true)
        },
        onError: (error) => {
          console.error("Error creating course:", error)
        },
      }
    )
  }

  const handleSelectCourse = (course: any) => {
    if (onSelectCourse) onSelectCourse(course)
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/learn">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <BrainCircuit className="size-5" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold text-lg tracking-tight">DeepLearn</span>
                  <span className="text-xs text-muted-foreground">Learning Platform</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem className="mb-4">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <SidebarMenuButton size="default" className="mt-1 w-full justify-start gap-2 font-medium border border-border/50 bg-background hover:bg-muted px-3">
                    <SquarePen className="size-4" />
                    <span>New Course</span>
                  </SidebarMenuButton>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>New Course</DialogTitle>
                    <DialogDescription>
                      Enter a topic you want to learn about. We'll generate a custom course for you.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Input
                      id="topic"
                      placeholder="e.g. Quantum Computing, React.js..."
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !isLoading) handleCreateCourse()
                      }}
                      disabled={isLoading}
                    />
                  </div>
                  <DialogFooter>

                    <Button onClick={handleCreateCourse} disabled={isLoading}>
                      {isLoading ? "Generating..." : "Create Course"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </SidebarMenuItem>
          </SidebarMenu>

          {/* Generated Courses */}
          <SidebarGroupLabel>Your Courses</SidebarGroupLabel>
          <SidebarMenu>
            {dbCourses.length > 0 ? (
              dbCourses.map((course: any) => {
                const isActive = selectedCourse?.id === course.id
                return (
                  <SidebarMenuItem key={course.id}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => handleSelectCourse(course)}
                      className="cursor-pointer"
                    >
                      <BookOpen className="size-4 text-primary" />
                      <span>{course.topic}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })
            ) : (
              <p className="px-3 py-2 text-sm text-muted-foreground italic">
                No courses yet. Create one to get started!
              </p>
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />

      <CourseDrawer
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        courseData={courseData}
      />
    </Sidebar>
  )
}

