import Sidebar from "./Sidebar"
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../contexts/AuthContext.tsx";

const SavedBuilds = () => {
    const [savedBuilds, setSavedBuilds] = useState<any[]>([]);
    const[deleted, setIsDeleted] = useState(false);

    const [isVHLarger, setIsVHLarger] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const backgroundRef = useRef(null);
    const partTypes = ['cpu', 'gpu', 'cooler', 'motherboard', 'memory', 'storage', 'powerSupply', 'pcCase', 'os'];

    const navigate = useNavigate();
    const { getUserId } = useAuth();
    const id = getUserId();

    const handlePartClick = (id: number) => {
        navigate(`/pcparts/${id}`);
    };

    useEffect(() => {
        async function getSavedBuilds() {
            try {
                const config= {
                    method: 'get',
                    url: `http://127.0.0.1:8080/api/users/${id}`,
                };
                const response = await axios(config);
                console.log(response.data);
                return response.data;
            } catch (error) {
                console.error('Error getting user:', error);
            }
        }

        getSavedBuilds().then(r => setSavedBuilds(r.savedBuilds));
    }, [deleted]);

    const updateContentHeight = () => {
        if (backgroundRef.current) {
            setContentHeight(backgroundRef.current.offsetHeight);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            const viewportHeight = window.innerHeight;

            if (viewportHeight > contentHeight) {
                setIsVHLarger(true);
            } else {
                setIsVHLarger(false);
            }
        };

        // Update content height on initial render
        updateContentHeight();
        handleResize();

        window.addEventListener('resize', handleResize);

        // Cleanup event listener on unmount
        return () => window.removeEventListener('resize', handleResize);
    }, [contentHeight]);

    useEffect(() => {
        updateContentHeight();
    }, [savedBuilds]);

    async function deleteSavedBuild(buildId: number) {
        try {
            const config = {
                method: "delete",
                url: `http://127.0.0.1:8080/api/users/saved-build/${id}`,
                data: {
                    savedBuildId: buildId
                }
            };
            await axios(config);
            setIsDeleted(!deleted);
        } catch (error) {
            console.error('Error deleting saved build: ', error);
        }
    }

    return (
        <div className="w-full grid grid-cols-4">
            <Sidebar />
            <div
                ref={backgroundRef}
                className={`col-start-2 col-end-5 pr-12 pt-6 pb-6 ${isVHLarger ? 'h-[calc(100vh-80px)]' : ''}`}>
                <main className="w-full h-full flex flex-col p-10 pl-16 rounded-lg bg-primary-grey-light">
                    <div className="divide-y-2 divide-gray-300 divide-solid mb-4">
                        {savedBuilds.length === 0 ? (
                            <p className="text-lg font-semibold text-gray-900">No builds.</p>
                        ) : (
                            savedBuilds.map((build, index) => (
                                <div key={index}>
                                    <div className="flex flex-row items-center">
                                        <div>
                                            <p className="mb-3 text-lg font-bold text-gray-900 leading-4 mt-4">{build.name}</p>
                                            <p className="mb-3 text-lg text-gray-900 leading-4">
                                                Total price: ${build.totalPrice}
                                            </p>
                                        </div>
                                        <button type="submit"
                                                className="h-1/2 ml-4 text-white bg-red-600 hover:bg-red-500 focus:ring-2 focus:outline-none focus:ring-red-300 font-medium rounded-md text-md w-full sm:w-auto px-5 py-3 text-center"
                                                onClick={ async() => deleteSavedBuild(build.id) }>
                                            Delete
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap">
                                        {partTypes.map((part, idx) => (
                                            <div key={idx} className="mr-10 mb-4">
                                                <img
                                                    className="w-72 h-72 mb-3 rounded-md cursor-pointer"
                                                    src={`http://localhost:8080/${build[part]?.imageURL}`}
                                                    alt={`${part} image`}
                                                    onClick={ () => { handlePartClick(build[part]?.id) }}
                                                />
                                                <p className="max-w-72 break-words">{build[part]?.name || 'N/A'}</p>
                                                <p>${build[part]?.price || 'N/A'}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default SavedBuilds