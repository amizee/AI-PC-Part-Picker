import Sidebar from "../components/Profile/Sidebar"
import {BaseSyntheticEvent, SyntheticEvent, useEffect, useRef, useState} from "react";
import axios from "axios";
import { useAuth } from '../contexts/AuthContext';
import {useNavigate} from "react-router-dom";

const Profile = () => {
    const [isVHLarger, setIsVHLarger] = useState(false)
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [usernameValid, setUsernameValid] = useState(false);
    const [confirmMatch, setConfirmMatch] = useState(true);
    const [user, setUser] = useState({});

    let contentHeight = useRef(0);
    const backgroundRef = useRef(null);

    const { getUserId, logout } = useAuth();
    const id = getUserId();
    const navigate = useNavigate();

    // Runs only once
    useEffect(() => {
        contentHeight = backgroundRef.current.offsetHeight;

        const handleResize = () : void => {
            const viewportHeight = window.innerHeight;
            if (viewportHeight > contentHeight) {
                setIsVHLarger(true);
            } else {
                setIsVHLarger(false);
            }
        };

        // Initial load
        handleResize();
        window.addEventListener('resize', handleResize);

        // Cleanup event listener after component is gone
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Get user
    useEffect(() => {
        async function getUser() {
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

        getUser().then(r => setUser(r));
    }, []);

    async function submit(e: BaseSyntheticEvent) {
        e.preventDefault();

        if (e.target.username.value !== "") {
            setUsernameValid(true);
        } else {
            setUsernameValid(false);
        }

        // Error checking, could add clearing input fields upon match
        if ((e.target.password.value || e.target.confirmPassword.value) && (e.target.password.value !== e.target.confirmPassword.value)) {
            setPasswordsMatch(false);
            return;
        } else {
            setPasswordsMatch(true);
            setUsernameValid(true);
        }

        try {
            const config = {
                method: "post",
                url: `http://127.0.0.1:8080/api/users/${id}`,
                data: {
                    username: e.target.username.value,
                    email: e.target.email.value,
                    password: e.target.password.value
                }
            };

            await axios(config);
        } catch(error) {
            console.error("Error updating user info", error);
        }
    }

    async function deleteUser(e: BaseSyntheticEvent) {
        e.preventDefault();

        if (e.target.deleteConfirm.value === "deletemyaccountforever") {
            setConfirmMatch(true);
            try {
                const config = {
                    method: "delete",
                    url: `http://127.0.0.1:8080/api/users/${id}`
                };

                await axios(config);
                logout();
                navigate('/login');
            } catch(error) {
                console.error("Error deleting user", error);
            }
        } else {
            setConfirmMatch(false);
        }
    }

    return (
        <div className="w-full grid grid-cols-4">
            <Sidebar />
            <div
                ref={backgroundRef}
                className={`col-start-2 col-end-5 pr-12 pt-6 pb-6 ${isVHLarger ? 'h-[calc(100vh-80px)]' : ''}`}>
                <main
                    className="w-full h-full flex flex-col p-10 pl-16 rounded-lg bg-primary-grey-light divide-y-2 divide-gray-300 divide-solid">
                    <form onSubmit={submit}>
                        <div className="mb-6">
                            <div>
                                <label htmlFor="username"
                                       className="block mb-2 text-lg font-semibold text-gray-900">
                                    Username
                                </label>
                                <input type="text" id="username" name="username"
                                       className="block w-1/3 p-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                       placeholder="New username"/>
                            </div>
                        </div>
                        <div className="mb-6">
                            <div>
                                <label htmlFor="email"
                                       className="block mb-2 text-lg font-semibold text-gray-900">
                                    Email
                                </label>
                                <input type="email" name="email"
                                       className="block w-1/3 p-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-200 text-md"
                                       value={user.email} disabled/>
                            </div>
                        </div>
                        <div className="mb-6">
                            <div>
                                <label htmlFor="password"
                                       className="block mb-2 text-lg font-semibold text-gray-900">
                                    Password
                                </label>
                                <input type="password" id="password" name="password"
                                       className="block w-1/3 p-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                       placeholder="New password"/>
                            </div>
                        </div>
                        <div className="mb-6">
                            <div>
                                <label htmlFor="confirm-password"
                                       className="block mb-2 text-lg font-semibold text-gray-900">
                                    Confirm password
                                </label>
                                <input type="password" id="confirm-password" name="confirmPassword"
                                       className="block w-1/3 p-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                       placeholder="Confirm new password"/>
                                {passwordsMatch ? (
                                    <p className="mt-1 mb-6"></p>
                                ) : (
                                    <p className="mt-1 mb-6 text-sm text-red-500">Passwords do not match!</p>
                                )}
                            </div>
                        </div>
                        {/*<div>*/}
                        {/*    <label className="block mb-2 text-lg font-semibold text-gray-900"*/}
                        {/*           htmlFor="file-input">Change Avatar</label>*/}
                        {/*    <input type="file" name="avatar" className="block w-1/3 text-slate-500 border border-gray-300 rounded-md font-normal*/}
                        {/*      file:mr-4 file:py-3 file:px-5 file:border-0 file:text-md file:font-semibold*/}
                        {/*      file:bg-gray-700 file:text-white hover:file:bg-gray-600*/}
                        {/*    "/>*/}
                        {/*    <p className="mt-1 mb-6 text-sm text-gray-500" id="file-input-help">SVG, PNG or JPG</p>*/}
                        {/*</div>*/}
                        <button type="submit"
                                className="text-white bg-gray-700 hover:bg-gray-600 focus:ring-2 focus:outline-none focus:ring-gray-400 font-medium rounded-md text-md w-full sm:w-auto px-5 py-3 text-center">
                            Save
                        </button>
                        {passwordsMatch && usernameValid ? (
                            <p className="mt-1 mb-6 text-sm text-green-500">Saved!</p>
                        ) : (
                            <p className="mt-1 mb-6 text-sm"></p>
                        )}
                    </form>
                    <div className="mt-8" id="divider">
                        <form onSubmit={deleteUser}>
                            <div className="mt-8">
                                <label htmlFor="username"
                                       className="block mb-2 text-lg font-semibold text-gray-900 leading-4">
                                    Delete Account
                                </label>
                                <p className="mb-2">Are you sure you want to delete your account? This action cannot be
                                    undone.</p>
                                <input type="text" id="confirm" name="deleteConfirm"
                                       className={`block w-1/3 p-3 text-gray-900 border ${confirmMatch ? 'border-gray-300' : 'border-1 border-red-500'} rounded-lg bg-gray-50 text-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}/>
                                <p className="mt-1 mb-6 text-sm text-gray-500" id="delete-account-help">Please type "deletemyaccountforever" to confirm</p>
                            </div>
                            <button type="submit"
                                    className="text-white bg-gray-700 hover:bg-gray-600 focus:ring-2 focus:outline-none focus:ring-gray-400 font-medium rounded-md text-md w-full sm:w-auto px-5 py-3 text-center">
                                Delete
                            </button>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Profile