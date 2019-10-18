import * as React from 'react';
import { FunctionComponent, useState } from 'react';
import UsersTable, { SortDirection, SortKey } from 'components/UsersTable';
import { CircularProgress, Flex, Heading, Text } from '@chakra-ui/core/dist';
import * as QueryString from 'querystring';
import useAsync from 'hooks/useAsync';
import { useEffectOnce } from 'react-use';
import { GetUsersResult } from 'data/types/RandomUserApi';
import Stack from 'components/Stack';
import SystemUtils from 'utils/SystemUtils';
import PagePicker from './PagePicker';

const totalUsers = 500;
const pageSize = 10;

const getUsers = async (
    page: number,
    pageSize: number
): Promise<GetUsersResult> => {
    const query = QueryString.stringify({
        results: pageSize,
        page,
        inc: 'name,email',
        seed: 'a'
    });

    const response = await fetch(`https://randomuser.me/api/?${query}`);
    return response.json();
};

const Users: FunctionComponent = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortDirection, setSortDirection] = useState<SortDirection>(
        'unsorted'
    );
    const [sortBy, setSortBy] = useState<SortKey>('first');

    const [asyncState, trigger] = useAsync(async () => {
        // await SystemUtils.setTimeout(2000);
        return getUsers(currentPage, pageSize);
    }, [currentPage]);

    useEffectOnce(() => {
        trigger();
    });

    const firstItemIndex = (currentPage - 1) * pageSize + 1;

    const totalPages = Math.ceil(totalUsers / pageSize);

    return (
        <Flex
            maxWidth={'2xl'}
            mx={'auto'}
            py={8}
            px={5}
            flexDirection={'column'}
        >
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
                {asyncState.lastResult != null &&
                    asyncState.lastResult.results != null && (
                        <Stack>
                            <UsersTable
                                onSort={(sortBy, sortDirection) => {
                                    setSortBy(sortBy);
                                    setSortDirection(sortDirection);
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
        </Flex>
    );
};

export default Users;
