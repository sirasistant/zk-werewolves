import { DefaultTheme } from 'styled-components';

export interface Theme extends DefaultTheme {
  readonly palette: {
    readonly background: string,
    readonly modalBackgroundColor: string,
    readonly modalBorderColor: string,
  };
  readonly button: {
    readonly primary: {
      readonly color: string;
      readonly borderColor: string;
    };
  };
  readonly fonts: {
    readonly fontFamily: string;
    readonly fontFamilyItalic: string;
  };
}

export const defaultTheme: Theme = {
  palette: { 
    background: '#151510',
    modalBackgroundColor: 'rgb(50,90,60)',
    modalBorderColor: 'rgb(100,200,140)',
  },
  button:{
    primary: {
      color: 'rgb(73,110,84)',
      borderColor: 'rgb(121,222,168)',
    },
  },
  fonts: {
    fontFamily: 'robtronika, monospace',
    fontFamilyItalic: 'robtronika-italic, monospace',
  },
};

