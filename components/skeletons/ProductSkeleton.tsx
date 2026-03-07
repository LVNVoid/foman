import { Skeleton } from "@/components/ui/skeleton";

export function ProductSkeleton() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-full rounded-lg border bg-card shadow-sm">
                    <div className="relative w-full aspect-square bg-muted rounded-t-lg overflow-hidden">
                        <Skeleton className="h-full w-full" />
                    </div>

                    <div className="p-4 space-y-3">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />

                        <div className="flex items-center justify-between pt-2 gap-3">
                            <div className="flex-1 space-y-1">
                                <Skeleton className="h-3 w-10" />
                                <Skeleton className="h-6 w-24" />
                            </div>
                            <Skeleton className="h-10 w-12 rounded-xl" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
