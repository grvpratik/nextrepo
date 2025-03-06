
import { fontSans } from "@/lib/font";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";


export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={cn(
					"relative flex min-h-screen w-full flex-col  overflow-x-hidden scroll-smooth bg-background font-sans antialiased",
					fontSans.variable
				)}
			>
				{" "}
				
					{children}
				
			</body>
		</html>
	);
}
