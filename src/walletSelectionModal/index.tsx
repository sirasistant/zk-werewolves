import MuiDialog from '@mui/material/Dialog';

export type WalletSelectionPropTypes = {
  open: boolean,
};

export default function WalletSelectionModal({ open }: WalletSelectionPropTypes) {
  return <MuiDialog open={open}>
    
  </MuiDialog>;
}