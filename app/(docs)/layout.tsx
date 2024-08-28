import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import React from "react";
interface DocsProps {
	children: React.ReactNode;
}
const Docs = ({ children }: DocsProps) => {
	return (
		<>
			<SiteHeader />
			<main className="flex-1">{children}</main>
			<SiteFooter />
		</>
	);
};

export default Docs;
