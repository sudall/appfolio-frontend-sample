import { SortDirection, SortKey } from 'components/UsersTable';
import { GetUsersResult } from 'data/types/RandomUserApi';
import * as QueryString from 'querystring';
import SystemUtils from 'utils/SystemUtils';
import FakeData from 'data/FakeData';

const api = {
    getUsers: async (
        page: number,
        pageSize: number,
        sortBy: SortKey,
        sortDirection: SortDirection
    ): Promise<GetUsersResult> => {
        const include = 'name,email';
        const seed = 'a';
        const endpoint = `https://randomuser.me/api/`;

        if (sortDirection === 'unsorted') {
            const query = QueryString.stringify({
                results: pageSize,
                page,
                inc: include,
                seed
            });

            const response = await fetch(`${endpoint}?${query}`);
            return response.json();
        } else {
            // TODO I was running into fetch limits on the randomuser API with this
            //  code, so instead I'm just faking the response.
            // const query = QueryString.stringify({
            //     // get all 500 since there is no backend sorting available
            //     results: totalUsers,
            //     inc: include,
            //     seed
            // });
            //
            // const response = await fetch(`${endpoint}?${query}`);
            // const result: GetUsersResult = await response.json();
            await SystemUtils.setTimeout(500);
            const result: GetUsersResult = FakeData.allUsersResponse;

            if (result.results != null) {
                const pageFirstItemIndex = (page - 1) * pageSize;
                const pageLastItemIndex = pageFirstItemIndex + pageSize - 1;
                const sortDirectionModifier =
                    sortDirection === 'ascending' ? 1 : -1;

                // sort the result
                result.results = result.results
                    .sort((a, b) => {
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
                    })
                    // only keep the page that was asked for
                    .filter((item, index) => {
                        return (
                            index >= pageFirstItemIndex &&
                            index <= pageLastItemIndex
                        );
                    });

                result.info.results = result.results.length;
            }

            return result;
        }
    }
};

export default api;
export type Api = typeof api;
