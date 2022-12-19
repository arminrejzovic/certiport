import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCertificate, faCircleInfo, faHouse} from "@fortawesome/free-solid-svg-icons";

export const links = [
    {
        text: "Home",
        route: "/",
        icon: <FontAwesomeIcon icon={faHouse}/>,
    },
    {
        text: "Certificates",
        route: "/certificates",
        icon: <FontAwesomeIcon icon={faCertificate}/>,
        children: [
            {
                text: "Example 1",
                route: "/certificates/example1",
                children: [
                    {
                        text: "Sub example 1",
                        route: "/certificates/example/sub1",
                    },
                    {
                        text: "Sub example 2",
                        route: "/certificates/example/sub2",
                    }
                ]
            },
            {
                text: "Example 2",
                route: "/certificates/example2",
            },
            {
                text: "Example 3",
                route: "/certificates/example3",
            }
        ]
    },
    {
        text: "About",
        route: "/about",
        icon: <FontAwesomeIcon icon={faCircleInfo}/>,
    }
]