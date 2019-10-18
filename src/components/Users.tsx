import * as React from 'react';
import { FunctionComponent, useState } from 'react';
import UsersTable, { SortDirection, SortKey } from 'components/UsersTable';
import {
    Alert,
    AlertIcon,
    CircularProgress,
    Flex,
    Heading,
    Text
} from '@chakra-ui/core/dist';
import * as QueryString from 'querystring';
import useAsync from 'hooks/useAsync';
import { useEffectOnce } from 'react-use';
import { GetUsersResult } from 'data/types/RandomUserApi';
import Stack from 'components/Stack';
import PagePicker from './PagePicker';
import SystemUtils from 'utils/SystemUtils';
import FakeData from 'data/FakeData';

const totalUsers = 500;
const pageSize = 10;

const getUsers = async (
    page: number,
    pageSize: number,
    sortBy: SortKey,
    sortDirection: SortDirection
): Promise<GetUsersResult> => {
    const include = 'name,email';
    const seed = 'a';
    const endpoint = `https://randomuser.me/api/`;

    if (sortDirection === 'unsorted') {
        const query = QueryString.stringify({
            results: pageSize,
            page,
            inc: include,
            seed
        });

        const response = await fetch(`${endpoint}?${query}`);
        return response.json();
    } else {
        // TODO I was running into fetch limits on the randomuser API with this
        //  code, so instead I'm just faking the response.
        // const query = QueryString.stringify({
        //     // get all 500 since there is no backend sorting available
        //     results: totalUsers,
        //     inc: include,
        //     seed
        // });
        //
        // const response = await fetch(`${endpoint}?${query}`);
        // const result: GetUsersResult = await response.json();
        await SystemUtils.setTimeout(500);
        const result: GetUsersResult = FakeData.allUsersResponse;

        if (result.results != null) {
            const pageFirstItemIndex = (page - 1) * pageSize;
            const pageLastItemIndex = pageFirstItemIndex + pageSize - 1;
            const sortDirectionModifier =
                sortDirection === 'ascending' ? 1 : -1;

            // sort the result
            result.results = result.results
                .sort((a, b) => {
                    const compare = () => {
                        switch (sortBy) {
                            case 'email':
                                return a.email.localeCompare(b.email);
                            case 'first':
                                return a.name.first.localeCompare(b.name.first);
                            case 'last':
                                return a.name.last.localeCompare(b.name.last);
                        }

                        return 0;
                    };

                    return compare() * sortDirectionModifier;
                })
                // only keep the page that was asked for
                .filter((item, index) => {
                    return (
                        index >= pageFirstItemIndex &&
                        index <= pageLastItemIndex
                    );
                });

            result.info.results = result.results.length;
        }

        return result;
    }
};

const Users: FunctionComponent = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortDirection, setSortDirection] = useState<SortDirection>(
        'unsorted'
    );
    const [sortBy, setSortBy] = useState<SortKey>('first');

    const [asyncState, trigger] = useAsync(async () => {
        // await SystemUtils.setTimeout(2000);
        return getUsers(currentPage, pageSize, sortBy, sortDirection);
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
        </Flex>
    );
};

export default Users;
