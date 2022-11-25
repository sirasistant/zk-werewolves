import { ThemeProvider, useTheme } from 'styled-components';
import { defaultTheme, Theme } from './theme';

const getTheme = (): Theme => {
  return useTheme() as Theme || defaultTheme;
};

export  default function withTheme<T>(WrappedComponent: React.ComponentType<T>) {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const ComponentWithTheme = (props: T & {}) => {
    return <ThemeProvider theme={getTheme()}>
      <WrappedComponent {...props} />
      </ThemeProvider>;
  };

  ComponentWithTheme.displayName = `withTheme(${displayName})`;

  return ComponentWithTheme;
}