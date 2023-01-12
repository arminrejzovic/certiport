import React, {useEffect, useState} from 'react';
import Table from "../components/Table/Table";

interface Supplier{
    id: number;
    name: string;
    index: number;
    city: string;
}

function Suppliers() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);

    useEffect(() => {
        const mockSuppliers: Supplier[] = [
            {
                id: 1,
                name: "DCCS",
                city: "Tuzla",
                index: 1
            },
            {
                id: 2,
                name: "Jetbrains",
                city: "Saint Petersburg",
                index: 1
            },
            {
                id: 3,
                name: "NLB",
                city: "Ljubljana",
                index: 1
            },
            {
                id: 4,
                name: "Gema",
                city: "Ilijaš",
                index: 1
            },
            {
                id: 5,
                name: "Soko BH",
                city: "Tuzla",
                index: 1
            }
        ];
        setSuppliers(mockSuppliers);
    }, []);

    const [selectedSuppliers, setSelectedSuppliers] = useState<Supplier[]>([]);
    const [bestSupplier, setBestSupplier] = useState<Supplier | undefined>(undefined);

    return (
        <div>
            <button onClick={() => setSuppliers([...suppliers, {id: 51, name: "Microsoft", city: "Seattle", index: 62}])}>ADD MICROSOFT</button>
            <button onClick={() => setSuppliers([...suppliers, {id: 52, name: "Amazon", city: "Pensacola", index: 69}])}>ADD Amazon</button>
            <button onClick={() => setSuppliers(suppliers.filter(s => s.id !== 3))}>REMOVE ID 3</button>

            <h1>Suppliers table demo</h1>
            <Table
                <Supplier>
                data={suppliers}
                primaryKey={"name"}
                columns={[{text: "Name", refersTo: "name", align: "center"}, {text: "City", refersTo: "city", align: "center"}, {text: "Index", refersTo: "index", align: "center"}]}
                select={{
                    mode: "multi",
                    onSelect: (s) => setSelectedSuppliers([...selectedSuppliers, s]),
                    onSelectionClear: () => setSelectedSuppliers([]),
                    onSelectAll: () => setSelectedSuppliers(suppliers),
                    onUnselect: (s) => setSelectedSuppliers(selectedSuppliers.filter((es) => s.id != es.id)),
                    getPreselected: () => selectedSuppliers
                }}
            />

            <div>
                <h2>Selected suppliers [multiple]</h2>
                {
                    selectedSuppliers.map((ss) => <p>{ss.name}</p>)
                }
            </div>

            <Table
                <Supplier>
                data={suppliers}
                primaryKey={"name"}
                columns={[{text: "Name", refersTo: "name", align: "center"}, {text: "City", refersTo: "city", align: "center"}, {text: "Index", refersTo: "index", align: "center"}]}
                select={{
                    mode: "single",
                    onSelect: (s) => setBestSupplier(s),
                    onSelectionClear: () => setBestSupplier(undefined),
                    onUnselect: (s) => setBestSupplier(undefined),
                    getPreselected: () => bestSupplier ? [bestSupplier] : []
                }}
                customRenderRowData={(s) => {
                    return (
                        <>
                            <td>{s.name}</td>
                            <td>City of {s.city}</td>
                            <td>{s.index}.</td>
                        </>
                    )
                }}
            />

            <div>
                <h2>Best supplier [single]</h2>
                <p>{bestSupplier?.name}</p>
            </div>
        </div>
    );
}

export default Suppliers;