import * as React from 'react';
import TestUtils from 'utils/TestUtils';
import { ComponentProps } from 'react';
import PagePicker from 'components/PagePicker/PagePicker';
import { IconButton } from '@chakra-ui/core/dist';

type Props = ComponentProps<typeof PagePicker>;

const createDefaultProps = (): Props => {
    return {
        totalPages: 1,
        currentPage: 1,
        onPageChange: jest.fn()
    };
};

const setup = TestUtils.createShallowSetup(PagePicker, createDefaultProps);

describe('<PagePicker/>', () => {
    it('renders', () => {
        const wrapper = setup();

        expect(wrapper.exists()).toBe(true);
    });

    describe('firstPageButton', () => {
        const findFirstPageButton = TestUtils.createFindByDataname(
            IconButton,
            'firstPageButton'
        );

        it('is disabled when on page 1', () => {
            const wrapper = setup({
                currentPage: 1
            });

            const button = findFirstPageButton(wrapper);

            expect(button.props().isDisabled).toBe(true);
        });

        it('is enabled when not on page 1', () => {
            const wrapper = setup({
                currentPage: 2
            });

            const button = findFirstPageButton(wrapper);

            expect(button.props().isDisabled).toBe(false);
        });
    });

    describe('previousPageButton', () => {
        const findPreviousPageButton = TestUtils.createFindByDataname(
            IconButton,
            'previousPageButton'
        );

        it('is disabled when on page 1', () => {
            const wrapper = setup({
                currentPage: 1
            });

            const button = findPreviousPageButton(wrapper);

            expect(button.props().isDisabled).toBe(true);
        });

        it('is enabled when not on page 1', () => {
            const wrapper = setup({
                currentPage: 2
            });

            const button = findPreviousPageButton(wrapper);

            expect(button.props().isDisabled).toBe(false);
        });
    });

    describe('nextPageButton', () => {
        const findNextPageButton = TestUtils.createFindByDataname(
            IconButton,
            'nextPageButton'
        );

        it('is disabled when on last page', () => {
            const wrapper = setup({
                totalPages: 2,
                currentPage: 2
            });

            const button = findNextPageButton(wrapper);

            expect(button.props().isDisabled).toBe(true);
        });

        it('is enabled when not on last page', () => {
            const wrapper = setup({
                currentPage: 2,
                totalPages: 3
            });

            const button = findNextPageButton(wrapper);

            expect(button.props().isDisabled).toBe(false);
        });
    });

    describe('lastPageButton', () => {
        const findLastPageButton = TestUtils.createFindByDataname(
            IconButton,
            'lastPageButton'
        );

        it('is disabled when on last page', () => {
            const wrapper = setup({
                currentPage: 2,
                totalPages: 2
            });

            const button = findLastPageButton(wrapper);

            expect(button.props().isDisabled).toBe(true);
        });

        it('is enabled when not on last page', () => {
            const wrapper = setup({
                currentPage: 2,
                totalPages: 3
            });

            const button = findLastPageButton(wrapper);

            expect(button.props().isDisabled).toBe(false);
        });
    });
});
