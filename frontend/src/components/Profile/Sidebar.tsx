import { NavLink } from "react-router-dom"
import {useEffect, useState} from "react";
import axios from "axios";
import {useAuth} from "../../contexts/AuthContext.tsx";

const Sidebar = () => {
    const[name, setName] = useState("");
    const { getUserId } = useAuth();
    const id = getUserId();

    useEffect(() => {
        async function getName() {
            try {
                const config= {
                    method: 'get',
                    url: `http://127.0.0.1:8080/api/users/${id}`,
                };
                const response = await axios(config);
                return response.data;
            } catch (error) {
                console.error('Error getting user:', error);
            }
        }

        getName().then(r => setName(r.username));
    }, []);

    return (
        <aside className="col-start-1 col-end-2 ml-12 mt-6">
            <div className="flex flex-col flex-auto items-center rounded-lg">
                <img
                    className="w-60 h-60 rounded-full border-slate-800 border-[12px] mb-3"
                    src="/profile-photo.svg"
                    alt="Profile Image"/>
                <p className="text-2xl font-semibold mb-4">{name}</p>

                {[
                    ['Account', '/profile/account'],
                    ['Saved Parts', '/profile/saved-parts'],
                    ['Saved Builds', '/profile/saved-builds'],
                    ['Ad Copies', '/profile/ad-copies'],
                ].map(([title, url]) => (
                    <NavLink key={title} to={url} className="text-center w-full text-xl py-5 rounded-l-lg hover:bg-primary-grey-light"
                             style={({ isActive }) => {
                                 return { backgroundColor: isActive ? "#f0f0f0" : "", };
                             }}
                    > {title} </NavLink>
                ))}
            </div>
        </aside>
    )
}

export default Sidebar