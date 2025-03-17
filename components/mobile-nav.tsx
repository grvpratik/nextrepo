"use client";

import { Home, TrendingUp, Search, Settings } from "lucide-react";
import { usePathname } from "next/navigation";

export default function MobileNavigation() {
	const pathname = usePathname();

	const navItems = [
		{
			title: "Home",
			icon: Home,
			href: "/",
		},
		{
			title: "Explore",
			icon: TrendingUp,
			href: "/explore",
		},
		{
			title: "Search",
			icon: Search,
			href: "/search",
		},
		{
			title: "Settings",
			icon: Settings,
			href: "/settings",
		},
	];

	return (
		<div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background z-10">
			<nav className="flex justify-around items-center h-16">
				{navItems.map((item) => (
					<a
						key={item.title}
						href={item.href}
						className={`flex flex-col items-center justify-center w-full h-full ${
							pathname === item.href ? "text-primary" : "text-muted-foreground"
						}`}
					>
						<item.icon className="h-5 w-5" />
						<span className="text-xs mt-1">{item.title}</span>
					</a>
				))}
			</nav>
		</div>
	);
}
