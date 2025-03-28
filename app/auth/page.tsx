import WalletManager from "@/components/embeded-wallet";
import WalletProvider from "@/components/wallet-provider";


export default function Page() {
	return (
		<WalletProvider>
			<WalletManager />
		</WalletProvider>
	);
}
