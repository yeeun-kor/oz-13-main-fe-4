import { ThemeProvider, createTheme } from '@mui/material/styles';
import * as React from 'react';
import { dataDisplayCustomizations } from './customizations/dataDisplay';
import { feedbackCustomizations } from './customizations/feedback';
import { inputsCustomizations } from './customizations/inputs';
import { navigationCustomizations } from './customizations/navigation';
import { surfacesCustomizations } from './customizations/surfaces';

interface AppThemeProps {
  children: React.ReactNode;

  disableCustomTheme?: boolean;
}

export default function AppTheme(props: AppThemeProps) {
  const { children, disableCustomTheme } = props;
  const theme = React.useMemo(() => {
    return disableCustomTheme
      ? {}
      : createTheme({
          typography: {
            fontFamily: 'Pretendard',
          },

          components: {
            ...inputsCustomizations,
            ...dataDisplayCustomizations,
            ...feedbackCustomizations,
            ...navigationCustomizations,
            ...surfacesCustomizations,
          },
        });
  }, [disableCustomTheme]);

  return (
    <ThemeProvider theme={theme} disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}
