import React, {useState} from 'react';
import Table from "../components/Table/Table";

function Certificates() {

    type User = {
        id: number;
        name: string;
        surname: string;
        email: string;
        phone: string;
    }

    type Supplier = {
        id: number;
        name: string;
        city: string;
        index: number;
    }

    const users = [
        {
            id: 1,
            name: "Mirel",
            surname: "Bajrić",
            email: "mbajric@mail.com",
            phone: "+387 61 123 456"
        },
        {
            id: 2,
            name: "Samir",
            surname: "Suljanović",
            email: "ssuljanovic@mail.com",
            phone: "+387 61 123 456"
        },
        {
            id: 3,
            name: "Senad",
            surname: "Kasumović",
            email: "skasumovic@mail.com",
            phone: "+387 61 123 456"
        },
        {
            id: 4,
            name: "Miralem",
            surname: "Bajrić",
            email: "miralembajric@mail.com",
            phone: "+387 61 123 456"
        },
        {
            id: 5,
            name: "Admir",
            surname: "Hasanović",
            email: "ahasanovic@mail.com",
            phone: "+387 61 123 456"
        },
        {
            id: 6,
            name: "Wolfgang",
            surname: "Stark",
            email: "wstark@mail.com",
            phone: "+387 61 123 456"
        }
    ];

    const suppliers: Supplier[] = [
        {
            id: 1,
            name: "Andemis GMBH",
            city: "Berlin",
            index: 1
        },
        {
            id: 2,
            name: "DCCS d.o.o.",
            city: "Tuzla",
            index: 1
        },
        {
            id: 3,
            name: "Daimler",
            city: "Stuttgart",
            index: 1
        },
        {
            id: 4,
            name: "Paradox Interactive",
            city: "Stockholm",
            index: 1
        },
    ]

    const [selected, setSelected] = useState<Supplier>();
    const [multiSelected, setMultiSelected] = useState<User[]>([users[2], users[3]]);

    return (
        <main>
            <Table
                <Supplier>
                data={suppliers}
                caption={"Users in the database"}
                columns={[{text: "Name", refersTo: "name"}, {text: "City", refersTo: "city"}, {text: "Index", refersTo: "index"}]}
                sortBy={"default"}
                select={{
                    mode: "single",
                    onSelect: (s: Supplier) => setSelected(s),
                    onUnSelect: (s: Supplier) => console.log(s),
                    getPreselected: () => selected ? [selected] : [],
                    onSelectionClear: () => setSelected(undefined)
                }}
            />


            <div>
                <h1>SELECTED SUPPLIER</h1>
                <h4>{selected?.name} ({selected?.city})</h4>
            </div>


            <Table
                <User>
                data={users}
                caption={"MULTI SELECT"}
                columns={[{text: "Name", refersTo: "name"}, {text: "Surname", refersTo: "surname"}, {text: "Email", refersTo: "email"}, {text: "Phone number", refersTo: "phone"}]}
                sortBy={"default"}
                select={{
                    mode: "multi",
                    onSelect: (user: User) => setMultiSelected([...multiSelected, user]),
                    onUnSelect: (user: User) => setMultiSelected([...multiSelected.filter((old) => user.id !== old.id)]),
                    getPreselected: () => multiSelected,
                    onSelectionClear: () => setMultiSelected([])
                }}
            />


            <div>
                <h1>SELECTED USERS</h1>
                <ol>
                    {multiSelected.map((user) => <li>{user.name} {user.surname}</li>)}
                </ol>
            </div>
        </main>
    );
}

export default Certificates;