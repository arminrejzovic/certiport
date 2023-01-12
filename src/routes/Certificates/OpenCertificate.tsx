import React, {useEffect, useState} from 'react';
import {Certificate} from "./Certificates";
import Input from "../../components/Utils/Input/Input";
import Table from "../../components/Table/Table";

function OpenCertificate() {
    const [certificate, setCertificate] = useState<Certificate | undefined>(undefined);
    const [assignedEmployees, setAssignedEmployees] = useState<{id: number, name: string, dept: string, plant: string}[]>([])

    useEffect(() => {
        const mock: Certificate = {
            id: 12,
            type: "Russian A1",
            supplier: "Lomonosov University",
            validFrom: "01.01.2022",
            validTo: "01.01.2023"
        }

        const workers = [
            {
                id: 1,
                name: "Samir Suljanović",
                dept: "NSD",
                plant: "074"
            },
            {
                id: 2,
                name: "Senad Kasumović",
                dept: "NSD",
                plant: "076"
            },
            {
                id: 3,
                name: "Mirel Bajrić",
                dept: "TLX",
                plant: "064"
            },
            {
                id: 4,
                name: "Andrej Tutić",
                dept: "NSD",
                plant: "071"
            }
        ];

        setCertificate(mock);
        setAssignedEmployees(workers);
    }, [])

    return (
        <div style={{display: "flex", gap: "2rem"}}>
            <div>
                <h1>Basic information</h1>
                <Input disabled value={certificate?.type} label={"Certificate type"}/>
                <Input disabled value={certificate?.supplier} label={"Supplier"}/>
                <Input disabled value={certificate?.validFrom} label={"Valid from"}/>
                <Input disabled value={certificate?.validTo} label={"Valid to"}/>

                <h1>Assigned employees</h1>
                <Table
                    data={assignedEmployees}
                    primaryKey={"id"}
                    columns={[
                        {text: "Full name", refersTo: "name", align: "left"},
                        {text: "Department", refersTo: "dept", align: "center"},
                        {text: "Plant", refersTo: "plant", align: "center"}
                    ]}
                />
            </div>
            <div>
                <embed/>
            </div>
        </div>
    );
}

export default OpenCertificate;