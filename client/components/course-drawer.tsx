"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CourseService } from "@/services/courses/courses.service"
import { toast } from "sonner"
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import type { CourseResponse } from "@/types/courses"
import ReactMarkdown from "react-markdown"

interface CourseDrawerProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    courseData: CourseResponse | null
}

export function CourseDrawer({ isOpen, onOpenChange, courseData }: CourseDrawerProps) {
    const queryClient = useQueryClient()

    const saveCourseMutation = useMutation({
        mutationFn: async () => {
            if (!courseData) throw new Error("No course data");
            return await CourseService.saveCourse({ course: courseData });
        },
        onSuccess: () => {
            toast.success("Course saved successfully.")
            queryClient.invalidateQueries({ queryKey: ["courses"] })
            onOpenChange(false);
        },
        onError: (error) => {
            console.error("Failed to save course:", error);
            toast.error("Failed to save the course. Please try again.")
        }
    });

    const isSaving = saveCourseMutation.isPending;
    const isAlreadySaved = !!courseData?.id;

    const handleSave = () => {
        saveCourseMutation.mutate();
    };

    return (
        <Drawer open={isOpen} dismissible={false}>
            <DrawerContent
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <div className="mx-auto w-full max-w-5xl h-[85vh] flex flex-col">
                    <DrawerHeader>
                        <DrawerTitle>Generated Course: {courseData?.topic}</DrawerTitle>
                        <DrawerDescription>Review your tailored course outline and content.</DrawerDescription>
                    </DrawerHeader>
                    <ScrollArea className="flex-1 min-h-0 mt-2 mb-4 px-2">
                        {courseData && courseData.modules && courseData.modules.length > 0 ? (
                            <Accordion type="multiple" className="w-full">
                                {courseData.modules.map((module, mIdx) => (
                                    <AccordionItem key={mIdx} value={`module-${mIdx}`}>
                                        <AccordionTrigger className="text-lg font-semibold text-left">
                                            Module {mIdx + 1}: {module.title}
                                        </AccordionTrigger>
                                        <AccordionContent className="pl-4 border-l-2 ml-2 border-muted mt-2">
                                            {module.lessons && module.lessons.length > 0 ? (
                                                <Accordion type="multiple" className="w-full">
                                                    {module.lessons.map((lesson, lIdx) => (
                                                        <AccordionItem key={lIdx} value={`lesson-${mIdx}-${lIdx}`}>
                                                            <AccordionTrigger className="text-md font-medium text-left">
                                                                Lesson {lIdx + 1}: {lesson.title}
                                                            </AccordionTrigger>
                                                            <AccordionContent className="bg-muted/30 p-4 rounded-md mt-2 space-y-4">
                                                                {lesson.content ? (
                                                                    <>
                                                                        <div>
                                                                            <h4 className="font-semibold mb-1">Hook</h4>
                                                                            <p className="text-sm text-muted-foreground">{lesson.content.hook}</p>
                                                                        </div>
                                                                        <div>
                                                                            <h4 className="font-semibold mb-1">Objectives</h4>
                                                                            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                                                                                {lesson.content.objectives.map((obj, i) => (
                                                                                    <li key={i}>{obj}</li>
                                                                                ))}
                                                                            </ul>
                                                                        </div>
                                                                        <div>
                                                                            <h4 className="font-semibold mb-1">Lecture</h4>
                                                                            <div className="text-sm text-muted-foreground leading-relaxed">
                                                                                <ReactMarkdown
                                                                                    components={{
                                                                                        h1: ({ ...props }) => <h1 className="text-2xl font-bold mt-6 mb-4 text-foreground" {...props} />,
                                                                                        h2: ({ ...props }) => <h2 className="text-xl font-bold mt-5 mb-3 text-foreground" {...props} />,
                                                                                        h3: ({ ...props }) => <h3 className="text-lg font-bold mt-4 mb-2 text-foreground" {...props} />,
                                                                                        h4: ({ ...props }) => <h4 className="text-base font-bold mt-4 mb-2 text-foreground" {...props} />,
                                                                                        p: ({ ...props }) => <p className="mb-4 leading-relaxed" {...props} />,
                                                                                        ul: ({ ...props }) => <ul className="list-disc pl-6 mb-4 space-y-1" {...props} />,
                                                                                        ol: ({ ...props }) => <ol className="list-decimal pl-6 mb-4 space-y-1" {...props} />,
                                                                                        li: ({ ...props }) => <li className="mb-1" {...props} />,
                                                                                        strong: ({ ...props }) => <strong className="font-semibold text-foreground" {...props} />,
                                                                                        blockquote: ({ ...props }) => <blockquote className="border-l-4 border-muted-foreground pl-4 italic my-4" {...props} />,
                                                                                    }}
                                                                                >
                                                                                    {lesson.content.lecture}
                                                                                </ReactMarkdown>
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            <h4 className="font-semibold mb-1">Analogy</h4>
                                                                            <p className="text-sm text-muted-foreground">{lesson.content.analogy}</p>
                                                                        </div>
                                                                        <div>
                                                                            <h4 className="font-semibold mb-1">Real World Example</h4>
                                                                            <p className="text-sm text-muted-foreground">{lesson.content.real_world_example}</p>
                                                                        </div>
                                                                        <div>
                                                                            <h4 className="font-semibold mb-1">Summary</h4>
                                                                            <p className="text-sm text-muted-foreground">{lesson.content.summary}</p>
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <p className="text-sm text-muted-foreground italic">No content generated for this lesson.</p>
                                                                )}
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    ))}
                                                </Accordion>
                                            ) : (
                                                <p className="text-sm text-muted-foreground">No lessons in this module.</p>
                                            )}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        ) : (
                            <div className="py-8 text-center text-muted-foreground">
                                No course data available.
                            </div>
                        )}
                    </ScrollArea>
                    <DrawerFooter className="flex flex-row justify-end space-x-2 pb-8">
                        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
                            {isAlreadySaved ? "Close" : "Cancel"}
                        </Button>
                        {!isAlreadySaved && (
                            <Button onClick={handleSave} disabled={isSaving}>
                                {isSaving ? "Saving..." : "Save"}
                            </Button>
                        )}
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
