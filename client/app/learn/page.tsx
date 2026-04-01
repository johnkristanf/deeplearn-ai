import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap } from "lucide-react"

export default function LearnPage() {
    const courses = []
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold tracking-tight">Courses (DIRI TONG MGA COURSES CARDS) </h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                    Welcome to DeepLearn. Select a course from the sidebar or click a card below to explore modules and lessons.
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {courses.map((course) => {
                    const Icon = course.icon
                    return (
                        <Card key={course.id} className="group hover:border-primary/50 transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <div className="p-2 w-fit rounded-lg bg-background border border-border group-hover:border-primary/50 transition-colors">
                                    <Icon className={`size-6 ${course.color}`} />
                                </div>
                                <CardTitle className="mt-4 text-xl">{course.title}</CardTitle>
                                <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-1">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                                        {course.modules.length} Modules
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {course.modules.map((mod) => (
                                            <span
                                                key={mod.id}
                                                className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-border/50 group-hover:ring-primary/20 transition-all"
                                            >
                                                {mod.title}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <section className="mt-12 p-8 rounded-2xl bg-muted/30 border border-border/50 flex flex-col md:flex-row items-center gap-8">
                <div className="p-4 rounded-full bg-primary/10 text-primary">
                    <GraduationCap className="size-12" />
                </div>
                <div className="flex-1 space-y-2">
                    <h2 className="text-2xl font-semibold">Select a course to begin</h2>
                    <p className="text-muted-foreground">
                        Click any course in the sidebar to browse its modules and lessons. Each module contains structured lessons designed for deep learning.
                    </p>
                </div>
            </section>
        </div>
    )
}
