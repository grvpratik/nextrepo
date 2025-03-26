import React from "react";

const AiLayout = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return (
		<main className=" flex ">
			<aside className="fixed h-full top-0 bottom-0 left-0" >sidebar</aside>
			<div className="flex w-full flex-col">{children}</div>
		</main>
	);
};

export default AiLayout;
