import React, { FC } from 'react';
import { CSSReset, DarkMode, theme, ThemeProvider } from '@chakra-ui/core/dist';
import Users from 'components/Users/Users';
import getApi from 'data/api';

const App: FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <DarkMode>
                <CSSReset />
                <Users getUsers={getApi(fetch).getUsers} />
            </DarkMode>
        </ThemeProvider>
    );
};

export default App;
