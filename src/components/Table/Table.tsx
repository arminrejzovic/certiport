import React, {useEffect, useState} from 'react';
import Styles from "./Table.module.css"


/**
 * @Param data - Any kind of data
 * @Param columns - Array of objects containing the text to be shown in Table Head (<text>) and the key of the attribute it refers to (<refersTo>)
 * @Param caption - Table title, optional
 * @Param sortMethod - Pass custom sorting functions for fields, or leave the default sort implementation
 * @Param select - enable single (radio) or multiple (checkbox) selection of rows, optional,
 * @Param defaultSort - pass column to sort by on initial render, optional
 */
interface TableProps<T> {
    data: T[];
    columns: {
        refersTo: keyof T;
        text: string;
    }[];
    caption?: string;
    sortMethod?: "default" | {
        [k in keyof T]?: (obj1: T, obj2: T) => -1 | 0 | 1
    };

    select?: {
        mode: "single" | "multi",
        onSelect: (obj: T) => any;
        onUnselect: (obj: T) => any;
        getPreselected: () => T[];
        onSelectionClear: () => any;
        onSelectAll?: (selected: T[]) => any;
    }

    rowActions?: {
        position: "start" | "end",
        actionElement: React.ReactNode;
        action: (obj: T) => any;
    }[];

    defaultSort?: { key: keyof T, order: SortOrder, sortingFunction?: (obj1: T, obj2: T) => -1 | 0 | 1 };
}

export enum SortOrder {
    "ASC" = 1,
    "DESC" = -1,
}

function Table<T>(props: TableProps<T>) {
    const [rows, setRows] = useState<T[]>([]);
    const [sortingBy, setSortingBy] = useState<keyof T | undefined>(undefined);
    const [sortingOrder, setSortingOrder] = useState<SortOrder>(SortOrder.ASC);

    useEffect(() => {
        if(props.defaultSort){
            const sortingFunction = props.defaultSort.sortingFunction ?? ((a: T, b: T) => {
                //@ts-ignore
                if (a[props.defaultSort.key] > b[props.defaultSort.key]) return 1 * props.defaultSort.order;
                //@ts-ignore
                if (a[props.defaultSort.key] < b[props.defaultSort.key]) return 1 * props.defaultSort.order;
                return 0;
            })
            const sorted = props.data.sort(sortingFunction);
            setRows(sorted);
        }
        else {
            setRows(props.data);
        }
    }, [props.data]);

    return (
        <table>
            {props.caption && <caption className={Styles.caption}>{props.caption}</caption>}
            <thead>
            <tr>
                {
                    props.select && (<th><button onClick={() => props!!.select!!.onSelectionClear()}>Clear</button></th>)
                }
                {
                    props.rowActions && props.rowActions.filter((ra) => ra.position === "start").map((a) => {
                        return <th></th>
                    })
                }
                {
                    props.columns.map((heading) => {
                        return (
                            <th
                                style={{cursor: props.sortMethod === "none" ? "" : "pointer"}}
                                key={String(heading.refersTo)}
                                onClick={() => {
                                    if (!props.sortMethod) return;
                                    let sortingFunction: (a: T, b: T) => -1 | 0 | 1;
                                    if (props.sortMethod === "default") {
                                        // @ts-ignore
                                        sortingFunction = (a, b) => {
                                            if (a[heading.refersTo] > b[heading.refersTo]) return 1 * sortingOrder;
                                            if (a[heading.refersTo] < b[heading.refersTo]) return -1 * sortingOrder;
                                            return 0;
                                        }
                                    } else {
                                        // @ts-ignore
                                        sortingFunction = props.sortMethod[heading.refersTo];
                                        if (!sortingFunction) throw Error(`Undefined Sorting function for property ${heading.text}`);
                                    }
                                    const sorted = [...rows.sort(sortingFunction)];
                                    setSortingBy(heading.refersTo);
                                    setSortingOrder(sortingOrder * -1);
                                    setRows(sorted);
                                }}
                            >{heading.text} {props.sortMethod ? (sortingBy === heading.refersTo) ? (sortingOrder === SortOrder.ASC ? "▲" : "▼") : "⇕" : ""}
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
                                // RENDERING SELECT IF SPECIFIED
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
                                // RENDERING START ROW ACTIONS
                                props.rowActions && props.rowActions.filter((ra) => ra.position === "start").map((a) => {
                                    return <td onClick={() => a.action(row)}>{a.actionElement}</td>
                                })
                            }
                            {
                                // RENDERING DATA
                                props.columns.map(({refersTo}) => {
                                    return <td style={{maxHeight: "max-content", maxWidth: "max-content"}} key={String(refersTo)}>{String(row[refersTo])}</td>
                                })
                            }
                            {
                                // RENDERING END ROW ACTIONS
                                props.rowActions && props.rowActions.filter((ra) => ra.position === "end").map((a) => {
                                    return <td style={{maxHeight: "max-content", maxWidth: "max-content"}} onClick={() => a.action(row)}>{a.actionElement}</td>
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