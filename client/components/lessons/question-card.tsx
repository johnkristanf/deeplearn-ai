import * as React from "react"
import { Star, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { LessonQuestion } from "@/types/lessons"

interface QuestionCardProps {
    index: number
    question: LessonQuestion
    value: string
    onChange: (val: string) => void
    onSubmit: () => void
    isSubmitting: boolean
}

export function QuestionCard({ index, question, value, onChange, onSubmit, isSubmitting }: QuestionCardProps) {
    // If the question has already been answered and graded
    if (question.score !== undefined && question.score !== null) {
        return (
            <div className="group rounded-2xl border border-primary/20 bg-primary/5 transition-all duration-300 overflow-hidden">
                <div className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                            <span className="shrink-0 mt-0.5 flex items-center justify-center size-6 rounded-full bg-primary/20 text-primary text-xs font-bold">
                                {index + 1}
                            </span>
                            <p className="text-sm font-medium text-foreground/90 leading-relaxed pr-4">
                                {question.question}
                            </p>
                        </div>
                        <Badge variant="default" className="flex shrink-0 items-center gap-1 shadow-sm px-2.5 py-1">
                            <Star className="size-3 fill-current" />
                            {question.score} / 5
                        </Badge>
                    </div>
                    <div className="pl-9">
                        <div className="p-4 rounded-xl bg-background/60 border border-border/30 text-sm text-foreground/80 italic relative">
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary/40 rounded-l-xl"></div>
                            {question.answer}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Unanswered question view
    const charCount = value.length
    const hasContent = charCount > 0

    return (
        <div className="group rounded-2xl border border-border/40 bg-card/40 hover:border-primary/25 transition-all duration-300 overflow-hidden">
            <div className="p-5 space-y-3">
                <div className="flex items-start gap-3">
                    <span className="shrink-0 mt-0.5 flex items-center justify-center size-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                        {index + 1}
                    </span>
                    <p className="text-sm font-medium text-foreground/90 leading-relaxed">
                        {question.question}
                    </p>
                </div>
                <div className="pl-9 space-y-3">
                    <Textarea
                        placeholder="Write your answer here…"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        rows={3}
                        disabled={isSubmitting}
                        className="resize-none bg-background/50 border-border/30 focus:border-primary/40 placeholder:text-muted-foreground/40 text-sm transition-colors"
                    />
                    <div className="flex justify-between items-center">
                        <span className={`text-xs transition-colors ${hasContent ? "text-primary/60" : "text-muted-foreground/30"}`}>
                            {charCount} {charCount === 1 ? "character" : "characters"}
                        </span>
                        <Button
                            size="sm"
                            disabled={!hasContent || isSubmitting}
                            onClick={onSubmit}
                            className="gap-2 h-8 px-4"
                        >
                            {isSubmitting && <Loader2 className="size-3.5 animate-spin" />}
                            {isSubmitting ? "Grading..." : "Submit Answer"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
