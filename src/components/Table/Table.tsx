import React, {ReactElement, useEffect, useMemo, useState} from 'react';
import Styles from "./Table.module.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faForwardStep, faBackwardStep, faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";

// TODO Remove custom sorting methods
// TODO Do something about non-flat data - maybe pass flatten function as a prop
// TODO Think about how columns work
// TODO Think about adding custom row rendering method as a prop
// TODO Fix sorting when table is paginated
// TODO Consider removing rowActions, since they overlap with custom rows
// TODO Change defaultSort by removing the option to pass a custom sorting function
// TODO Consider making <T> tabular, as in make it extend a "Tabular" interface, which is an object containing only numbers, strings, dates, booleans
// TODO Make <tfoot> stick to the bottom

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
    primaryKey: keyof T;
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

    customRows?: {
        position: "start" | "end",
        render: (item: T) => ReactElement<HTMLTableDataCellElement>;
    }[];

    pagination?: {
        itemsPerPage: number;
    }
}

export enum SortOrder {
    "ASC" = -1,
    "DESC" = 1,
}


function Table<T>(props: TableProps<T>) {
    // Data
    const [rows, setRows] = useState<T[]>([]);
    // Sorting
    const [sortingBy, setSortingBy] = useState<keyof T | undefined>(undefined);
    const [sortingOrder, setSortingOrder] = useState<SortOrder>(SortOrder.ASC);
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (props.defaultSort) {
            const sortingFunction = props.defaultSort.sortingFunction ?? ((a: T, b: T) => {
                //@ts-ignore
                if (a[props.defaultSort.key] > b[props.defaultSort.key]) return 1 * props.defaultSort.order;
                //@ts-ignore
                if (a[props.defaultSort.key] < b[props.defaultSort.key]) return 1 * props.defaultSort.order;
                return 0;
            })
            const sorted = props.data.sort(sortingFunction);
            setRows(sorted);
        } else {
            setRows(props.data);
        }
    }, [props.data]);

    function resolveSortingSymbol(heading: string | symbol | number) {
        if (!props.sortMethod) {
            // No sorting at all
            return "";
        }

        if (heading !== sortingBy) {
            // Sorting enabled, but sorting by different column
            return "⇕";
        }

        if (sortingOrder === SortOrder.ASC) {
            // Sorting by this column, Ascending order
            return "▲";
        }

        // Sorting by this column, Descending order
        return "▼";
    }

    function getStartBound(){
        if(!props.pagination){
            return  undefined;
        }

        const endIndex = currentPage * props.pagination.itemsPerPage;
        return endIndex - props.pagination.itemsPerPage;
    }

    function getEndBound(){
        if(!props.pagination){
            return  undefined;
        }

        return currentPage * props.pagination.itemsPerPage;
    }

    return (
        <table>
            {props.caption && <caption className={Styles.caption}>{props.caption}</caption>}
            <thead>
            <tr>
                {
                    props.select &&
                    <th style={{textAlign: "center"}}>
                        <button onClick={() => props!!.select!!.onSelectionClear()}>Clear</button>
                    </th>
                }
                {
                    // Rendering empty <th> tags for each start row action
                    props.rowActions &&
                    props.rowActions.filter((ra) => ra.position === "start").map((a, i) => {
                        return <th key={i}></th>
                    })
                }
                {
                    // Rendering empty <th> tags for start custom row
                    props.customRows &&
                    props.customRows.filter((cr) => cr.position === "start").map((a, i) => {
                        return <th key={i}></th>
                    })
                }
                {
                    // Rendering HEADINGS
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
                            >
                                {heading.text} {resolveSortingSymbol(heading.refersTo)}
                            </th>
                        )
                    })
                }
            </tr>
            </thead>
            <tbody>
            {
                rows.slice(getStartBound(), getEndBound()).map((row, rowIndex) => {
                    return (
                        <tr key={String(row[props.primaryKey])}>
                            {
                                // RENDERING SELECT IF SPECIFIED
                                props.select && (
                                    <td style={{textAlign: "center"}}>
                                        <input
                                            name={props.caption}
                                            type={props.select.mode === "single" ? "radio" : "checkbox"}
                                            checked={props.select.getPreselected().some((item) => item[props.primaryKey] === row[props.primaryKey])}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    props.select?.onSelect(row);
                                                } else {
                                                    props.select?.onUnselect(row);
                                                }
                                            }}
                                        />
                                    </td>
                                )
                            }
                            {
                                // RENDERING START ROW ACTIONS
                                props.rowActions &&
                                props.rowActions.filter((ra) => ra.position === "start").map((a, i) => {
                                    return (
                                        <td
                                            key={`start ${rowIndex}.${i}`}
                                            onClick={() => a.action(row)}
                                        >
                                            {a.actionElement}
                                        </td>
                                    )
                                })
                            }
                            {
                                // RENDERING START CUSTOM ROWS
                                props.customRows &&
                                props.customRows.filter((cr) => cr.position === "start").map((a, i) => {
                                    return (
                                        a.render(row)
                                    );
                                })
                            }
                            {
                                // RENDERING DATA
                                props.columns.map(({refersTo}) => {
                                    return (
                                        <td
                                            style={{maxHeight: "max-content", maxWidth: "max-content"}}
                                            key={String(refersTo)}
                                        >
                                            {String(row[refersTo])}
                                        </td>
                                    )
                                })
                            }
                            {
                                // RENDERING END CUSTOM ROWS
                                props.customRows &&
                                props.customRows.filter((cr) => cr.position === "end").map((a, i) => {
                                    return (
                                        a.render(row)
                                    );
                                })
                            }
                            {
                                // RENDERING END ROW ACTIONS
                                props.rowActions &&
                                props.rowActions.filter((ra) => ra.position === "end").map((a, i) => {
                                    return (
                                        <td
                                            key={`end ${rowIndex}.${i}`}
                                            style={{maxHeight: "max-content", maxWidth: "max-content"}}
                                            onClick={() => a.action(row)}>{a.actionElement}
                                        </td>
                                    )
                                })
                            }
                        </tr>
                    )
                })
            }
            </tbody>
            {
                props.pagination && (
                <tfoot>
                    <div>
                        <span>
                            {(currentPage - 1) * props.pagination.itemsPerPage + 1} - {Math.min(currentPage * props.pagination.itemsPerPage, rows.length)} of {rows.length}
                        </span>
                        <span>
                            <FontAwesomeIcon icon={faBackwardStep} onClick={() => {
                                if(currentPage !== 1) setCurrentPage(1);
                            }}
                            />
                        </span>
                        <span>
                            <FontAwesomeIcon icon={faChevronLeft} onClick={() => {
                                if(currentPage > 1) setCurrentPage(currentPage - 1);
                            }}/>
                        </span>
                        <span>
                            <FontAwesomeIcon icon={faChevronRight} onClick={() => {
                                const totalPages = Math.ceil(rows.length / props.pagination!!.itemsPerPage);
                                if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                            }}/>
                        </span>
                        <span>
                            <FontAwesomeIcon icon={faForwardStep} onClick={() => {
                                const totalPages = Math.ceil(rows.length / props.pagination!!.itemsPerPage);
                                setCurrentPage(totalPages);
                            }}/>
                        </span>
                    </div>
                </tfoot>
                )
            }
        </table>
    );
}

export default Table;