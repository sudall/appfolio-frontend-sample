import getApi, { Api } from './api';
import FakeData from 'data/FakeData';
import { GetUsersResult } from 'data/types/RandomUserApi';

const defaultParameters: Parameters<Api['getUsers']>[0] = {
    page: 1,
    pageSize: 1,
    sortBy: 'email',
    sortDirection: 'unsorted'
};

const getMockFetch = (fakeData: GetUsersResult = FakeData.getUsersResponse2) =>
    jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue(fakeData)
    });

describe('api', () => {
    describe('getUsers', () => {
        it('makes a real fetch on first call', () => {
            const fetch = getMockFetch();
            const api = getApi(fetch);

            api.getUsers(defaultParameters);

            expect(fetch).toHaveBeenCalledTimes(1);
        });

        it('does not do a real fetch after first call', () => {
            const fetch = getMockFetch();
            const api = getApi(fetch);

            api.getUsers(defaultParameters);
            api.getUsers(defaultParameters);

            expect(fetch).toHaveBeenCalledTimes(1);
        });

        it('returns distinct objects with the same content with each call that is the same', async () => {
            const fetch = getMockFetch();
            const api = getApi(fetch);

            const result1 = await api.getUsers(defaultParameters);
            const result2 = await api.getUsers(defaultParameters);
            const result3 = await api.getUsers(defaultParameters);

            expect(result1).not.toBe(result2);
            expect(result1).toEqual(result2);

            expect(result2).not.toBe(result3);
            expect(result2).toEqual(result3);

            expect(result3).not.toBe(result1);
            expect(result3).toEqual(result1);
        });

        it('sorts the results ascending if sortDirection ascending', async () => {
            const fetch = getMockFetch();
            const api = getApi(fetch);

            const result = await api.getUsers({
                ...defaultParameters,
                sortDirection: 'ascending',
                sortBy: 'first',
                pageSize: 3,
                page: 2
            });

            const expectedResults = [
                {
                    name: { title: 'Mrs', first: 'Dolores', last: 'Lawson' },
                    email: 'dolores.lawson@example.com'
                },
                {
                    name: { title: 'Ms', first: 'Gordana', last: 'Piontek' },
                    email: 'gordana.piontek@example.com'
                },
                {
                    name: { title: 'Miss', first: 'Lyna', last: 'Leroy' },
                    email: 'lyna.leroy@example.com'
                }
            ];

            expect(result.results).toEqual(expectedResults);
        });

        it('sorts the results descending if sortDirection descending', async () => {
            const fetch = getMockFetch();
            const api = getApi(fetch);

            const result = await api.getUsers({
                ...defaultParameters,
                sortDirection: 'descending',
                sortBy: 'first',
                pageSize: 3,
                page: 2
            });

            const expectedResults = [
                {
                    name: { title: 'Mr', first: 'Bartel', last: 'Sinnige' },
                    email: 'bartel.sinnige@example.com'
                },
                {
                    name: { title: 'Mr', first: 'Albert', last: 'Calvo' },
                    email: 'albert.calvo@example.com'
                },
                {
                    name: { title: 'Mr', first: 'Abraham', last: 'Prinz' },
                    email: 'abraham.prinz@example.com'
                }
            ];

            expect(result.results).toEqual(expectedResults);
        });

        it('does not sort the results sortDirection unsorted', async () => {
            const fetch = getMockFetch();
            const api = getApi(fetch);

            const result = await api.getUsers({
                ...defaultParameters,
                sortDirection: 'unsorted',
                pageSize: 3,
                page: 2
            });

            const expectedResults = [
                {
                    name: { title: 'Mr', first: 'Abraham', last: 'Prinz' },
                    email: 'abraham.prinz@example.com'
                },
                {
                    name: { title: 'Mr', first: 'Albert', last: 'Calvo' },
                    email: 'albert.calvo@example.com'
                },
                {
                    name: { title: 'Mrs', first: 'Dolores', last: 'Lawson' },
                    email: 'dolores.lawson@example.com'
                }
            ];

            expect(result.results).toEqual(expectedResults);
        });

        it('sorts the results by first name if sortBy is first', async () => {
            const fetch = getMockFetch();
            const api = getApi(fetch);

            const result = await api.getUsers({
                ...defaultParameters,
                sortDirection: 'ascending',
                sortBy: 'first',
                pageSize: 3,
                page: 1
            });

            const expectedResults = [
                {
                    name: { title: 'Mr', first: 'Abraham', last: 'Prinz' },
                    email: 'abraham.prinz@example.com'
                },
                {
                    name: { title: 'Mr', first: 'Albert', last: 'Calvo' },
                    email: 'albert.calvo@example.com'
                },
                {
                    name: { title: 'Mr', first: 'Bartel', last: 'Sinnige' },
                    email: 'bartel.sinnige@example.com'
                }
            ];

            expect(result.results).toEqual(expectedResults);
        });

        it('sorts the results by last name if sortBy is last', async () => {
            const fetch = getMockFetch();
            const api = getApi(fetch);

            const result = await api.getUsers({
                ...defaultParameters,
                sortDirection: 'ascending',
                sortBy: 'last',
                pageSize: 3,
                page: 1
            });

            const expectedResults = [
                {
                    name: { title: 'Mr', first: 'Albert', last: 'Calvo' },
                    email: 'albert.calvo@example.com'
                },
                {
                    name: { title: 'Mrs', first: 'Dolores', last: 'Lawson' },
                    email: 'dolores.lawson@example.com'
                },
                {
                    name: { title: 'Miss', first: 'Lyna', last: 'Leroy' },
                    email: 'lyna.leroy@example.com'
                }
            ];

            expect(result.results).toEqual(expectedResults);
        });

        it('sorts the results by email if sortBy is email', async () => {
            const fetch = getMockFetch({
                results: [
                    {
                        name: {
                            title: 'Ms',
                            first: 'Gordana',
                            last: 'Piontek'
                        },
                        email: 'a'
                    },
                    {
                        name: { title: 'Miss', first: 'Lyna', last: 'Leroy' },
                        email: 'c'
                    },
                    {
                        name: { title: 'Mr', first: 'Bartel', last: 'Sinnige' },
                        email: 'b'
                    }
                ],
                info: {
                    seed: 'a',
                    results: 3,
                    page: 1,
                    version: '1.3',
                    totalUsers: 500
                }
            });
            const api = getApi(fetch);

            const result = await api.getUsers({
                ...defaultParameters,
                sortDirection: 'ascending',
                sortBy: 'email',
                pageSize: 3,
                page: 1
            });

            const expectedResults = [
                {
                    name: {
                        title: 'Ms',
                        first: 'Gordana',
                        last: 'Piontek'
                    },
                    email: 'a'
                },
                {
                    name: { title: 'Mr', first: 'Bartel', last: 'Sinnige' },
                    email: 'b'
                },
                {
                    name: { title: 'Miss', first: 'Lyna', last: 'Leroy' },
                    email: 'c'
                }
            ];

            expect(result.results).toEqual(expectedResults);
        });

        it('returns the page and page size that was asked for ~ page one', async () => {
            const fetch = getMockFetch();
            const api = getApi(fetch);

            const result = await api.getUsers({
                ...defaultParameters,
                sortDirection: 'unsorted',
                pageSize: 4,
                page: 1
            });

            const expectedResults = [
                {
                    name: { title: 'Ms', first: 'Gordana', last: 'Piontek' },
                    email: 'gordana.piontek@example.com'
                },
                {
                    name: { title: 'Miss', first: 'Lyna', last: 'Leroy' },
                    email: 'lyna.leroy@example.com'
                },
                {
                    name: { title: 'Mr', first: 'Bartel', last: 'Sinnige' },
                    email: 'bartel.sinnige@example.com'
                },
                {
                    name: { title: 'Mr', first: 'Abraham', last: 'Prinz' },
                    email: 'abraham.prinz@example.com'
                }
            ];

            expect(result.results).toEqual(expectedResults);
        });

        it('returns the page and page size that was asked for ~ page two', async () => {
            const fetch = getMockFetch();
            const api = getApi(fetch);

            const result = await api.getUsers({
                ...defaultParameters,
                sortDirection: 'unsorted',
                pageSize: 4,
                page: 2
            });

            const expectedResults = [
                {
                    name: { title: 'Mr', first: 'Albert', last: 'Calvo' },
                    email: 'albert.calvo@example.com'
                },
                {
                    name: { title: 'Mrs', first: 'Dolores', last: 'Lawson' },
                    email: 'dolores.lawson@example.com'
                }
            ];

            expect(result.results).toEqual(expectedResults);
        });
    });
});
