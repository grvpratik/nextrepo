"use client";
import React, { useEffect, useState } from "react";
import CoinList from "./ui/coin-card";

const PumpFunExplore = () => {
	console.log("render");
	const [data, setData] = useState<any[]>([]); // Properly type as array

	const getData = async () => {
		try {
			const result = await fetch("/api/pf");
			const res: any[] = await result.json();
			setData(res); // Spread both arrays correctly
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	useEffect(() => {
		getData(); // Initial data fetch

		const timer = setInterval(() => getData(), 5000);
		return () => clearInterval(timer);
	}, []);

	return (
		<div className="w-full h-full flex flex-col">
            
			{data.length > 0 && <CoinList data={data} />}
		</div>
	);
};

export default PumpFunExplore;
