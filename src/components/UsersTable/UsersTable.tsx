import * as React from 'react';
import { GetUsersResult } from 'data/types/RandomUserApi';
import { Box, BoxProps, Link } from '@chakra-ui/core/dist';
import { FC } from 'react';
import SortButton from 'components/SortButton/SortButton';

export type SortDirection = 'unsorted' | 'ascending' | 'descending';
export type SortKey = 'first' | 'last' | 'email';
type Props = {
    data: Required<GetUsersResult>['results'];
    onSort: (sortBy: SortKey, sortDirection: SortDirection) => void;
    sort: {
        sortBy: SortKey;
        sortDirection: SortDirection;
    };
} & BoxProps;

const TableHeader: FC<BoxProps> = props => <Box p={2} {...props} as={'th'} />;
const TableData: FC<BoxProps> = props => <Box p={2} {...props} as={'td'} />;

function UsersTable({ data, onSort, sort, ...boxProps }: Props) {
    return (
        <Box as={'table'} width={'100%'} {...boxProps}>
            <thead>
                <Box as={'tr'} textAlign={'left'} backgroundColor={'gray.900'}>
                    <TableHeader>
                        <SortButton
                            onSort={onSort}
                            sortDirection={sort.sortDirection}
                            sortBy={sort.sortBy}
                            sortKey={'first'}
                        >
                            First
                        </SortButton>
                    </TableHeader>
                    <TableHeader>
                        <SortButton
                            onSort={onSort}
                            sortDirection={sort.sortDirection}
                            sortBy={sort.sortBy}
                            sortKey={'last'}
                        >
                            Last
                        </SortButton>
                    </TableHeader>
                    <TableHeader>
                        <SortButton
                            onSort={onSort}
                            sortDirection={sort.sortDirection}
                            sortBy={sort.sortBy}
                            sortKey={'email'}
                        >
                            Email
                        </SortButton>
                    </TableHeader>
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
                            <TableData>{item.name.first}</TableData>
                            <TableData>{item.name.last}</TableData>
                            <TableData>
                                <Link href={`mailto:${item.email}`}>
                                    {item.email}
                                </Link>
                            </TableData>
                        </Box>
                    );
                })}
            </tbody>
        </Box>
    );
}

export default UsersTable;
