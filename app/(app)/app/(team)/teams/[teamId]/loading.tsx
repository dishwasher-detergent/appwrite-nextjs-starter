import { Skeleton } from "@/components/ui/skeleton";

function SkeletonTeamHeader() {
	return (
		<div className="flex items-center justify-between px-4">
			<div className="space-y-2">
				<Skeleton className="h-7 w-[250px]" />
				<Skeleton className="h-4 w-[180px]" />
			</div>
			<div className="flex gap-2">
				<Skeleton className="h-10 w-[120px]" />
				<Skeleton className="h-10 w-10" />
			</div>
		</div>
	);
}

function SkeletonTeamActions() {
	return (
		<div className="flex gap-2">
			<Skeleton className="h-9 w-[100px]" />
			<Skeleton className="h-9 w-[100px]" />
			<Skeleton className="h-9 w-9" />
		</div>
	);
}

function SkeletonTeamAdmins() {
	return (
		<div className="space-y-4">
			<Skeleton className="h-5 w-[100px]" />
			<div className="flex flex-wrap gap-3">
				{[...Array(4)].map((_, i) => (
					<div key={i} className="flex items-center gap-2">
						<Skeleton className="h-8 w-8 rounded-full" />
						<Skeleton className="h-4 w-[100px]" />
					</div>
				))}
			</div>
		</div>
	);
}

function SkeletonTeamDescription() {
	return (
		<div className="space-y-4">
			<Skeleton className="h-4 w-full" />
			<Skeleton className="h-4 w-[90%]" />
			<Skeleton className="h-4 w-[85%]" />
		</div>
	);
}

function SkeletonTeamContent() {
	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<Skeleton className="h-5 w-[150px]" />
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{[...Array(6)].map((_, i) => (
						<Skeleton key={i} className="h-[120px] w-full rounded-lg" />
					))}
				</div>
			</div>
		</div>
	);
}

export default function TeamLoading() {
	return (
		<article className="space-y-6">
			<SkeletonTeamHeader />
			<main className="px-4 space-y-8">
				<SkeletonTeamActions />
				<SkeletonTeamDescription />
				<SkeletonTeamAdmins />
				<SkeletonTeamContent />
			</main>
		</article>
	);
}
