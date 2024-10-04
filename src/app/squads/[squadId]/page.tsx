'use client'

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function squadPage({params}: {
    params: { squadId: number }
}){
    
    const {data: session, status} = useSession();
    
    const [squadData, SetSquadData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [userInSquad, setUserInSquad] = useState(false);
    const [userLoggedIn, setUserLoggedIn] = useState(true);
    const [showError, setShowError] = useState({
        state: false,
        message: ''
    })


    const checkIfUserLoggedIn = () => {
        if (session){
            setUserLoggedIn(true)
        } else {
            setUserLoggedIn(false)
        }
    }

    const handleError = (message: string) => {
        setShowError({
            state: true,
            message: message
        })
        setTimeout(() => {
            setShowError({
                state: true,
                message: ''
            })
        }, 3000);
    }

    const deleteSquadPlayer = async () => {
        try{
            const sessionUsername = session?.user.username ? session.user.username : session?.user.name
            const res = await fetch('http://localhost:3000/api/deleteSquadPlayer', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({
                    username: sessionUsername,
                    squadId: params.squadId
                })
            })
            const data = await res.json()
            if(data.result === "true"){
                checkUserInSquad()
                fetchSquadInfo()
            } else {
                handleError(data.message)
            }
        } catch (error){
            console.log(error)
        }
    }


    const addSquadPlayer = async () => {
        try{
            const sessionUsername = session?.user.username ? session.user.username : session?.user.name
            const res = await fetch('http://localhost:3000/api/addSquadPlayer', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({
                    username: sessionUsername,
                    squadId: params.squadId
                })
            })
            const data = await res.json()
            if(data.result === "true"){
                checkUserInSquad()
                fetchSquadInfo()
            } else {
                handleError(data.message)
            }
        } catch (error){
            console.log(error)
        }
    }

    const checkUserInSquad = async () => {
        try{
            const sessionUsername = session?.user.username ? session.user.username : session?.user.name
            const res = await fetch('http://localhost:3000/api/userInSquad', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({
                    username: sessionUsername,
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
            const response = await fetch('http://localhost:3000/api/squad', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({
                    params
                }),
            })
            const data = await response.json()
            console.log("res:", data)
            if (data['squad']){
                SetSquadData(data['squad'])
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

    useEffect(() => {
        if (squadData[0]?.players){
            const squadPlayers = JSON.parse(squadData[0].players).players
            console.log(squadPlayers)
        }
    }, [squadData])



    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-[30rem] bg-white justify-center flex flex-col shadow-md rounded-md h-[25rem]">
                {loading && <h1 className="text-center text-3xl mt-2 mb-2">Loading...</h1>}
                {notFound &&
                    <>
                        <div className="text-center">
                            <h1 className="text-center text-3xl">Couldn't Find Squad</h1>
                            <p className="text-center">Get Back To <Link href={"/squads"} className="underline">Squads</Link> to search for more squads.</p>
                        </div>
                    </>
                }
                {!userLoggedIn &&
                    <>
                        <div className="text-center mt-3">
                            <h1 className="text-center text-3xl">You have to be logged in to view this page!</h1>
                            <p className="text-center">Click <Link href={"/login"} className="underline">Here</Link> to Login.</p>
                        </div>
                    </>}
                {userLoggedIn && !notFound && squadData.map((squad) => {
                    const squadPlayers = JSON.parse(squad.players).players;
                    return (
                        <div key={squad.id} className="w-full h-screen flex flex-col">
                            <h1 className="text-center mt-2 text-3xl">{squad.name}</h1>
                            <h1 className="text-xl mt-2 text-center">Game: {squad.game}</h1>
                            <div className="flex items-center justify-between w-full">
                                <ul className="ml-4 mt-10">
                                    <li className="text-2xl">Players {`${squadPlayers.length}/${squad.maxPlayers}`}:</li>
                                    {squadPlayers.map((player: string, index: number) => (
                                        <li className="text-center text-xl" key={index}>
                                            {player}
                                        </li>
                                    ))}
                                </ul>
                                <ul className="mr-4 mt-10">
                                    <li className="flex flex-col">
                                        {userInSquad ? <button onClick={deleteSquadPlayer} className="rounded-md shadow-sm border-2 border-red-500 text-white bg-red-500 p-2 hover:bg-[#3795BD] duration-300 hover:border-[#3795BD] transform hover:-translate-y-1">Leave Squad</button> : <button onClick={addSquadPlayer} className="rounded-md shadow-sm border-2 border-green-500 text-white bg-green-500 p-2 hover:bg-[#3795BD] duration-300 hover:border-[#3795BD] transform hover:-translate-y-1">Join Squad</button>}
                                        {showError.state && <p className="text-red-500">{showError.message}</p>}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}