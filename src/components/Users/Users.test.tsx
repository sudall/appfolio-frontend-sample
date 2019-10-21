import * as React from 'react';
import { ComponentProps } from 'react';
import TestUtils from 'utils/TestUtils';
import Users from 'components/Users/Users';
import Text from '@chakra-ui/core/dist/Text';
import FakeData from 'data/FakeData';
import PagePicker from 'components/PagePicker/PagePicker';
import UsersTable from 'components/UsersTable/UsersTable';

type Props = ComponentProps<typeof Users>;

const createDefaultProps = (): Props => {
    return {
        getUsers: jest.fn()
    };
};

const setup = TestUtils.createShallowSetup(Users, createDefaultProps);
const mountSetup = TestUtils.createMountSetup(Users, createDefaultProps);

describe('<Users/>', () => {
    it('renders', () => {
        const wrapper = setup();

        expect(wrapper.exists()).toBe(true);
    });

    const findPagePicker = TestUtils.createFindByDataname(
        PagePicker,
        'pagePicker'
    );

    describe('pageInfoText', () => {
        const findPageInfoText = TestUtils.createFindByDataname(
            Text,
            'pageInfoText'
        );

        it('is not visible before first getUsers() call completed', async () => {
            const getUsersResult = FakeData.getUsersResponse1;
            const wrapper = mountSetup({
                getUsers: jest.fn().mockResolvedValue(getUsersResult)
            });

            expect(findPageInfoText(wrapper).exists()).toBe(false);
        });

        it('is visible when first getUsers() call completed', async () => {
            const getUsersResult = FakeData.getUsersResponse1;
            const wrapper = mountSetup({
                getUsers: jest.fn().mockResolvedValue(getUsersResult)
            });

            await TestUtils.waitForAsync(wrapper);

            expect(findPageInfoText(wrapper).exists()).toBe(true);
        });

        it('displays the correct info about the first page', async () => {
            const getUsersResult = FakeData.getUsersResponse1;
            const wrapper = mountSetup({
                getUsers: jest.fn().mockResolvedValue(getUsersResult)
            });

            await TestUtils.waitForAsync(wrapper);

            expect(findPageInfoText(wrapper).props().children).toBe(
                'Displaying: 1-12 of 500'
            );
        });

        it('displays the correct info about the second page', async () => {
            const getUsersResult = FakeData.getUsersResponse1;
            const wrapper = mountSetup({
                getUsers: jest.fn().mockResolvedValue(getUsersResult),
                pageSize: 12
            });

            await TestUtils.waitForAsync(wrapper);

            // change to page two
            findPagePicker(wrapper)
                .props()
                .onPageChange(2);

            await TestUtils.waitForAsync(wrapper);

            expect(findPageInfoText(wrapper).props().children).toBe(
                'Displaying: 13-24 of 500'
            );
        });
    });

    describe('usersTable', () => {
        const findUsersTable = TestUtils.createFindByDataname(
            UsersTable,
            'usersTable'
        );

        it('is not visible before first getUsers() call completed', async () => {
            const getUsersResult = FakeData.getUsersResponse1;
            const wrapper = mountSetup({
                getUsers: jest.fn().mockResolvedValue(getUsersResult)
            });

            expect(findUsersTable(wrapper).exists()).toBe(false);
        });

        it('is visible when first getUsers() call completed', async () => {
            const getUsersResult = FakeData.getUsersResponse1;
            const wrapper = mountSetup({
                getUsers: jest.fn().mockResolvedValue(getUsersResult)
            });

            await TestUtils.waitForAsync(wrapper);

            expect(findUsersTable(wrapper).exists()).toBe(true);
        });
    });

    describe('pagePicker', () => {
        it('is not visible before first getUsers() call completed', async () => {
            const getUsersResult = FakeData.getUsersResponse1;
            const wrapper = mountSetup({
                getUsers: jest.fn().mockResolvedValue(getUsersResult)
            });

            expect(findPagePicker(wrapper).exists()).toBe(false);
        });

        it('is visible when first getUsers() call completed', async () => {
            const getUsersResult = FakeData.getUsersResponse1;
            const wrapper = mountSetup({
                getUsers: jest.fn().mockResolvedValue(getUsersResult)
            });

            await TestUtils.waitForAsync(wrapper);

            expect(findPagePicker(wrapper).exists()).toBe(true);
        });
    });
});
