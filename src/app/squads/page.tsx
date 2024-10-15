'use client'
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useSession } from "next-auth/react";


export default function Squads() {
  const urlParams = useSearchParams()
  const router = useRouter()
  const pageParam = urlParams.get('page') ?? 1
  const limitParam = urlParams.get('limit') ?? 5
  let searchParam = urlParams.get('search') ?? ''
  const {data: session} = useSession();
  const [squads, setSquads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [maxPages, setMaxPages] = useState(0);
  const [onlyMySquads, setOnlyMySquads] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [notLoggedInError, setNotLoggedInError] = useState(false);
  if(!searchParam){
    router.push(`/squads?page=${pageParam}&limit=${limitParam}`)
  }

  const handleOnlyMySquadsFilter = () => {
    if(session){
      setLoggedIn(true)
    }
    if(loggedIn){
      setOnlyMySquads(true)
      fetchSquads()
    } else {
      console.log("Not Logged in, errorr puttin now")
      setNotLoggedInError(true)
    }
    console.log("Par Squad", onlyMySquads)
  }

  const fetchSquads = async () => {
    setLoading(true)
    try{
      const response = await fetch('/api/squads', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json', // Specify the content type
        },
        body: JSON.stringify({
          pageParam,
          limitParam,
          searchParam,
          onlyMySquads: onlyMySquads,
          userId: session?.user.userId
        })
      })
  
      if (response.ok){
        const {squads, maxPages} = await response.json()
        setMaxPages(maxPages)
        setSquads(squads);
    } else {
      console.error('Error fetching squads:', response.statusText);
    }
    } catch (error) {
      console.log("Error", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSquads()
  }, [limitParam, pageParam, searchParam])

  useEffect(() => {

    if (!searchParam){
      if (Number(pageParam) > maxPages){
        console.log("HERE 1")
        router.push(`/squads?page=${maxPages}&limit=${limitParam}`)
      } else if (Number(pageParam) < 1){
        console.log("HERE 2")
        router.push(`/squads?page=1&limit=${limitParam}`);
      }
    }
  }, [maxPages])

  useEffect(() => {
    if(notLoggedInError){
      setTimeout(() => {
        setNotLoggedInError((prev) => prev = false)
      }, 3000)
    }
  }, [notLoggedInError])

  const handlePreviousPageAction = () => {
    if (Number(pageParam) > 1){
      router.push(`/squads?page=${Number(pageParam) - 1}&limit=${limitParam}`)
    }
  }

  const handleNextPageAction = () => {
    if (Number(pageParam) < maxPages){
      router.push(`/squads?page=${Number(pageParam) + 1}&limit=${limitParam}`)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userSearch = (document.getElementById('search') as HTMLInputElement).value;
    if (userSearch === ''){
      router.push(`/squads?page=${pageParam}&limit${limitParam}`)
    }
    router.push(`/squads?page=${pageParam}&limit${limitParam}&search=${userSearch}`)
  }
  
  return(
<div className="flex justify-center items-center mt-10">
  <div className="bg-white w-[70rem] h-[40rem] rounded-md shadow-2xl border-2 border-black">
    <div className="p-4 flex justify-between items-center">
        {/* Title */}
        <h1 className="text-5xl font-bold">Squads Available</h1>
        <button onClick={fetchSquads}><Image alt="loop button" src={'/logo/icons8-restart.svg'} width={25} height={25}></Image></button>
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            name="search"
            id="search"
            placeholder="Name Or Game..."
            className="border-2 border-black rounded-xl p-2 pr-12 focus:outline-none focus:border-[#3795BD] transform duration-300 w-full"
          />
          <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent mr-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-[#3795BD]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15z" />
            </svg>
          </button>
        </form>
        <div className="flex flex-col">
        {notLoggedInError && <p className="text-red-500 text-center">You have to be logged in</p>}
          <button onClick={handleOnlyMySquadsFilter} className="bg-[#3795BD] text-white py-2 px-4 rounded-md hover:-translate-y-1 transform hover:shadow-md duration-300">
            Only My Squads
          </button>
        </div>
        <button onClick={() => router.push('/create-squad')} className="bg-[#3795BD] text-white py-2 px-4 rounded-md hover:-translate-y-1 transform hover:shadow-md duration-300">
          Create Squad
        </button>
      </div>
    <div className="flex flex-col w-full justify-evenly">

      <div className="flex border-b bg-gray-200">
        <h3 className="text-lg font-semibold flex-1 text-center p-4">Squad Name</h3>
        <h3 className="text-lg font-semibold flex-1 text-center p-4">Game</h3>
        <h3 className="text-lg font-semibold flex-1 text-center p-4">Players</h3>
        <h3 className="text-lg font-semibold flex-1 text-center p-4">Date</h3>
      </div>

  
      
      {squads.length > 0 && squads.map((squad) => {
        const playersCount = JSON.parse(squad.players).players.length
        return(
          <ul className="space-y-2" key={squad.id}>
            <li className="p-4 border-b hover:bg-[#3795BD] transition-colors duration-300 flex hover:cursor-pointer" onClick={() => router.push(`/squads/${squad.id}`)}>
              <h3 className="text-lg font-semibold flex-1 text-center">{squad.name}</h3>
              <h3 className="text-lg font-semibold flex-1 text-center">{squad.game}</h3>
              <h3 className="text-lg font-semibold flex-1 text-center">{playersCount}/{squad.maxPlayers}</h3>
              <h3 className="text-lg font-semibold flex-1 text-center">{squad.date}</h3>
            </li>
          </ul>
        )
      })}
    </div>
    <div className="text-center mt-2 space-x-3">
      <button className="border-2 rounded-full p-2 transform duration-300 hover:border-[#3795BD]" onClick={handlePreviousPageAction}><Image alt="GG" src={'/logo/left-arrow.svg'} width={8} height={8}/></button>
      <button className="hover:cursor-default">{pageParam}</button>
      <button className="border-2 rounded-full p-2 transform duration-300 hover:border-[#3795BD]" onClick={handleNextPageAction}><Image alt="GG" src={'/logo/right-arrow.svg'} width={8} height={8}/></button>
      <h3 className="relative right-1 mt-2">Last Page : {maxPages}</h3>
    </div>
    <div className="text-3xl text-center text-[#3795BD] flex flex-col">
        {loading ? <h1 className="transform duration-300">Loading...</h1> : ''} 
    </div>
    <div>
    </div>
  </div>
</div>

  );
}
