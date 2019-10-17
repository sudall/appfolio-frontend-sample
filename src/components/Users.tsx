import * as React from 'react';
import { FunctionComponent, useState } from 'react';
import UsersTable from 'components/UsersTable';
import { CircularProgress, Flex, Heading, Text } from '@chakra-ui/core/dist';
import * as QueryString from 'querystring';
import useAsync from 'hooks/useAsync';
import { useEffectOnce } from 'react-use';
import { GetUsersResult } from 'data/types/RandomUserApi';

const totalUsers = 500;
const pageSize = 10;

const getUsers = async (
    page: number,
    pageSize: number
): Promise<GetUsersResult> => {
    const query = QueryString.stringify({
        results: pageSize,
        page,
        seed: 'a'
    });

    const response = await fetch(`https://randomuser.me/api/?${query}`);
    return response.json();
};

const Users: FunctionComponent = () => {
    const [currentPage, setCurrentPage] = useState(1);

    const [asyncState, trigger] = useAsync(async () => {
        return getUsers(currentPage, pageSize);
    }, [currentPage]);

    useEffectOnce(() => {
        trigger();
    });

    const firstItemIndex = (currentPage - 1) * pageSize + 1;

    return (
        <Flex
            maxWidth={'2xl'}
            mx={'auto'}
            py={8}
            px={5}
            flexDirection={'column'}
        >
            <Flex alignItems={'center'}>
                <Heading>Users ({totalUsers})</Heading>
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
                        <UsersTable data={asyncState.lastResult.results} />
                        <Text>
                            {`Displaying: ${firstItemIndex}-${firstItemIndex +
                                asyncState.lastResult.info.results -
                                1} of ${totalUsers}`}
                        </Text>
                    </>
                )}
        </Flex>
    );
};

export default Users;
