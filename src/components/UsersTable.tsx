import * as React from 'react';
import { GetUsersResult } from 'data/types/RandomUserApi';
import { Link } from '@chakra-ui/core';

export type Props = {
    data: Required<GetUsersResult>['results'];
};

function UsersTable({ data }: Props) {
    return (
        <table>
            <thead>
                <tr>
                    <th>First</th>
                    <th>Last</th>
                    <th>Email</th>
                </tr>
            </thead>
            <tbody>
                {data.map(item => {
                    return (
                        <tr>
                            <td>{item.name.first}</td>
                            <td>{item.name.last}</td>
                            <td>
                                <Link href={`mailto:${item.email}`}>
                                    {item.email}
                                </Link>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

export default UsersTable;
