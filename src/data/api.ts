import { GetUsersResult } from 'data/types/RandomUserApi';
import * as QueryString from 'querystring';
import { SortDirection, SortKey } from 'components/UsersTable/UsersTable';
import _ from 'lodash';

let cachedResult: GetUsersResult | null = null;

const api = {
    getUsers: async (
        page: number,
        pageSize: number,
        sortBy: SortKey,
        sortDirection: SortDirection
    ): Promise<GetUsersResult> => {
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

        if (cachedResult == null) {
            cachedResult = await getUsersFromEndpoint();
        }

        const result = _.cloneDeep(cachedResult);

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
                                return a.name.first.localeCompare(b.name.first);
                            case 'last':
                                return a.name.last.localeCompare(b.name.last);
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
                    index >= pageFirstItemIndex && index <= pageLastItemIndex
                );
            });

            result.info.results = result.results.length;
        }

        return result;
    }
};

export default api;
export type Api = typeof api;
