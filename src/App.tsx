import React, { FC } from 'react';
import Users from 'components/Users';
import { CSSReset, DarkMode, theme, ThemeProvider } from '@chakra-ui/core/dist';

const App: FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <DarkMode>
                <CSSReset />
                <Users />
            </DarkMode>
        </ThemeProvider>
    );
};

export default App;
