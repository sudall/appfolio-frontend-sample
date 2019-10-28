import * as React from 'react';
import { FunctionComponent, useState } from 'react';
import {
    Alert,
    AlertIcon,
    Flex,
    Heading,
    Spinner,
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

type Props = {
    getUsers: Api['getUsers'];
    pageSize?: number;
};

const Users: FunctionComponent<Props> = ({ getUsers, pageSize = 10 }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortDirection, setSortDirection] = useState<SortDirection>(
        'unsorted'
    );
    const [sortBy, setSortBy] = useState<SortKey>('first');

    const [asyncState, trigger] = useAsync(async () => {
        return getUsers({ page: currentPage, pageSize, sortBy, sortDirection });
    }, [getUsers, currentPage, pageSize, sortBy, sortDirection]);

    useEffectOnce(() => {
        trigger();
    });

    const firstItemIndex = (currentPage - 1) * pageSize + 1;

    let totalPages = 0;
    let totalUsers: number | null = null;
    if (asyncState.lastResult != null) {
        totalPages = Math.ceil(
            asyncState.lastResult.info.totalUsers / pageSize
        );

        totalUsers = asyncState.lastResult.info.totalUsers;
    }

    return (
        <Stack
            maxWidth={'2xl'}
            minWidth={'fit-content'}
            mx={'auto'}
            p={4}
            flexDirection={'column'}
        >
            <Stack
                backgroundColor={'gray.700'}
                p={4}
                borderRadius={'lg'}
                shadow={'lg'}
            >
                <Stack isInline alignItems={'center'}>
                    <Heading>{`Users${
                        totalUsers != null ? ` (${totalUsers})` : ``
                    }`}</Heading>
                    {asyncState.state === 'pending' && <Spinner />}
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
                                data-name={'usersTable'}
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
                            <Text data-name={'pageInfoText'} color={'gray.400'}>
                                {`Displaying: ${firstItemIndex}-${firstItemIndex +
                                    asyncState.lastResult.info.results -
                                    1} of ${totalUsers}`}
                            </Text>
                            <Flex justifyContent={'center'}>
                                <PagePicker
                                    data-name={'pagePicker'}
                                    totalPages={totalPages}
                                    currentPage={currentPage}
                                    onPageChange={newPage => {
                                        setCurrentPage(newPage);
                                        trigger();
                                    }}
                                />
                            </Flex>
                        </Stack>
                    )}
            </Stack>
        </Stack>
    );
};

export default Users;
