import styled from 'styled-components';
import { Theme } from '../theme/theme';

export const StyledButton = styled.button`
  --aug-br: 20px;
  --aug-border-all: 2px;
  background: ${({ theme }: { theme: Theme }) => theme.button.primary.color};
  --aug-border-bg: ${({ theme }: { theme: Theme }) => theme.button.primary.borderColor};
  border: none;
  color: white;
`;