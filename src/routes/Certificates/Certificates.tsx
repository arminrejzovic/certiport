import React, {useEffect, useState} from 'react';
import Table, {SortOrder} from "../../components/Table/Table";
import IconDropDown from "../../components/Utils/IconDropdown/IconDropDown";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCog} from "@fortawesome/free-solid-svg-icons";

interface Certificate {
    id: number;
    type: string;
    supplier: string;
    validFrom: string;
    validTo: string;
}
function Certificates() {

    const [certificates, setCertificates] = useState<Certificate[]>([]);

    useEffect(() => {
        const mockCertificates: Certificate[] = [
            {
                id: 1,
                type: "Security",
                supplier: "DCCS doo",
                validFrom: "01.01.2022",
                validTo: "01.01.2023",
            },
            {
                id: 2,
                type: "Accounting",
                supplier: "NLB doo",
                validFrom: "01.01.2022",
                validTo: "01.01.2023",
            },
            {
                id: 3,
                type: "PenTest",
                supplier: "Cisco Systems",
                validFrom: "01.01.2022",
                validTo: "01.01.2023",
            },
            {
                id: 4,
                type: "SEO",
                supplier: "DCCS doo",
                validFrom: "01.01.2022",
                validTo: "01.01.2023",
            },
            {
                id: 5,
                type: "First Aid",
                supplier: "DCCS doo",
                validFrom: "01.01.2022",
                validTo: "01.01.2023",
            },
            {
                id: 6,
                type: "AWS",
                supplier: "Amazon",
                validFrom: "01.01.2022",
                validTo: "01.01.2023",
            },
            {
                id: 7,
                type: "Fast Typing",
                supplier: "DCCS doo",
                validFrom: "01.01.2022",
                validTo: "01.01.2023",
            },
            {
                id: 8,
                type: "Automated Testing",
                supplier: "Testers inc",
                validFrom: "01.01.2022",
                validTo: "01.01.2023",
            },
            {
                id: 9,
                type: "Figma essentials",
                supplier: "Figma",
                validFrom: "01.01.2022",
                validTo: "01.01.2023",
            },
            {
                id: 10,
                type: "BMD",
                supplier: "BMD GMBH",
                validFrom: "01.01.2022",
                validTo: "01.01.2023",
            },
            {
                id: 11,
                type: "German B2",
                supplier: "Goethe Institute",
                validFrom: "01.01.2022",
                validTo: "01.01.2023",
            },
            {
                id: 12,
                type: "Russian A1",
                supplier: "Lomonosov University",
                validFrom: "01.01.2022",
                validTo: "01.01.2023",
            },
            {
                id: 13,
                type: "Webstorm Tips and Tricks",
                supplier: "Jetbrains",
                validFrom: "01.01.2022",
                validTo: "01.01.2023",
            }
        ]
        setCertificates(mockCertificates)
    }, [])

    return (
        <main>
            <div>
                <h1>All certificates</h1>
                <button>New Certificate</button>
            </div>

            <Table
                <Certificate>
                data={certificates}
                primaryKey={"id"}
                columns={[
                    {text: "Type", refersTo: "type"},
                    {text: "Supplier", refersTo: "supplier"},
                    {text: "Valid from", refersTo: "validFrom"},
                    {text: "Valid to", refersTo: "validTo"}
                ]}
                sortMethod={"default"}
                defaultSort={{key: "id", order: SortOrder.ASC}}
                customRows={[
                    {
                        position: "start",
                        render: (item) => {
                            return(
                                <td>
                                    <IconDropDown
                                        icon={<FontAwesomeIcon icon={faCog}/>}
                                        actions={[
                                            {label: "Open", action: () => alert(`Open item ${item.type}`)},
                                            {label: "Edit", action: () => alert(`Edit item ${item.type}`)},
                                            {label: "Delete", action: () => alert(`Delete item ${item.type}`)}
                                        ]}
                                    />
                                </td>
                            )
                        }
                    }
                ]}
                pagination={{itemsPerPage: 10}}
            />
        </main>
    );
}

export default Certificates;