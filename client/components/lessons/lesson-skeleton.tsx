import * as React from "react"
import { Skeleton } from "@/components/ui/skeleton"

export function LessonSkeleton() {
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
                <Skeleton className="h-48 w-full" />
            </div>
        </div>
    )
}
