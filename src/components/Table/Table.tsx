import React, {useEffect, useState} from 'react';
import Styles from "./Table.module.css"


/**
 * @Param data - Any kind of data
 * @Param columns - Array of objects containing the text to be shown in Table Head (<text>) and the key of the attribute it refers to (<refersTo>)
 * @Param caption - Table title, optional
 * @Param sortBy - Allows sorting table by particular column, function object that has keys like <T> which map to sorting functions
 * @Param paginateBy - Number of rows to be displayed in one page, by default table shows all rows
 */
interface TableProps<T> {
    data: T[];
    columns: {
        refersTo: keyof T;
        text: string;
    }[];
    caption?: string;
    sortBy?: "default" | {
        [k in keyof T]?: (obj1: T, obj2: T) => -1 | 0 | 1
    };

    select?: {
        mode: "single" | "multi",
        onSelect: (obj: T) => any;
        onUnSelect: (obj: T) => any;
        getPreselected: () => T[];
        onSelectionClear: () => any;
    }

    rowAction?: {
        position: "start" | "end",
        actionElement: JSX.Element | JSX.Element[];
    }

    paginateBy?: number;
}

enum SortState {
    "ASC" = 1,
    "DESC" = -1,
}

function Table<T>(props: TableProps<T>) {
    const [rows, setRows] = useState<T[]>([]);
    // TODO change to SortingBy(some key: state(asc, desc))
    const [sortState, setSortState] = useState<{[key in keyof T]?: SortState}>()

    useEffect(() => {
        setRows(props.data);
        let sort: {[key in keyof T]?: SortState} = {};
        props.columns.forEach((col) => sort[col.refersTo] = SortState.ASC);
        setSortState(sort);
    }, []);

    return (
        <table>
            {props.caption && <caption className={Styles.caption}>{props.caption}</caption>}
            <thead>
            <tr>
                {
                    props.select && (<th><button onClick={() => props!!.select!!.onSelectionClear()}>Clear</button></th>)
                }
                {
                    props.columns.map((heading) => {
                        return (
                            <th
                                style={{cursor: props.sortBy === "none" ? "" : "pointer"}}
                                key={String(heading.refersTo)}
                                onClick={() => {
                                    if (!props.sortBy) return;
                                    let sortingFunction: (a: T, b: T) => -1 | 0 | 1;
                                    if (props.sortBy === "default") {
                                        // @ts-ignore
                                        sortingFunction = (a, b) => {
                                            if (a[heading.refersTo] > b[heading.refersTo]) return 1 * sortState!![heading.refersTo]!!;
                                            if (a[heading.refersTo] < b[heading.refersTo]) return -1 * sortState!![heading.refersTo]!!;
                                            return 0;
                                        }
                                    } else {
                                        // @ts-ignore
                                        sortingFunction = props.sortBy[heading.refersTo];
                                        if (!sortingFunction) throw Error(`Undefined Sorting function for property ${heading.text}`);
                                    }
                                    const sorted = [...rows.sort(sortingFunction)];
                                    // @ts-ignore
                                    setSortState({...sortState, [heading.refersTo]: sortState[heading.refersTo] * -1})
                                    setRows(sorted);
                                }}
                            >{heading.text} {sortState && sortState[heading.refersTo] === SortState.ASC ? "▲" : "▼"}
                            </th>
                        )
                    })
                }
            </tr>
            </thead>
            <tbody>
            {
                rows.map((row) => {
                    return (
                        <tr key={JSON.stringify(row)}>
                            {
                                props.select && (
                                    <td>
                                        <input
                                            name={props.caption}
                                            type={props.select.mode === "single" ? "radio" : "checkbox"}
                                            checked={props.select.getPreselected().includes(row)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    //@ts-ignore
                                                    props.select.onSelect(row);
                                                } else {
                                                    //@ts-ignore
                                                    props.select.onUnSelect(row);
                                                }
                                            }}
                                        />
                                    </td>
                                )
                            }
                            {
                                props.columns.map(({refersTo}) => {
                                    return <td key={String(refersTo)}>{String(row[refersTo])}</td>
                                })
                            }
                        </tr>
                    )
                })
            }
            </tbody>
        </table>
    );
}

export default Table;