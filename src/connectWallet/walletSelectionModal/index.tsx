import { Modal, ModalContainer, Title, WalletItem, WalletListContainer } from './index.styles';

export type WalletSelectionPropTypes = {
  open: boolean,
};

export default function WalletSelectionModal({ open }: WalletSelectionPropTypes) {
  return <Modal open={open}>
    <ModalContainer data-augmented-ui="tl-2-clip-y tr-2-clip-y br-2-clip-y bl-2-clip-y border">
      <Title>Select your wallet</Title>
      <WalletListContainer>
        <WalletItem data-augmented-ui="br-clip border">Metamask</WalletItem>
        <WalletItem data-augmented-ui="br-clip border">WalletConnect</WalletItem>
      </WalletListContainer>
    </ModalContainer>
  </Modal>;
}