import { GetUsersResult } from 'data/types/RandomUserApi';
import * as QueryString from 'querystring';
import { SortDirection, SortKey } from 'components/UsersTable/UsersTable';
import _ from 'lodash';

type Fetch = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

const getApi = (fetch: Fetch) => {
    let cachedResultPromise: Promise<GetUsersResult> | null = null;

    const getUsersFromEndpoint = async () => {
        const include = 'name,email';
        const seed = 'a';
        const endpoint = `https://randomuser.me/api/`;
        const fetchPageSize = 500;

        const query = QueryString.stringify({
            results: fetchPageSize,
            page: 1,
            inc: include,
            seed
        });

        const response = await fetch(`${endpoint}?${query}`);
        const result: GetUsersResult = await response.json();
        result.info.totalUsers = fetchPageSize;
        return result;
    };

    return {
        getUsers: async ({
            page,
            pageSize,
            sortBy,
            sortDirection
        }: {
            page: number;
            pageSize: number;
            sortBy: SortKey;
            sortDirection: SortDirection;
        }): Promise<GetUsersResult> => {
            if (cachedResultPromise == null) {
                cachedResultPromise = getUsersFromEndpoint();
            }

            const result = _.cloneDeep(await cachedResultPromise);

            if (result.results != null) {
                if (sortDirection !== 'unsorted') {
                    const sortDirectionModifier =
                        sortDirection === 'ascending' ? 1 : -1;

                    // sort the results
                    result.results = result.results.sort((a, b) => {
                        const compare = () => {
                            switch (sortBy) {
                                case 'email':
                                    return a.email.localeCompare(b.email);
                                case 'first':
                                    return a.name.first.localeCompare(
                                        b.name.first
                                    );
                                case 'last':
                                    return a.name.last.localeCompare(
                                        b.name.last
                                    );
                            }

                            return 0;
                        };

                        return compare() * sortDirectionModifier;
                    });
                }

                // only keep the page that was asked for
                const pageFirstItemIndex = (page - 1) * pageSize;
                const pageLastItemIndex = pageFirstItemIndex + pageSize - 1;
                result.results = result.results.filter((item, index) => {
                    return (
                        index >= pageFirstItemIndex &&
                        index <= pageLastItemIndex
                    );
                });

                result.info.results = result.results.length;
            }

            return result;
        }
    };
};

export default getApi;
export type Api = ReturnType<typeof getApi>;
