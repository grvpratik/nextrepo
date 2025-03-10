import React from "react";
import { Clock, Users, DollarSign, BarChart3, Percent } from "lucide-react";

const CoinCard = ({ coin }: { coin: any }) => {
	// Format numbers with commas and proper decimals
	const formatNumber = (num, decimals = 2) => {
		return num
			? num.toLocaleString(undefined, {
					minimumFractionDigits: decimals,
					maximumFractionDigits: decimals,
			  })
			: "0";
	};

	// Format timestamp to readable date
	const formatDate = (timestamp) => {
		if (!timestamp) return "N/A";
		const date = new Date(timestamp);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	return (
		<div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
			<div className="p-4">
				<div className="flex items-center space-x-4">
					<img
						src={coin.imageUrl || "/api/placeholder/48/48"}
						alt={coin.name}
						className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
					/>
					<div className="flex-1">
						<h3 className="font-bold text-lg text-gray-800">{coin.name}</h3>
						<div className="flex items-center">
							<span className="text-sm font-semibold text-gray-500 mr-2">
								${coin.ticker}
							</span>
							<span className="text-xs bg-blue-100 text-blue-800 py-1 px-2 rounded-full">
								{formatNumber(coin.marketCap || 0, 4)} SOL
							</span>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-3 mt-4">
					<div className="flex items-center space-x-2">
						<Clock size={16} className="text-gray-400" />
						<span className="text-sm text-gray-600">
							{formatDate(coin.creationTime)}
						</span>
					</div>

					<div className="flex items-center space-x-2">
						<Users size={16} className="text-gray-400" />
						<span className="text-sm text-gray-600">
							{formatNumber(coin.numHolders, 0)} holders
						</span>
					</div>

					<div className="flex items-center space-x-2">
						<DollarSign size={16} className="text-gray-400" />
						<span className="text-sm text-gray-600">
							${formatNumber(coin.marketCap)} mcap
						</span>
					</div>

					<div className="flex items-center space-x-2">
						<BarChart3 size={16} className="text-gray-400" />
						<span className="text-sm text-gray-600">
							${formatNumber(coin.volume)} vol
						</span>
					</div>
				</div>

				<div className="mt-4">
					<div className="flex justify-between items-center mb-1">
						<span className="text-xs text-gray-500">Bonding Curve</span>
						<span className="text-xs font-medium text-gray-700">
							{coin.bondingCurveProgress}%
						</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-2">
						<div
							className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
							style={{ width: `${coin.bondingCurveProgress || 0}%` }}
						></div>
					</div>
				</div>

				<div className="mt-4 pt-3 border-t border-gray-100 flex justify-between">
					<div className="text-xs text-gray-500">
						<span className="font-medium text-gray-700">
							{coin.sniperCount || 0}
						</span>{" "}
						snipers
					</div>
					<a
						href={`https://explorer.solana.com/address/${coin.coinMint}`}
						target="_blank"
						rel="noopener noreferrer"
						className="text-xs text-blue-600 hover:text-blue-800"
					>
						View on Explorer →
					</a>
				</div>
			</div>
		</div>
	);
};

const CoinList = ({ data }) => {
	if (!data || data.length === 0) {
		return (
			<div className="text-center py-8 text-gray-500">No coins available</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{data.map((coin) => (
				<CoinCard key={coin.coinMint} coin={coin} />
			))}
		</div>
	);
};

export default CoinList;
