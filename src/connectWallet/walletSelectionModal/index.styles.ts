import styled from 'styled-components';
import { Theme } from '../../theme/theme';
import MuiDialog from '@mui/material/Dialog';
import { darken } from '@mui/material';

export const Modal = styled(MuiDialog)`
  .MuiDialog-container > .MuiPaper-root{
    background: transparent;
  }
`;

export const ModalContainer = styled.div`
  background-color: ${({ theme }: { theme: Theme }) => theme.palette.modalBackgroundColor};
  --aug-border-bg: ${({ theme }: { theme: Theme }) => theme.palette.modalBorderColor};
  width: 500px;
  height: 500px;
  padding: 40px 50px;
  text-align: center;
  color: white;
`;

export const Title = styled.h1`
  font-size: large;
  margin-bottom: 50px;
`;

export const WalletListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

export const WalletItem = styled.button`
  padding: 20px 20px;
  border: none;
  background-color: ${({ theme }: { theme: Theme }) => theme.palette.background};
  --aug-border-bg: ${({ theme }: { theme: Theme }) => darken(theme.palette.modalBorderColor, 0.2)};
  --aug-br: 25px;
`;