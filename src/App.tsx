import React, { FC } from 'react';
import { CSSReset, DarkMode, theme, ThemeProvider } from '@chakra-ui/core/dist';
import api from 'data/api';
import Users from 'components/Users/Users';

const App: FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <DarkMode>
                <CSSReset />
                <Users getUsers={api.getUsers} />
            </DarkMode>
        </ThemeProvider>
    );
};

export default App;
