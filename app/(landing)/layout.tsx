import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import React from 'react'

const LandingLayout = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
    return (
			<>
				<SiteHeader />
				<main className="flex-1">{children}</main>
				<SiteFooter />
			</>
		);
};

export default LandingLayout