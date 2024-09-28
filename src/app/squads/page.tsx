'use client'
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";


export default function Squads() {
  const urlParams = useSearchParams()
  const router = useRouter()
  const pageParam = urlParams.get('page') ?? 1
  const limitParam = urlParams.get('limit') ?? 5
  let searchParam = urlParams.get('search') ?? ''
  const [squads, setSquads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNotFoundSearch, setShowNotFoundSearch] = useState(false);
  const [maxPages, setMaxPages] = useState(0);
  if(!searchParam){
    router.push(`/squads?page=${pageParam}&limit=${limitParam}`)
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
        searchParam
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
    setShowNotFoundSearch(false)
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
    } else  {
      setShowNotFoundSearch(true)
    }
  }, [maxPages])

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

  const handleSearchSubmit = (e) => {
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
        <form className="relative right-36" onSubmit={handleSearchSubmit}>
          <input
            name="search"
            id="search"
            placeholder="Name Or Game..."
            className="border-2 border-black rounded-xl p-2 pr-12 focus:outline-none focus:border-[#3795BD] transform duration-300"
          />
          <button type="submit" className="absolute right-0 top-0 mt-1 mr-2 text-[#3795BD] hover:text-black transform duration-300">Search</button>
        </form>
        {/* Button */}
        <button className="bg-[#3795BD] text-white py-2 px-4 rounded-md hover:-translate-y-1 transform hover:shadow-md duration-300">
          Create Squad
        </button>
      </div>
    <div className="flex flex-col w-full justify-evenly">

      <div className="flex border-b bg-gray-200">
        <h3 className="text-lg font-semibold flex-1 text-center p-4">Squad Name</h3>
        <h3 className="text-lg font-semibold flex-1 text-center p-4">Game</h3>
        <h3 className="text-lg font-semibold flex-1 text-center p-4">Players</h3>
      </div>
      {showNotFoundSearch ? <h1 className="text-center text-3xl">Not Found Search For : '{searchParam}'</h1>: ''}

  
      
      {squads.length > 0 && squads.map((squad) => (
        <ul className="space-y-2" key={squad.id}>
          <li className="p-4 border-b hover:bg-[#3795BD] transition-colors duration-300 flex hover:cursor-pointer">
            <h3 className="text-lg font-semibold flex-1 text-center">{squad.name}</h3>
            <h3 className="text-lg font-semibold flex-1 text-center">{squad.game}</h3>
            <h3 className="text-lg font-semibold flex-1 text-center">{squad.players}/{squad.maxPlayers}</h3>
          </li>
        </ul>
      ))}
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
  </div>
</div>

  );
}
