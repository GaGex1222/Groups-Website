'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";




export default function Home(){
    const router = useRouter();
    const handleRedirect = () => {
        router.push("/register")
    }
    return(
        <div className="flex mt-28 justify-center items-center">
            <div className="text-center py-20 ">
                <h1 className="text-8xl font-bold">
                    <span className="text-[#7209b7] transform inline-block hover:text-black hover:-translate-y-3 duration-150">Your</span> game, <span className="text-[#7209b7] transform inline-block hover:text-black hover:-translate-y-3 duration-150">Your</span> Teammates.
                </h1>
                <p className="mt-8 hover:text-[#7209b7] duration-150 w-[71rem] mx-auto text-lg leading-relaxed text-gray-700">
                    At Game Squad, we connect gamers with like-minded teammates for a seamless multiplayer experience. Whether you're into competitive esports or casual co-op games, our platform helps you find the perfect group to join forces, strategize, and enjoy your favorite games together. Simply choose your game, browse or create a group, and start playing with your new squad!
                </p>
                <button className="border-2 shadow-sm rounded-full hover:shadow-xl px-7 bg-[#7209b7] active:bg-[#7209b7] hover:-translate-y-2 active:text-white active:translate-y-0 transform duration-150 hover:bg-white hover:text-black border-[#7209b7] text-white py-3 mt-12" onClick={handleRedirect}>
                    Get Started
                </button>
            </div>
        </div>
    );
}

