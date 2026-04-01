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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BrainCircuit, SquarePen } from "lucide-react"
import { courses, type Course } from "@/lib/courses-data"
import { useMutation } from "@tanstack/react-query"
import { CourseService } from "@/services/courses/courses.service"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  selectedCourse?: Course | null
  onSelectCourse?: (course: Course) => void
}

export function AppSidebar({ selectedCourse, onSelectCourse, ...props }: AppSidebarProps) {
  const [topic, setTopic] = React.useState("")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [jsonOutput, setJsonOutput] = React.useState<string | null>(null)

  const generateCourseMutation = useMutation({
    mutationFn: (payload: { topic: string }) => CourseService.generateCourse(payload),
  })
  const isLoading = generateCourseMutation.isPending

  const handleCreateCourse = () => {
    if (!topic.trim()) return

    setJsonOutput(null)

    generateCourseMutation.mutate(
      { topic },
      {
        onSuccess: (data) => {
          console.log("Course API response:", data)
          setJsonOutput(JSON.stringify(data, null, 2))
        },
        onError: (error) => {
          console.error("Error creating course:", error)
          setJsonOutput(JSON.stringify({ error: "Failed to generate course" }, null, 2))
        },
      }
    )
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
                    {jsonOutput && (
                      <div className="mt-2 max-h-[300px] overflow-auto rounded-md bg-muted p-4">
                        <pre className="text-xs text-muted-foreground whitespace-pre-wrap">{jsonOutput}</pre>
                      </div>
                    )}
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
          <SidebarGroupLabel>Your Courses</SidebarGroupLabel>
          <SidebarMenu>
            {courses.map((course) => {
              const Icon = course.icon
              const isActive = selectedCourse?.id === course.id
              return (
                <SidebarMenuItem key={course.id}>
                  <SidebarMenuButton
                    isActive={isActive}
                    onClick={() => onSelectCourse && onSelectCourse(course)}
                    className="cursor-pointer"
                  >
                    <Icon className={`size-4 ${course.color}`} />
                    <span>{course.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
