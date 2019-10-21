import * as React from 'react';
import {FunctionComponent, PropsWithChildren} from 'react';
import {FC} from 'react';
import {Button, ButtonProps} from '@chakra-ui/core/dist';
import {SortDirection, SortKey} from 'components/UsersTable/UsersTable';

type Props<TSortKey extends string> = {
    sortKey: TSortKey;
    sortBy: TSortKey;
    sortDirection: SortDirection;
    onSort: (sortBy: TSortKey, sortDirection: SortDirection) => void;
}

function SortButton<TSortKey extends string>({ onSort, children, sortDirection, sortBy, sortKey }: PropsWithChildren<Props<TSortKey>>) {
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
        sortKey === sortBy
            ? sortDirectionToPropsMap[sortDirection]
            : sortDirectionToPropsMap['unsorted'];

    return <Button data-name={'sortButton'} {...buttonProps}>{children}</Button>;
};

export default SortButton;
