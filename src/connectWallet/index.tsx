import { useState } from 'react';
import { ConnectWalletButton, ConnectWalletContainer } from './index.styles';
import WalletSelectionModal from './walletSelectionModal';

export default function ConnectWallet() {
  const [selecting, setSelecting] = useState(false);
  return <ConnectWalletContainer>
    <ConnectWalletButton onClick={()=> setSelecting(true)}>
        Connect wallet
    </ConnectWalletButton>
    <WalletSelectionModal open={selecting}/>
  </ConnectWalletContainer>;
}