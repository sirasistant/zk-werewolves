import withTheme from './theme/withTheme';
import { AppContainer } from './App.styles';
import { WagmiConfig, createClient, useAccount } from 'wagmi';
import { getDefaultProvider } from 'ethers';
import ConnectWallet from './connectWallet';
 
const client = createClient({
  autoConnect: true,
  provider: getDefaultProvider(),
});

function App() {
  const { isConnected } = useAccount();
  return (
    <WagmiConfig client={client}>
      <AppContainer>
        { !isConnected && <ConnectWallet/> }
      </AppContainer>
    </WagmiConfig>
  );
}

export default withTheme(App);
