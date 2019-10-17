import * as React from 'react';
import { FunctionComponent, useState } from 'react';
import UsersTable from 'components/UsersTable';
import { CircularProgress, Flex } from '@chakra-ui/core/dist';
import * as QueryString from 'querystring';
import useAsync from 'hooks/useAsync';
import { useEffectOnce } from 'react-use';
import { GetUsersResult } from 'data/types/RandomUserApi';

const getUsers = async (
    page: number,
    pageSize: number
): Promise<GetUsersResult> => {
    const query = QueryString.stringify({
        results: pageSize,
        page
    });

    const response = await fetch(`https://randomuser.me/api/?${query}`);
    return response.json();
};

const Users: FunctionComponent = () => {
    const [currentPage, setCurrentPage] = useState(1);

    const [asyncState, trigger] = useAsync(async () => {
        return getUsers(currentPage, 10);
    });

    useEffectOnce(() => {
        trigger();
    });

    return (
        <Flex
            maxWidth={'2xl'}
            mx={'auto'}
            py={8}
            px={5}
            flexDirection={'column'}
        >
            {asyncState.state === 'pending' && (
                <CircularProgress isIndeterminate></CircularProgress>
            )}
            {asyncState.lastResult != null &&
                asyncState.lastResult.results != null && (
                    <UsersTable data={asyncState.lastResult.results} />
                )}
        </Flex>
    );
};

export default Users;
