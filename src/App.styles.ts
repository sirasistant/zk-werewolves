import { darken } from '@mui/material';
import styled from 'styled-components';
import { Button } from './components/button';
import { Theme } from './theme/theme';

export const AppContainer = styled.div`
  min-height: 100vh;
  background: 
    linear-gradient( 
      to right, 
      #2b2b2b 1px, 
      transparent 1px, 
      transparent calc(100vw / 5 - 1px), 
      #2b2b2b calc(100vw / 5) 
    ) calc(100vw / 10) top / calc(100vw / 5) 100%, 
    linear-gradient(
      to bottom, 
      #2b2b2b 1px, 
      transparent 1px, 
      transparent calc(100vh / 5 - 1px), 
      #2b2b2b calc(100vh / 5)
    ) center top / 100% calc(100vh / 5), 
    repeating-linear-gradient( 
      to right, 
      ${({ theme }: { theme: Theme }) => theme.palette.background}, 
      ${({ theme }: { theme: Theme }) => darken(theme.palette.background, 0.01)} 15%,
      ${({ theme }: { theme: Theme }) => theme.palette.background} 20% 
    ) center center / calc(100vw / 5) calc(100vh / 5);
`;

export const ConnectWalletButton = styled(Button)`
  flex-grow: 0;
  padding: 30px 40px;
`;

export const ConnectWalletContainer = styled.div`
  display: flex;
  min-height: inherit;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;