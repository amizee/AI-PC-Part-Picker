import Sidebar from "./Sidebar"
import {useEffect, useState} from "react";
import { IoCloseSharp } from "react-icons/io5";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../contexts/AuthContext.tsx";

const SavedParts = () => {
    const parts= {
        CPU: {
            title: 'CPUs',
            parts: []
        },
        GPU: {
            title: 'GPUs',
            parts: []
        },
        COOLER: {
            title: 'Coolers',
            parts: []
        },
        MOTHERBOARD: {
            title: 'Motherboards',
            parts: []
        },
        MEMORY: {
            title: 'Memory',
            parts: []
        },
        STORAGE: {
            title: 'Storage',
            parts: []
        },
        POWERSUPPLY: {
            title: 'Power Supplies',
            parts: []
        },
        CASE: {
            title: 'Cases',
            parts: []
        },
        OS: {
            title: 'OS',
            parts: []
        }
    };

    const [savedParts, setSavedParts] = useState<any[]>([]);
    const[deleted, setIsDeleted] = useState(false);
    const navigate = useNavigate();
    const { getUserId } = useAuth();
    const id = getUserId();

    const handlePartClick = (id: number) => {
        navigate(`/pcparts/${id}`);
    };

    useEffect(() => {
        async function getSavedParts() {
            try {
                const config= {
                    method: 'get',
                    url: `http://127.0.0.1:8080/api/users/${id}`,
                };
                const response = await axios(config);
                console.log(response.data)
                return response.data;
            } catch (error) {
                console.error('Error getting user:', error);
            }
        }

        getSavedParts().then(r => setSavedParts(r.savedParts));
    }, [deleted]);

    console.log(savedParts);
    for (const part of savedParts) {
        parts[part['part_type'].toUpperCase()]['parts'].push(part);
    }

    async function deleteSavedPart(partId: number) {
        try {
            const config = {
                method: "delete",
                url: `http://127.0.0.1:8080/api/users/saved-part/${id}`,
                data: {
                    savedPartId: partId
                }
            };
            await axios(config);
            setIsDeleted(!deleted);
        } catch (error) {
            console.error('Error deleting saved part: ', error);
        }
    }

    return (
        <div className="w-full grid grid-cols-4">
            <Sidebar />
            <div className="col-start-2 col-end-5 pr-12 pt-6 pb-6">
                <main
                    className="w-full h-full flex flex-col p-10 pl-16 rounded-lg bg-primary-grey-light">
                    {Object.entries(parts).map(([key, value]) => (
                        <div key={key} className="divide-y-2 divide-gray-300 divide-solid mb-4">
                            <h2 className="mb-3 text-lg font-semibold text-gray-900 leading-4 text-start">{value.title}</h2>
                            <div className="flex flex-wrap">
                                {value.parts.length > 0 ? (
                                    value.parts.map((part, index) => (
                                        <div key={index}>
                                            <IoCloseSharp
                                                className="mt-4 text-lg cursor-pointer"
                                                onClick={ async() => deleteSavedPart(part.id) }
                                            />
                                            <img
                                                className="w-72 h-72 mb-3 mr-12 rounded-md cursor-pointer"
                                                src={`http://localhost:8080/${part.imageURL}`}
                                                onClick={ () => {handlePartClick(part.id) }}

                                            />
                                            <p>{part.name}</p>
                                            <p>${part.price}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div>
                                        <p className="mt-2">None</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </main>
            </div>
        </div>
    )
}

export default SavedParts