import * as React from 'react';
import { GetUsersResult } from 'data/types/RandomUserApi';

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
                            <td>{item.email}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

export default UsersTable;

// import * as React from 'react';
// import { ReactNode } from 'react';
//
// export type Props<TData> = {
//     data: TData[];
//     columns: {
//         key: string;
//         headerRenderer: () => ReactNode;
//         cellRenderer: (item: TData) => ReactNode;
//     }[];
// };
//
// function UsersTable<TData>({ data, columns }: Props<TData>) {
//     return (
//         <table>
//             <thead>
//                 <tr>
//                     {columns.map(column => {
//                         return <th>{column.headerRenderer()}</th>;
//                     })}
//                 </tr>
//             </thead>
//             <tbody>
//                 {data.map(item => {
//                     return (
//                         <tr>
//                             {columns.map(column => {
//                                 return <td>{column.cellRenderer()}</td>;
//                             })}
//                         </tr>
//                     );
//                 })}
//             </tbody>
//         </table>
//     );
// }
//
// export default UsersTable;
