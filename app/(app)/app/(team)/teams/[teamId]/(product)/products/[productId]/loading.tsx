import { Skeleton } from "@/components/ui/skeleton";

function SkeletonProductHeader() {
	return (
		<div className="flex items-center justify-between px-4">
			<div className="space-y-2">
				<Skeleton className="h-7 w-[200px]" />
				<Skeleton className="h-4 w-[150px]" />
			</div>
			<div className="flex gap-2">
				<Skeleton className="h-10 w-[100px]" />
				<Skeleton className="h-10 w-10" />
			</div>
		</div>
	);
}

function SkeletonProductCreator() {
	return (
		<div className="flex items-center gap-3">
			<Skeleton className="h-10 w-10 rounded-full" />
			<div className="space-y-2">
				<Skeleton className="h-5 w-[120px]" />
				<Skeleton className="h-4 w-[80px]" />
			</div>
		</div>
	);
}

function SkeletonProductInfo() {
	return (
		<div className="space-y-4">
			<Skeleton className="h-4 w-full" />
			<Skeleton className="h-4 w-[90%]" />
			<Skeleton className="h-4 w-[85%]" />
			<div className="pt-4 space-y-2">
				<Skeleton className="h-4 w-[120px]" />
				<div className="flex gap-2">
					<Skeleton className="h-8 w-20" />
					<Skeleton className="h-8 w-20" />
					<Skeleton className="h-8 w-20" />
				</div>
			</div>
		</div>
	);
}

export default function ProductLoading() {
	return (
		<article className="space-y-6">
			<SkeletonProductHeader />
			<main className="px-4 space-y-6">
				<SkeletonProductCreator />
				<SkeletonProductInfo />
			</main>
		</article>
	);
}
