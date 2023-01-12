import React, {ReactElement, useEffect, useState} from 'react';
import Styles from "./Table.module.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBackwardStep, faChevronLeft, faChevronRight, faForwardStep} from "@fortawesome/free-solid-svg-icons";

// TODO Remove custom sorting methods                                                                                   DONE
// TODO Do something about non-flat data - maybe pass flatten function as a prop                                        DONE - custom render method
// TODO Think about how columns work                                                                                    Added align
// TODO Think about adding custom row rendering method as a prop                                                        DONE
// TODO Fix sorting when table is paginated                                                                             DONE
// TODO Consider removing rowActions, since they overlap with custom rows                                               DONE
// TODO Change defaultSort by removing the option to pass a custom sorting function
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
        align?: "right" | "left" | "center"
    }[];
    caption?: string;
    sort?: true | undefined;

    select?: {
        mode: "single" | "multi",
        onSelect: (obj: T) => void;
        onUnselect: (obj: T) => void;
        getPreselected: () => T[];
        onSelectionClear: () => void;
        onSelectAll?: () => void;
    }

    widgets?: {
        position: "start" | "end",
        render: (item: T) => ReactElement<HTMLTableDataCellElement, any>;
    }[];

    customRenderRowData?: (row: T) => ReactElement;

    itemsPerPage?: number;

}

export enum SortOrder {
    "ASC" = -1,
    "DESC" = 1,
}

function Table<T>(props: TableProps<T>) {
    // Data
    // If there is no pagination, all data is considered one page
    const [rows, setRows] = useState<T[]>([]);
    // Sorting
    const [sortingBy, setSortingBy] = useState<keyof T | undefined>(undefined);
    const [sortingOrder, setSortingOrder] = useState<SortOrder>(SortOrder.ASC);
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [startBound, setStartBound] = useState(1);
    const [endBound, setEndBound] = useState(1);

    useEffect(() => {
        setRows(props.data);
    }, [props.data]);

    function resolveSortingSymbol(heading: string | symbol | number) {
        if (!props.sort) {
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

    function getStartBound() {
        if (!props.itemsPerPage) {
            return undefined;
        }

        const endIndex = currentPage * props.itemsPerPage;
        return endIndex - props.itemsPerPage;
    }

    function getEndBound() {
        if (!props.itemsPerPage) {
            return undefined;
        }

        return currentPage * props.itemsPerPage;
    }

    function ss<T>(arr: T[], start: number, end: number): T[] {
        const sliceToSort = arr.slice(start, end);
        sliceToSort.sort();
        arr.splice(start, end - start, ...sliceToSort);
        return arr;
    }

    function partialSort<T>(arr: T[], start: number, end: number, sortingFunction: (a: T, b: T) => -1 | 0 | 1) {
        const part = arr.splice(start, end - start );
        console.log(part);
        part.sort(sortingFunction);
        console.log(part);
        arr.splice(start, 0, ...part);
        return arr;
    }

    function renderSelect(row: T){
        return (
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
        )
    }

    function renderWidgets(row: T, position: "start" | "end"){
        return (
            props.widgets &&
            props.widgets.filter((cr) => cr.position === position).map((a, i) => {
                return (
                    a.render(row)
                );
            })
        );
    }

    return (
        <table>
            {props.caption && <caption className={Styles.caption}>{props.caption}</caption>}
            <thead>
            <tr>
                {
                    props.select && (
                        <th style={{textAlign: "center"}}>
                            <button onClick={() => {
                                if(props.select!!.getPreselected().length < 1) {
                                    // The selection is empty
                                    // @ts-ignore
                                    props!!.select.onSelectAll();
                                }
                                else {
                                    props.select!!.onSelectionClear()
                                }
                            }}>{props.select.getPreselected().length < 1 ? "Select all" : "Clear"}</button>
                        </th>
                    )
                }
                {
                    // Rendering empty <th> tags for start widgets
                    props.widgets &&
                    props.widgets.filter((cr) => cr.position === "start").map((a, i) => {
                        return <th key={i}></th>
                    })
                }
                {
                    // Rendering HEADINGS
                    props.columns.map((heading) => {
                        return (
                            <th
                                style={{cursor: props.sort ? "" : "pointer", textAlign: heading.align}}
                                key={String(heading.refersTo)}
                                onClick={() => {
                                    if (!props.sort) return;

                                    const sortingFunction = (a: T, b: T) => {
                                        if (a[heading.refersTo] > b[heading.refersTo]) return 1 * sortingOrder;
                                        if (a[heading.refersTo] < b[heading.refersTo]) return -1 * sortingOrder;
                                        return 0;
                                    }

                                    setSortingBy(heading.refersTo);
                                    setSortingOrder(sortingOrder * -1);

                                    if(props.itemsPerPage){
                                        // Sort only the current page
                                        // @ts-ignore
                                        const sorted = partialSort(rows, getStartBound(), getEndBound(), sortingFunction);
                                        setRows(sorted);
                                    }
                                    else {
                                        setRows(rows.sort(sortingFunction))
                                    }
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
                    if(props.customRenderRowData){
                        return (
                            <tr key={String(row[props.primaryKey])}>
                                {
                                    // RENDERING SELECT IF SPECIFIED
                                    renderSelect(row)
                                }
                                {
                                    // RENDERING START WIDGETS
                                    renderWidgets(row, "start")
                                }
                                {
                                    // @ts-ignore
                                    props.customRenderRowData(row)
                                }
                                {
                                    // RENDERING END WIDGETS
                                    renderWidgets(row, "end")
                                }
                            </tr>
                        );
                    }
                    return (
                        <tr key={String(row[props.primaryKey])}>
                            {
                                // RENDERING SELECT IF SPECIFIED
                                renderSelect(row)
                            }
                            {
                                // RENDERING START WIDGETS
                                renderWidgets(row, "start")
                            }
                            {
                                // RENDERING DATA
                                props.columns.map(({refersTo, align}) => {
                                    return (
                                        <td
                                            style={{textAlign: align}}
                                            key={String(refersTo)}
                                        >
                                            {String(row[refersTo])}
                                        </td>
                                    )
                                })
                            }
                            {
                                // RENDERING END WIDGETS
                                renderWidgets(row, "end")
                            }
                        </tr>
                    )
                })
            }
            </tbody>
            {
                props.itemsPerPage && (
                    <tfoot>
                    <div>
                        <span>
                            {(currentPage - 1) * props.itemsPerPage + 1} - {Math.min(currentPage * props.itemsPerPage, props.data.length)} of {props.data.length}
                        </span>
                        <span>
                            <FontAwesomeIcon icon={faBackwardStep} onClick={() => {
                                if (currentPage !== 1) setCurrentPage(1);
                            }}
                            />
                        </span>
                        <span>
                            <FontAwesomeIcon icon={faChevronLeft} onClick={() => {
                                if (currentPage > 1) {
                                    setCurrentPage(currentPage - 1);
                                }
                            }}/>
                        </span>
                        <span>
                            <FontAwesomeIcon icon={faChevronRight} onClick={() => {
                                // @ts-ignore
                                const totalPages = Math.ceil(props.data.length / props.itemsPerPage);
                                if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                            }}/>
                        </span>
                        <span>
                            <FontAwesomeIcon icon={faForwardStep} onClick={() => {
                                // @ts-ignore
                                const totalPages = Math.ceil(props.data.length / props!!.itemsPerPage);
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