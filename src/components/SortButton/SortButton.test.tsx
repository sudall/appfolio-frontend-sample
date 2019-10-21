import * as React from 'react';
import TestUtils from 'utils/TestUtils';
import { ComponentProps } from 'react';
import SortButton from 'components/SortButton/SortButton';
import { Button } from '@chakra-ui/core/dist';

type Props = ComponentProps<typeof SortButton>;

const createDefaultProps = (): Props => {
    return {
        sortBy: 'someKey',
        sortDirection: 'ascending',
        sortKey: 'someOtherKey',
        onSort: jest.fn()
    };
};

const setup = TestUtils.createShallowSetup(SortButton, createDefaultProps);
const mountSetup = TestUtils.createMountSetup(SortButton, createDefaultProps);

describe('<SortButton/>', () => {
    it('renders', () => {
        const wrapper = setup();

        expect(wrapper.exists()).toBe(true);
    });

    describe('sortButton', () => {
        const findButton = TestUtils.createFindByDataname(Button, 'sortButton');

        it('shows unsorted icon when sortBy is not the same as sortKey', () => {
            const wrapper = setup({
                sortBy: 'blah',
                sortKey: 'somethingElse'
            });

            expect(findButton(wrapper).props().rightIcon).toBe('arrow-up-down');
        });

        describe('sortBy is the same as sortKey', () => {
            it('shows unsorted icon when sortDirection is unsorted', () => {
                const wrapper = setup({
                    sortBy: 'blah',
                    sortKey: 'blah',
                    sortDirection: 'unsorted'
                });

                expect(findButton(wrapper).props().rightIcon).toBe(
                    'arrow-up-down'
                );
            });

            it('shows arrow down icon when sortDirection is descending', () => {
                const wrapper = setup({
                    sortBy: 'blah',
                    sortKey: 'blah',
                    sortDirection: 'descending'
                });

                expect(findButton(wrapper).props().rightIcon).toBe(
                    'chevron-down'
                );
            });

            it('shows arrow up icon when sortDirection is ascending', () => {
                const wrapper = setup({
                    sortBy: 'blah',
                    sortKey: 'blah',
                    sortDirection: 'ascending'
                });

                expect(findButton(wrapper).props().rightIcon).toBe(
                    'chevron-up'
                );
            });

            it('sorts ascending when sortDirection is unsorted on click', () => {
                const onSort = jest.fn();
                const wrapper = setup({
                    sortBy: 'blah',
                    sortKey: 'blah',
                    sortDirection: 'unsorted',
                    onSort
                });

                findButton(wrapper).simulate('click');

                expect(onSort).toBeCalledWith('blah', 'ascending');
            });

            it('sorts ascending when sortDirection is descending on click', () => {
                const onSort = jest.fn();
                const wrapper = setup({
                    sortBy: 'blah',
                    sortKey: 'blah',
                    sortDirection: 'descending',
                    onSort
                });

                findButton(wrapper).simulate('click');

                expect(onSort).toBeCalledWith('blah', 'ascending');
            });

            it('sorts descending when sortDirection is ascending on click', () => {
                const onSort = jest.fn();
                const wrapper = setup({
                    sortBy: 'blah',
                    sortKey: 'blah',
                    sortDirection: 'ascending',
                    onSort
                });

                findButton(wrapper).simulate('click');

                expect(onSort).toBeCalledWith('blah', 'descending');
            });
        });
    });
});
