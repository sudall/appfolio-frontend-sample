import * as React from 'react';
import { FunctionComponent, useState } from 'react';
import UsersTable from 'components/UsersTable';
import {
    Box,
    CircularProgress,
    Flex,
    Heading,
    Text
} from '@chakra-ui/core/dist';
import * as QueryString from 'querystring';
import useAsync from 'hooks/useAsync';
import { useEffectOnce } from 'react-use';
import { GetUsersResult } from 'data/types/RandomUserApi';
import Pagination from 'components/Pagination';
import SystemUtils from 'utils/SystemUtils';

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

    const [asyncState, trigger] = useAsync(async () => {
        // await SystemUtils.setTimeout(3000);
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
            <Box
                backgroundColor={'gray.700'}
                p={4}
                borderRadius={'lg'}
                shadow={'lg'}
            >
                <Flex alignItems={'center'}>
                    <Heading marginBottom={2}>Users ({totalUsers})</Heading>
                    {asyncState.state === 'pending' && (
                        <CircularProgress
                            size={'2xl'}
                            marginLeft={2}
                            isIndeterminate
                        />
                    )}
                </Flex>
                {asyncState.lastResult != null &&
                    asyncState.lastResult.results != null && (
                        <>
                            <UsersTable
                                onSort={() => {}}
                                marginBottom={2}
                                data={asyncState.lastResult.results}
                            />
                            <Flex
                                justifyContent={'space-between'}
                                alignItems={'center'}
                            >
                                <Text color={'gray.400'}>
                                    {`Displaying: ${firstItemIndex}-${firstItemIndex +
                                        asyncState.lastResult.info.results -
                                        1} of ${totalUsers}`}
                                </Text>
                                <Pagination
                                    marginLeft={2}
                                    totalPages={totalPages}
                                    currentPage={currentPage}
                                    onPageChange={newPage => {
                                        setCurrentPage(newPage);
                                        trigger();
                                    }}
                                />
                            </Flex>
                        </>
                    )}
            </Box>
        </Flex>
    );
};

export default Users;
