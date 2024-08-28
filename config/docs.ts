import { MainNavItem, SidebarNavItem } from "@/types";

interface DocsConfig {
	mainNav: MainNavItem[];
	sidebarNav: SidebarNavItem[];
}

export const docsConfig: DocsConfig = {
	mainNav: [
		{
			title: "Components",
			href: "/docs/components",
		},
		{
			title: "Themes",
			href: "/themes",
		},
		{
			title: "Resources",
			href: "/resources",
			external: false,
		},
	],
	sidebarNav: [
		{
			title: "Getting Started",
			items: [
				{
					title: "Introduction",
					href: "/docs/introduction",
					items: [],
				},
				{
					title: "Installation",
					href: "/docs/installation",
					
				},
				
			],
		},

		{
			title: "Authentication",
			items: [
				{
					title: "Introduction",
					href: "/docs/auth/introduction",
					items: [],
				},
				{
					title: "Google 0auth",
					href: `/docs/auth/google`,
					items: [],
					label: "New",
				},
				{
					title: "Credentails",
					href: `/docs/auth/credentails`,
					items: [],
					label: "Comming soon",
					disabled: true,
				},
				{
					title: "Magic links",
					href: `/docs/auth/magiclink`,
					items: [],
					label: "Comming soon",
					disabled: true,
				},
			],
		},
		{
			title: "Components",
			items: [
				{
					title: "Marquee",
					href: `/docs/components/marquee`,
					items: [],
				},
			],
		},

		// {
		// 	title: "Buttons",
		// 	items: [
		// 		{
		// 			title: "Shimmer Button",
		// 			href: `/docs/components/shimmer-button`,
		// 			items: [],
		// 		},
		// 	],
		// },
	],
};
