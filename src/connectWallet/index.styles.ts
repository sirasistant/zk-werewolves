import styled from 'styled-components';
import { Button } from '../components/button';

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