import { ThemeProvider } from "@/components/theme-provider";
import { fontSans } from "@/lib/font";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import "@/styles/mdx.css";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={cn(
					"relative flex min-h-screen w-full flex-col justify-center overflow-x-hidden scroll-smooth bg-background font-sans antialiased",
					fontSans.variable
				)}
			>
				{" "}
				<ThemeProvider attribute="class" defaultTheme="light">
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
