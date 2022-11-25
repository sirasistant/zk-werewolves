import { StyledButton } from './button.styles';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function Button({ children, ...otherProps }:ButtonProps) {
  return <StyledButton {...otherProps} data-augmented-ui="tl-clip tr-clip br-clip-x bl-clip border">{children}</StyledButton>;
}