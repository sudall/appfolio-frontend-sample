import * as React from 'react';
import { GetUsersResult } from 'data/types/RandomUserApi';
import { Link } from '@chakra-ui/core';
import { Box, BoxProps } from '@chakra-ui/core/dist';
import { FC } from 'react';

export type SortKey = 'first' | 'last' | 'email';
export type Props = {
    data: Required<GetUsersResult>['results'];
    onSort: (sortBy: SortKey) => void;
} & BoxProps;

const TableHeaderCell: FC<BoxProps> = props => (
    <Box p={2} {...props} as={'th'} />
);
const TableDataCell: FC<BoxProps> = props => <Box p={2} {...props} as={'td'} />;

function UsersTable({ data, onSort, ...boxProps }: Props) {
    return (
        <Box as={'table'} width={'100%'} {...boxProps}>
            <thead>
                <Box as={'tr'} textAlign={'left'} backgroundColor={'gray.900'}>
                    <TableHeaderCell>First</TableHeaderCell>
                    <TableHeaderCell>Last</TableHeaderCell>
                    <TableHeaderCell>Email</TableHeaderCell>
                </Box>
            </thead>
            <tbody>
                {data.map((item, index) => {
                    return (
                        <Box
                            as={'tr'}
                            key={item.email}
                            backgroundColor={
                                index % 2 === 0 ? 'gray.800' : 'gray.700'
                            }
                        >
                            <TableDataCell>{item.name.first}</TableDataCell>
                            <TableDataCell>{item.name.last}</TableDataCell>
                            <TableDataCell>
                                <Link href={`mailto:${item.email}`}>
                                    {item.email}
                                </Link>
                            </TableDataCell>
                        </Box>
                    );
                })}
            </tbody>
        </Box>
    );
}

export default UsersTable;
