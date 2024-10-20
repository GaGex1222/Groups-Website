'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

export default function AboutUs(){
    const {data: session} = useSession()
    const router = useRouter()
    return (
        <>
            <div className="flex mt-28 justify-center items-center">
                <div className="text-center py-20">
                    <h1 className="text-8xl text-white font-bold">About Game Squad</h1>
                    <p className="mt-8 text-white duration-150 w-[71rem] mx-auto text-xl leading-relaxed">
                        At Game Squad, our mission is to connect gamers with like-minded teammates for a seamless multiplayer experience.
                        We believe in the power of community and teamwork, and we strive to make finding the perfect squad as easy and enjoyable as possible.
                    </p>
                    <button className="border-2 shadow-sm rounded-full hover:shadow-xl px-7 bg-[#3795BD] hover:text-black hover:-translate-y-1 active:translate-y-0 transform duration-300 hover:bg-white border-[#3795BD] text-white py-3 mt-16" onClick={() => { session ? router.push("/squads") : router.push("/register") }}>
                        Join Us
                    </button>
                </div>
            </div>
            <div className="mt-20 flex justify-evenly">
                <div className="w-3/12 rounded-md shadow-lg bg-white duration-150 transform hover:-translate-y-2 h-40 border-2 border-[#3795BD] transition-all">
                    <h1 className="text-center mt-4 text-2xl font-bold text-[#3795BD]">Our Mission</h1>
                    <p className="text-center mt-2 text-gray-700">Connecting gamers with like-minded teammates for a seamless multiplayer experience.</p>
                </div>
                <div className="w-3/12 rounded-md shadow-lg bg-white duration-150 transform hover:-translate-y-2 h-40 border-2 border-[#3795BD] transition-all">
                    <h1 className="mt-4 text-center text-2xl font-bold text-[#3795BD]">Our Vision</h1>
                    <p className="text-center mt-2 text-gray-700">Building a community where gamers can find the perfect squad effortlessly.</p>
                </div>
                <div className="w-3/12 rounded-md shadow-lg bg-white duration-150 transform hover:-translate-y-2 h-40 border-2 border-[#3795BD] transition-all">
                    <h1 className="text-center mt-4 text-2xl font-bold text-[#3795BD]">Our Values</h1>
                    <p className="text-center mt-2 text-gray-700">Community, teamwork, and a passion for gaming.</p>
                </div>
            </div>
        </>
    );
}