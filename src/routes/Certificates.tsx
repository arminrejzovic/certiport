import React, {useState} from 'react';
import Table, {SortOrder} from "../components/Table/Table";

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

    type Country = {
        name: string;
        capital: string;
        language: string;
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
            index: 2
        },
        {
            id: 3,
            name: "Daimler",
            city: "Stuttgart",
            index: 3
        },
        {
            id: 4,
            name: "Paradox Interactive",
            city: "Stockholm",
            index: 4
        },
    ];

    let countries = [
        {
            name: "Russia",
            capital: "Moscow",
            language: "Russian"
        },
        {
            name: "Turkey",
            capital: "Ankara",
            language: "Turkish"
        },
        {
            name: "Bosnia and Herzegovina",
            capital: "Sarajevo",
            language: "Bosnian"
        },
        {
            name: "Iran",
            capital: "Tehran",
            language: "Farsi"
        },
        {
            name: "Belarus",
            capital: "Minsk",
            language: "Belorussian"
        },
    ]

    const [selected, setSelected] = useState<Supplier>();
    const [multiSelected, setMultiSelected] = useState<User[]>([users[2], users[3]]);
    const [nations, setNations] = useState(countries);
    const [employees, setEmployees] = useState(users);

    return (
        <main>
            <Table
                <Supplier>
                data={suppliers}
                caption={"Users in the database"}
                columns={[{text: "Name", refersTo: "name"}, {text: "City", refersTo: "city"}, {text: "Index", refersTo: "index"}]}
                sortMethod={"default"}
                select={{
                    mode: "single",
                    onSelect: (s: Supplier) => setSelected(s),
                    onUnselect: (s: Supplier) => console.log(s),
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
                data={employees}
                caption={"MULTI SELECT"}
                columns={[{text: "Name", refersTo: "name"}, {text: "Surname", refersTo: "surname"}, {text: "Email", refersTo: "email"}, {text: "Phone number", refersTo: "phone"}]}
                sortMethod={"default"}
                select={{
                    mode: "multi",
                    onSelect: (user: User) => setMultiSelected([...multiSelected, user]),
                    onUnselect: (user: User) => setMultiSelected([...multiSelected.filter((old) => user.id !== old.id)]),
                    getPreselected: () => multiSelected,
                    onSelectionClear: () => setMultiSelected([])
                }}
                defaultSort={{key: "surname", order: SortOrder.DESC}}
                rowActions={[
                    {position: "start", actionElement: <button>Alert name</button>, action: (u) => alert(u.name)},
                    {position: "end", actionElement: <button>x</button>, action: (u) => {
                        setEmployees(employees.filter(emp => emp.id !== u.id));
                        setMultiSelected(multiSelected.filter(emp => emp.id !== u.id));
                    }}
                ]}
            />


            <div>
                <h1>SELECTED USERS</h1>
                <ol>
                    {multiSelected.map((user) => <li>{user.name} {user.surname}</li>)}
                </ol>
            </div>

            <Table
                <Country>
                data={nations}
                caption={"Regular table without sorting and selecting"}
                columns={[{text: "Name", refersTo: "name"}, {text: "Capital City", refersTo: "capital"}, {text: "Official Language", refersTo: "language"}]}
                defaultSort={{key: "capital", order: SortOrder.DESC}}
                rowActions={[
                    {position: "start", actionElement: <button>Alert name</button>, action: (c) => alert(c.name)},
                    {position: "end", actionElement: <button>Alert capital</button>, action: (c) => alert(c.capital)},
                    {position: "end", actionElement: <button>Alert language</button>, action: (c) => alert(c.language)},
                    {position: "end", actionElement: <button>x</button>, action: (c) => {setNations(nations.filter(n => n.name !== c.name))}}
                ]}
            />
        </main>
    );
}

export default Certificates;