import * as React from 'react';
import { FunctionComponent, useMemo } from 'react';
import { BoxProps, Button, IconButton } from '@chakra-ui/core/dist';
import Stack from 'components/Stack';

type Props = {
    totalPages: number;
    currentPage: number;
    onPageChange: (newPage: number) => void;
} & BoxProps;

const PagePicker: FunctionComponent<Props> = ({
    currentPage,
    onPageChange,
    totalPages,
    ...boxProps
}) => {
    let firstPage = currentPage - 2;
    let lastPage = currentPage + 2;

    if (firstPage < 1) {
        firstPage = 1;
        lastPage = Math.min(firstPage + 4, totalPages);
    }

    if (lastPage > totalPages) {
        lastPage = totalPages;
        firstPage = Math.max(lastPage - 4, 1);
    }

    const pagesToShow = useMemo(() => {
        const result = [];
        for (let i = firstPage; i <= lastPage; i++) {
            result.push(i);
        }
        return result;
    }, [firstPage, lastPage]);

    return (
        <Stack isInline spacing={1} {...boxProps}>
            <IconButton
                data-name={'firstPageButton'}
                aria-label='first page'
                icon='arrow-left'
                onClick={() => onPageChange(1)}
                isDisabled={currentPage === 1}
            />
            <IconButton
                data-name={'previousPageButton'}
                aria-label='previous page'
                icon='chevron-left'
                onClick={() => onPageChange(currentPage - 1)}
                isDisabled={currentPage - 1 < 1}
            />
            {pagesToShow.map(page => (
                <Button
                    key={page}
                    variantColor={page === currentPage ? 'green' : undefined}
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </Button>
            ))}
            <IconButton
                data-name={'nextPageButton'}
                aria-label='next page'
                icon='chevron-right'
                onClick={() => onPageChange(currentPage + 1)}
                isDisabled={currentPage + 1 > totalPages}
            />
            <IconButton
                data-name={'lastPageButton'}
                aria-label='last page'
                icon='arrow-right'
                onClick={() => onPageChange(totalPages)}
                isDisabled={currentPage === totalPages}
            />
        </Stack>
    );
};

export default PagePicker;
