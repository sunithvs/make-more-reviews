import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="container relative px-4 mx-auto z-10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-12">
              <div className="flex items-center justify-center gap-2">
                {Array(5).fill(0).map((_, i) => (
                  <Skeleton key={i} className="w-8 h-8 md:w-12 md:h-12 rounded-full" />
                ))}
              </div>
            </div>
            <Skeleton className="h-16 md:h-24 mb-6 mx-auto max-w-lg" />
            <Skeleton className="h-20 mb-8 mx-auto max-w-md" />
            <div className="flex gap-4 justify-center">
              <Skeleton className="h-12 w-40" />
              <Skeleton className="h-12 w-40" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
