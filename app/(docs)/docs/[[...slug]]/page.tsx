import {  siteConfig } from "@/config/site";
import { getTableOfContents } from "@/lib/toc";
import { absoluteUrl, cn } from "@/lib/utils";
import { badgeVariants } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mdx } from "@/components/mdx-components";
import { DocPager } from "@/components/pager";


import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRightIcon, ExternalLinkIcon } from "@radix-ui/react-icons";
import { allDocs } from "contentlayer/generated";

import { Contribute } from "@/components/contribute";
import { TableOfContents } from "@/components/toc";
import "@/styles/mdx.css";


interface DocPageProps {
	params: {
		slug: string[];
	};
}

async function getDocFromParams({ params }: DocPageProps) {
	const slug = params.slug?.join("/") || "";
	console.log({ allDocs})
	const doc = allDocs.find((doc) => {
		// console.log({ doc });
		return doc.slugAsParams === slug;
	});
	// console.log(slug);
	console.log(doc);
	if (!doc) {
		return null;
	}

	return doc;
}

export async function generateMetadata({
	params,
}: DocPageProps): Promise<Metadata> {
	const doc = await getDocFromParams({ params });

	if (!doc) {
		return {};
	}

	return {
		title: `${doc.title} | Nxt Repo`,
		description: doc.description,
		openGraph: {
			title: doc.title,
			description: doc.description,
			type: "article",
			url: absoluteUrl(doc.slug),
			images: [
				{
					url: doc.image,
					width: 1200,
					height: 630,
					alt: siteConfig.name,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: doc.title,
			description: doc.description,
			images: [doc.image],
			creator: "@pratik_grv",
		},
	};
}

export async function generateStaticParams(): Promise<
	DocPageProps["params"][]
> {
	return allDocs.map((doc) => ({
		slug: doc.slugAsParams.split("/"),
	}));
}

export default async function DocPage({ params }: DocPageProps) {
	const doc = await getDocFromParams({ params });
	console.log({ doc });
	console.log(params.slug);
	if (!doc || !doc.published) {
		notFound();
	}

	const toc = await getTableOfContents(doc.body.raw);

	return (
		<main
			className={cn("relative py-6 lg:gap-10 lg:py-8 xl:grid ", {
				"xl:grid-cols-[1fr_300px]": doc.toc,
			})}
		>
			<div className="mx-auto w-full min-w-0">
				<div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
					<div className="truncate">Docs</div>
					<ChevronRightIcon className="size-4" />
					<div className="font-medium text-foreground">{doc.title}</div>
				</div>
				<div className="space-y-2">
					<h1 className={cn("scroll-m-20 text-4xl font-bold tracking-tight")}>
						{doc.title}
					</h1>
					{doc.description && (
						<p className="text-balance text-lg text-muted-foreground">
							{doc.description}
						</p>
					)}
				</div>
				{doc.links ? (
					<div className="flex items-center space-x-2 pt-4">
						{doc.links?.doc && (
							<Link
								href=""
								target="_blank"
								rel="noreferrer"
								className={cn(badgeVariants({ variant: "secondary" }), "gap-1")}
							>
								Docs
								<ExternalLinkIcon className="size-3" />
							</Link>
						)}
						{doc.links?.api && (
							<Link
								href=""
								target="_blank"
								rel="noreferrer"
								className={cn(badgeVariants({ variant: "secondary" }), "gap-1")}
							>
								API Reference
								<ExternalLinkIcon className="size-3" />
							</Link>
						)}
					</div>
				) : null}
				<div className="pb-12 pt-8">
					<Mdx code={doc.body.code} />
				</div>
				<DocPager doc={doc} />
			</div>
			{doc.toc && (
				<div className="hidden text-sm xl:block">
					<div className="sticky top-16 -mt-10 pt-4">
						<ScrollArea className="pb-10">
							<div className="space-y-4 sticky top-16 -mt-10 h-[calc(100vh-3.5rem)] py-12">
								<TableOfContents toc={toc} />
								<Contribute doc={doc} />
							</div>
						</ScrollArea>
					</div>
				</div>
			)}

			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(doc.structuredData),
				}}
			/>
		</main>
	);
}
