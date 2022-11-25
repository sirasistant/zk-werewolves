import withTheme from './theme/withTheme';
import { AppContainer, ConnectWalletButton, ConnectWalletContainer } from './App.styles';
import WalletSelectionModal from './walletSelectionModal';
function App() {
  return (
    <AppContainer>
      <ConnectWalletContainer>
        <ConnectWalletButton>
          Connect wallet
        </ConnectWalletButton>
        <WalletSelectionModal open={false}/>
      </ConnectWalletContainer>
    </AppContainer>
  );
}

export default withTheme(App);
