'use client'

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import DeleteSquadButton from "@/components/DeleteSquadButton";
import { Toaster } from "react-hot-toast";
import {handleErrorToast, handleSuccesToast} from "@/src/toastFunctions"

export default function squadPage({params}: {
    params: { squadId: number }
}){
    const leaveButton = "rounded-md shadow-sm border-2 border-red-500 text-white bg-red-500 p-2 duration-300 transform hover:-translate-y-1"
    const joinButton = "rounded-md shadow-sm border-2 border-green-500 text-white bg-green-500 p-2 duration-300 transform hover:-translate-y-1"
    const disabledButton = "rounded-md shadow-sm border-2 border-gray-500 text-white bg-gray-500 p-2"
    const {data: session, status} = useSession();
    const [squadData, SetSquadData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [userInSquad, setUserInSquad] = useState(false);
    const [userLoggedIn, setUserLoggedIn] = useState(true);
    const [ownerUsername, setOwnerUsername] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);
    const [squadId, setSquadId] = useState();
    const [playersUsernames, setPlayersUsernames] = useState([]);


    const checkIfUserLoggedIn = () => {
        if (session){
            setUserLoggedIn(true)
        } else {
            setUserLoggedIn(false)
        }
    }


    const deleteSquadPlayer = async () => {
        setIsDisabled(true)
        setTimeout(() => {
            setIsDisabled(false)
        }, 5000)
        try{
            const userId = session?.user.userId
            const res = await fetch('http://localhost:3000/api/deleteSquadPlayer', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({
                    userId: userId,
                    userInSquad: userInSquad,
                    squadId: params.squadId
                })
            })
            const data = await res.json()
            if(data.result === "true"){
                handleSuccesToast("Left squad successfully")
                checkUserInSquad()
                fetchSquadInfo()
            } else {
                handleErrorToast('Error leaving squad, try again later!')
            }
        } catch (error){
            console.log(error)
        }
    }


    const addSquadPlayer = async () => {
        setIsDisabled(true)
        setTimeout(() => {
            setIsDisabled(false)
        }, 5000)
        try{
            const userId = session?.user.userId
            const res = await fetch('http://localhost:3000/api/addSquadPlayer', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({
                    userId: userId,
                    squadId: params.squadId,
                    userInSquad: userInSquad
                })
            })
            const data = await res.json()
            if(data.result === "true"){
                handleSuccesToast("Joined squad successfully")
                checkUserInSquad()
                fetchSquadInfo()
            } else {
                handleErrorToast("Error joining squad, try again later!")
            }
        } catch (error){
            console.log(error)
        }
    }

    const checkUserInSquad = async () => {
        try{
            const userId = session?.user.userId
            const res = await fetch('http://localhost:3000/api/userInSquad', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({
                    userId: userId,
                    squadId: params.squadId
                })
            })
            const data = await res.json()
            if (data.result === 'true'){
                console.log(data)
                setUserInSquad(true)
            } else {
                console.log(data)
                setUserInSquad(false)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchSquadInfo = async () => {
        setLoading(true)
        try{
            const response = await fetch('http://localhost:3000/api/squads/squad', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({
                    params
                }),
            })
            const data = await response.json()
            if(data.players){
                console.log("data plaeta", data.players)
                setPlayersUsernames(data.players)
            }
            console.log("data afeter playe", data)
            if (data['squad'][0]['squad']){
                setOwnerUsername(data['squad'][0]['ownerUsername'])
                SetSquadData([data['squad'][0]['squad']])
                setSquadId(data['squad'][0]['squad'].id)
            } else {
                setNotFound(true)
            }
        } catch (error){
            console.log(error)
        }
        setLoading(false)
    }
    useEffect(() => {
        fetchSquadInfo()
    }, [])

    useEffect(() => {
        if (status !== "loading"){
            checkIfUserLoggedIn()
            checkUserInSquad()
        }
    }, [session])


 

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-full max-w-4xl bg-white flex flex-col shadow-lg rounded-lg p-6">
                {loading && <h1 className="text-center text-3xl mt-2 mb-2">Loading...</h1>}
                {notFound && (
                    <div className="text-center">
                        <h1 className="text-3xl mb-4">Couldn't Find Squad</h1>
                        <p>
                            Get Back To{" "}
                            <Link href="/squads" className="underline text-blue-500">
                                Squads
                            </Link>{" "}
                            to search for more squads.
                        </p>
                    </div>
                )}
                {!userLoggedIn && (
                    <div className="text-center mt-3">
                        <h1 className="text-3xl mb-4">You have to be logged in to view this page!</h1>
                        <p>
                            Click{" "}
                            <Link href="/login" className="underline text-blue-500">
                                Here
                            </Link>{" "}
                            to Login.
                        </p>
                    </div>
                )}
                {userLoggedIn && !notFound && squadData.map((squad) => (
                    <div key={squad.id} className="w-full flex flex-col items-center">
                        <h1 className="text-center mt-2 mb-3 text-5xl font-bold">{squad.name}</h1>
                        <div className="flex justify-evenly w-full text-xl">
                            <p className="mt-2">Game: {squad.game}</p>
                            <p className="mt-2">Owner: {ownerUsername}</p>
                            <p className="mt-2">Date: {squad.date}</p>
                        </div>
                        <div className="flex justify-between w-full mt-10">
                            <ul className="ml-4">
                                <li className="text-2xl font-semibold">Players {`${playersUsernames.length}/${squad.maxPlayers}`}:</li>
                                {playersUsernames.map((player, index) => (
                                    <li key={index} className="text-xl mt-1">
                                        {player}
                                    </li>
                                ))}
                            </ul>
                            <div className="mr-4 flex flex-col items-end">
                                <button
                                    onClick={userInSquad ? deleteSquadPlayer : addSquadPlayer}
                                    disabled={isDisabled}
                                    className={`${isDisabled ? disabledButton : userInSquad ? leaveButton : joinButton} mb-2`}
                                >
                                    {userInSquad ? "Leave Squad" : "Join Squad"}
                                </button>
                                {squad.ownerId === session?.user.userId && <DeleteSquadButton squadId={squadId} />}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}