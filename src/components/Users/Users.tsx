import * as React from 'react';
import { FunctionComponent, useState } from 'react';
import {
    Alert,
    AlertIcon,
    CircularProgress,
    Heading,
    Text
} from '@chakra-ui/core/dist';
import useAsync from 'hooks/useAsync';
import { useEffectOnce } from 'react-use';
import Stack from 'components/Stack';
import { Api } from 'data/api';
import PagePicker from 'components/PagePicker/PagePicker';
import UsersTable, {
    SortDirection,
    SortKey
} from 'components/UsersTable/UsersTable';

const totalUsers = 500;
const pageSize = 10;

type Props = {
    getUsers: Api['getUsers'];
};

const Users: FunctionComponent<Props> = ({ getUsers }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortDirection, setSortDirection] = useState<SortDirection>(
        'unsorted'
    );
    const [sortBy, setSortBy] = useState<SortKey>('first');

    const [asyncState, trigger] = useAsync(async () => {
        return getUsers(currentPage, pageSize, sortBy, sortDirection);
    }, [currentPage]);

    useEffectOnce(() => {
        trigger();
    });

    const firstItemIndex = (currentPage - 1) * pageSize + 1;

    const totalPages = Math.ceil(totalUsers / pageSize);

    return (
        <Stack width={'2xl'} mx={'auto'} p={4} flexDirection={'column'}>
            <Stack
                backgroundColor={'gray.700'}
                p={4}
                borderRadius={'lg'}
                shadow={'lg'}
            >
                <Stack isInline alignItems={'center'}>
                    <Heading>Users ({totalUsers})</Heading>
                    {asyncState.state === 'pending' && (
                        <CircularProgress size={'2xl'} isIndeterminate />
                    )}
                </Stack>
                {asyncState.state === 'error' && asyncState.lastError != null && (
                    <Alert status='error'>
                        <AlertIcon />
                        {asyncState.lastError.message}
                    </Alert>
                )}
                {asyncState.lastResult != null &&
                    asyncState.lastResult.results != null && (
                        <Stack>
                            <UsersTable
                                onSort={(sortBy, sortDirection) => {
                                    setSortBy(sortBy);
                                    setSortDirection(sortDirection);
                                    setCurrentPage(1);
                                    trigger();
                                }}
                                sort={{
                                    sortDirection,
                                    sortBy
                                }}
                                data={asyncState.lastResult.results}
                            />
                            <Stack
                                isInline
                                justifyContent={'space-between'}
                                alignItems={'center'}
                            >
                                <Text color={'gray.400'}>
                                    {`Displaying: ${firstItemIndex}-${firstItemIndex +
                                        asyncState.lastResult.info.results -
                                        1} of ${totalUsers}`}
                                </Text>
                                <PagePicker
                                    totalPages={totalPages}
                                    currentPage={currentPage}
                                    onPageChange={newPage => {
                                        setCurrentPage(newPage);
                                        trigger();
                                    }}
                                />
                            </Stack>
                        </Stack>
                    )}
            </Stack>
        </Stack>
    );
};

export default Users;
