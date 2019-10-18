import * as React from 'react';
import { GetUsersResult } from 'data/types/RandomUserApi';
import { Link } from '@chakra-ui/core';
import { Box, BoxProps } from '@chakra-ui/core/dist';

export type SortKey = 'first' | 'last' | 'email';
export type Props = {
    data: Required<GetUsersResult>['results'];
    onSort: (sortBy: SortKey) => void;
} & BoxProps;

function UsersTable({ data, onSort, ...boxProps }: Props) {
    return (
        <Box {...boxProps}>
            <table
                style={{
                    width: '100%'
                }}
            >
                <thead>
                    <tr>
                        <th>First</th>
                        <th>Last</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => {
                        return (
                            <tr key={item.email}>
                                <td>{item.name.first}</td>
                                <td>{item.name.last}</td>
                                <td>
                                    <Link href={`mailto:${item.email}`}>
                                        {item.email}
                                    </Link>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </Box>
    );
}

export default UsersTable;
