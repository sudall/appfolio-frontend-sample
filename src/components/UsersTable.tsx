import * as React from 'react';
import { GetUsersResult } from 'data/types/RandomUserApi';
import { Box, BoxProps, Button, ButtonProps, Link } from '@chakra-ui/core/dist';
import { FC } from 'react';

export type SortDirection = 'unsorted' | 'ascending' | 'descending';
export type SortKey = 'first' | 'last' | 'email';
export type Props = {
    data: Required<GetUsersResult>['results'];
    onSort: (sortBy: SortKey, sortDirection: SortDirection) => void;
    sort: {
        sortBy: SortKey;
        sortDirection: SortDirection;
    };
} & BoxProps;

const TableHeaderCell: FC<BoxProps> = props => (
    <Box p={2} {...props} as={'th'} />
);
const TableDataCell: FC<BoxProps> = props => <Box p={2} {...props} as={'td'} />;

const SortableTableHeader: FC<{
    sortKey: SortKey;
    sort: Props['sort'];
    onSort: Props['onSort'];
}> = ({ onSort, children, sort, sortKey }) => {
    const sortDirectionToPropsMap: Record<
        SortDirection,
        Partial<ButtonProps>
    > = {
        unsorted: {
            rightIcon: 'arrow-up-down',
            'aria-label': 'sort ascending',
            onClick: () => {
                onSort(sortKey, 'ascending');
            }
        },
        descending: {
            rightIcon: 'chevron-down',
            'aria-label': 'sort ascending',
            onClick: () => {
                onSort(sortKey, 'ascending');
            }
        },
        ascending: {
            rightIcon: 'chevron-up',
            'aria-label': 'sort descending',
            onClick: () => {
                onSort(sortKey, 'descending');
            }
        }
    };

    const buttonProps =
        sortKey === sort.sortBy
            ? sortDirectionToPropsMap[sort.sortDirection]
            : sortDirectionToPropsMap['unsorted'];

    return <Button {...buttonProps}>{children}</Button>;
};

function UsersTable({ data, onSort, sort, ...boxProps }: Props) {
    return (
        <Box as={'table'} width={'100%'} {...boxProps}>
            <thead>
                <Box as={'tr'} textAlign={'left'} backgroundColor={'gray.900'}>
                    <TableHeaderCell>
                        <SortableTableHeader
                            onSort={onSort}
                            sort={sort}
                            sortKey={'first'}
                        >
                            First
                        </SortableTableHeader>
                    </TableHeaderCell>
                    <TableHeaderCell>
                        <SortableTableHeader
                            onSort={onSort}
                            sort={sort}
                            sortKey={'last'}
                        >
                            Last
                        </SortableTableHeader>
                    </TableHeaderCell>
                    <TableHeaderCell>
                        <SortableTableHeader
                            onSort={onSort}
                            sort={sort}
                            sortKey={'email'}
                        >
                            Email
                        </SortableTableHeader>
                    </TableHeaderCell>
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
