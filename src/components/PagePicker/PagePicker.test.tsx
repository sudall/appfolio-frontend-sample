import * as React from 'react';
import TestUtils from 'utils/TestUtils';
import { ComponentProps } from 'react';
import PagePicker from 'components/PagePicker/PagePicker';
import { Button, IconButton } from '@chakra-ui/core/dist';
import { ShallowWrapper } from 'enzyme';

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

    describe('pageButtons', () => {
        const findPageButton = (page: number) =>
            TestUtils.createFindByDataname(Button, `pageButton${page}`);
        const findAllPageButtons = (wrapper: ShallowWrapper) =>
            wrapper.find(`[data-name^="pageButton"]`);

        it('shows 2 pages when total pages is 2', () => {
            const wrapper = setup({
                totalPages: 2
            });

            const page1 = findPageButton(1)(wrapper);
            const page2 = findPageButton(2)(wrapper);
            const allPages = findAllPageButtons(wrapper);

            expect(page1.exists()).toBe(true);
            expect(page2.exists()).toBe(true);
            expect(allPages.length).toBe(2);
        });

        it('shows first 5 pages when on page 1 and there are 5 or more', () => {
            const wrapper = setup({
                totalPages: 6,
                currentPage: 1
            });

            const page1 = findPageButton(1)(wrapper);
            const page5 = findPageButton(5)(wrapper);
            const allPages = findAllPageButtons(wrapper);

            expect(page1.exists()).toBe(true);
            expect(page5.exists()).toBe(true);
            expect(allPages.length).toBe(5);
        });

        it('shows first 5 pages when on page 2 and there are 5 or more', () => {
            const wrapper = setup({
                totalPages: 6,
                currentPage: 2
            });

            const page1 = findPageButton(1)(wrapper);
            const page5 = findPageButton(5)(wrapper);
            const allPages = findAllPageButtons(wrapper);

            expect(page1.exists()).toBe(true);
            expect(page5.exists()).toBe(true);
            expect(allPages.length).toBe(5);
        });

        it('shows 2 pages to the left and to the right when in between first and last page', () => {
            const wrapper = setup({
                totalPages: 7,
                currentPage: 4
            });

            const page2 = findPageButton(2)(wrapper);
            const page6 = findPageButton(6)(wrapper);
            const allPages = findAllPageButtons(wrapper);

            expect(page2.exists()).toBe(true);
            expect(page6.exists()).toBe(true);
            expect(allPages.length).toBe(5);
        });

        it('shows last 5 pages when on the last page', () => {
            const wrapper = setup({
                totalPages: 6,
                currentPage: 6
            });

            const page2 = findPageButton(2)(wrapper);
            const page6 = findPageButton(6)(wrapper);
            const allPages = findAllPageButtons(wrapper);

            expect(page2.exists()).toBe(true);
            expect(page6.exists()).toBe(true);
            expect(allPages.length).toBe(5);
        });

        it('shows last 5 pages when on the second to last page', () => {
            const wrapper = setup({
                totalPages: 6,
                currentPage: 5
            });

            const page2 = findPageButton(2)(wrapper);
            const page6 = findPageButton(6)(wrapper);
            const allPages = findAllPageButtons(wrapper);

            expect(page2.exists()).toBe(true);
            expect(page6.exists()).toBe(true);
            expect(allPages.length).toBe(5);
        });
    });
});
