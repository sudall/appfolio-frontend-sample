import React, { FC } from 'react';
import Users from 'components/Users';
import { CSSReset, DarkMode, theme, ThemeProvider } from '@chakra-ui/core/dist';
import api from 'data/api';

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
