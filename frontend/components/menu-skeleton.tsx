import { Skeleton } from "@/components/ui/skeleton"

export function MenuSkeleton() {
    return (
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 h-full flex flex-col">
            {/* Image Skeleton */}
            <div className="relative aspect-square w-full">
                <Skeleton className="h-full w-full bg-white/10" />
            </div>

            {/* Content Skeleton */}
            <div className="flex-1 flex flex-col p-5 min-[431px]:p-3 md:p-5">
                {/* Title */}
                <Skeleton className="h-6 w-3/4 mb-2 bg-white/10" />

                {/* Description/Tags (hidden details) */}

                {/* Bottom Section: Price & Button */}
                <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/10 mt-auto">
                    {/* Price */}
                    <Skeleton className="h-6 w-24 bg-white/10" />

                    {/* Add Button */}
                    <Skeleton className="h-11 w-24 rounded-full bg-white/10" />
                </div>
            </div>
        </div>
    )
}

export function MenuGridSkeleton() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6 lg:gap-8 px-2 md:px-0">
            {Array.from({ length: 6 }).map((_, i) => (
                <MenuSkeleton key={i} />
            ))}
        </div>
    )
}
