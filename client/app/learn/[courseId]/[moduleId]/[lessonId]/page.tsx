"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import ReactMarkdown from "react-markdown"
import {
    BookOpen,
    Lightbulb,
    Target,
    ArrowRight,
    CheckCircle2,
    Zap,
    Globe,
    StickyNote
} from "lucide-react"
import { CourseService } from "@/services/courses/courses.service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export default function LessonPage() {
    const params = useParams()
    const courseId = params?.courseId as string
    const moduleId = params?.moduleId as string
    const lessonId = params?.lessonId as string

    const { data: dbCourses = [], isLoading } = useQuery({
        queryKey: ["courses"],
        queryFn: () => CourseService.getCourses(),
    })

    const course = dbCourses.find((c: any) => c.id.toString() === courseId)
    const module = course?.modules.find((m: any) => m.id.toString() === moduleId)
    const lesson = module?.lessons.find((l: any) => l.id.toString() === lessonId)

    if (isLoading) {
        return <LessonSkeleton />
    }

    if (!lesson) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
                <div className="p-4 rounded-full bg-muted">
                    <BookOpen className="size-12 text-muted-foreground" />
                </div>
                <h1 className="text-2xl font-bold">Lesson not found</h1>
                <p className="text-muted-foreground">Select a lesson from the sidebar to start learning.</p>
            </div>
        )
    }

    const { content } = lesson

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="space-y-4">
                <Badge variant="outline" className="px-3 py-1 text-xs uppercase tracking-wider bg-primary/5 text-primary border-primary/20">
                    {module?.title}
                </Badge>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                    {lesson.title}
                </h1>
            </div>

            {/* 1. Hook (Engagement) */}
            {content?.hook && (
                <section className="relative p-8 rounded-3xl bg-muted/30 border border-border/50 overflow-hidden group">
                    <div className="relative flex flex-col gap-4">
                        <div className="flex items-center gap-2 text-primary font-semibold uppercase tracking-widest text-xs">
                            <Zap className="size-4" />
                            <span>Context</span>
                        </div>
                        <div className="text-xl md:text-2xl font-medium leading-relaxed italic text-foreground/90">
                            <ReactMarkdown>{content.hook}</ReactMarkdown>
                        </div>
                    </div>
                </section>
            )}

            <div className="grid gap-12">
                {/* 2. Objectives (Clarification) */}
                {content?.objectives && content.objectives.length > 0 && (
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-muted-foreground font-semibold uppercase tracking-widest text-xs">
                            <Target className="size-4" />
                            <span>Your Goals</span>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {content.objectives.map((obj, i) => (
                                <Card key={i} className="bg-card/50 border-border/40 hover:border-primary/30 transition-all duration-300">
                                    <CardContent className="p-4 flex items-start gap-3">
                                        <div className="mt-1 p-1 rounded-full bg-primary/10 text-primary">
                                            <CheckCircle2 className="size-3" />
                                        </div>
                                        <span className="text-sm font-medium"><ReactMarkdown>{obj}</ReactMarkdown></span>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                )}

                {/* 3. Analogy (Bridge) */}
                {content?.analogy && (
                    <Card className="bg-primary/5 border-primary/10 overflow-hidden">
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-2 text-primary font-semibold uppercase tracking-widest text-xs">
                                <Lightbulb className="size-4" />
                                <span>Mental Model</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg leading-relaxed text-foreground/80 prose prose-invert max-w-none">
                                <ReactMarkdown>{content.analogy}</ReactMarkdown>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* 4. Lecture (Deep Dive) */}
                {content?.lecture && (
                    <section className="space-y-6">
                        <div className="flex items-center gap-2 text-muted-foreground font-semibold uppercase tracking-widest text-xs">
                            <BookOpen className="size-4" />
                            <span>The Concept</span>
                        </div>
                        <div className="prose prose-invert max-w-none prose-headings:font-bold prose-p:text-foreground/80 prose-li:text-foreground/80 prose-strong:text-primary prose-code:text-primary-foreground prose-code:bg-primary/20 prose-code:px-1 prose-code:rounded prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border/50">
                            <ReactMarkdown>{content.lecture}</ReactMarkdown>
                        </div>
                    </section>
                )}

                {/* 5. Real-world Example (Application) */}
                {content?.real_world_example && (
                    <section className="p-8 rounded-3xl bg-secondary/20 border border-secondary/20 space-y-4">
                        <div className="flex items-center gap-2 text-primary font-semibold uppercase tracking-widest text-xs">
                            <Globe className="size-4" />
                            <span>In Action</span>
                        </div>
                        <div className="prose prose-invert max-w-none italic text-foreground/90">
                            <ReactMarkdown>{content.real_world_example}</ReactMarkdown>
                        </div>
                    </section>
                )}

                {/* 6. Summary (Retention) */}
                {content?.summary && (
                    <Card className="bg-muted/10 border-border/30">
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-2 text-muted-foreground font-semibold uppercase tracking-widest text-xs">
                                <StickyNote className="size-4" />
                                <span>Quick Recap</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="prose prose-invert max-w-none text-muted-foreground">
                                <ReactMarkdown>{content.summary}</ReactMarkdown>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Bottom Navigation */}
            <div className="pt-12 border-t flex justify-between items-center">
                <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
                    <ArrowRight className="size-4 rotate-180" />
                    Previous Lesson
                </Button>
                <Button className="gap-2">
                    Next Lesson
                    <ArrowRight className="size-4" />
                </Button>
            </div>
        </div>
    )
}

function LessonSkeleton() {
    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <div className="space-y-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-12 w-3/4" />
            </div>
            <Skeleton className="h-40 w-full rounded-3xl" />
            <div className="grid gap-8">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
    )
}
