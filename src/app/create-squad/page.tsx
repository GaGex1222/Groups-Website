'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { createSquadSchema } from '@/schemas/createSquadSchema';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function CreateSquad() {
    const [creationErrorMessage, setCreationErrorMessage] = useState('');
    const [loggedIn, setLoggedIn] = useState(true);
    const { data: session, status } = useSession();
    const [userId, setUserId] = useState(0);
    const dateInputRef = useRef(null); // Create a ref for the date input

    const handleCreateSquad = async (prevState: unknown, formData: FormData) => {
        console.log("Started Creating squad process.");
        const date = formData.get('date');
        const maxPlayers = formData.get('maxPlayers');
        const game = formData.get('game');
        let name = formData.get('name');

        const submission = parseWithZod(formData, {
            schema: createSquadSchema
        })
        if(submission.status !== "success"){
            return submission.reply();
        }

        if (!name) {
            name = `${session?.user.name}'s Squad`;
        }
        try {
            const res = await fetch('/api/createSquad', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    maxPlayers: maxPlayers,
                    name: name,
                    game: game,
                    date: date,
                    userId: userId
                })
            });
            const data = await res.json();
            console.log("Session user id ,", userId)
            if (!data.success) {
                setCreationErrorMessage("Error creating squad, try again later!");
            }
        } catch (error) {
            console.log("Error occurred when trying to create squad: ", error);
        }
    };

    const [lastResult, action] = useFormState(handleCreateSquad, {
        error: undefined,
    });
    const [form, fields] = useForm({
        lastResult,
        onValidate({ formData }) {
            return parseWithZod(formData, { schema: createSquadSchema });
        },
        shouldValidate: 'onBlur',
        shouldRevalidate: "onInput"
    });

    useEffect(() => {
        if (status === "loading") {
            return;
        }
        if (!session) {
            setLoggedIn(false);
        } else {
            console.log("Set userid")
            setUserId(session.user.userId as number);
        }
        if (dateInputRef.current) {
            flatpickr(dateInputRef.current, {
                enableTime: true,
                altFormat: "F j, Y",
                dateFormat: "d F, Y h:i K",
                minDate: new Date()
            });
        }
    }, [status]);

    if (session) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="w-96 bg-white p-8 rounded-md shadow-md border-2 border-[#3795BD] focus:">
                    <h1 className="text-center text-[#3795BD] text-2xl mb-3">Create Squad</h1>
                    <hr />
                    <hr />
                    {creationErrorMessage && (<p className="text-red-500 text-center mt-3">{creationErrorMessage}</p>)}
                    <form id={form.id} onSubmit={form.onSubmit} action={action}>
                        <div className="mt-3">
                            <label htmlFor="email" className="mb-2 block">Name</label>
                            <input key={fields.name.key} name={fields.name.name} required={false} placeholder="Username's Squad..." className="border-2 w-full p-px shadow-md focus:outline-none focus:border-[#3795BD] rounded-md" />
                            <p className="text-red-500 text-xs">{fields.name.errors}</p>
                        </div>
                        <div className="mt-3">
                            <label htmlFor="Password" className="mb-2 block ">Game<small className='text-red-500 ml-2 text-[1.25rem]'>*</small></label>
                            <input key={fields.game.key} name={fields.game.name} placeholder="Game..." type="text" className="border-2 w-full p-px rounded-md shadow-md focus:outline-none focus:border-[#3795BD]" />
                            <p className="text-red-500 text-xs">{fields.game.errors}</p>
                        </div>
                        <div className="mt-3">
                            <label htmlFor="Password" className="mb-2 block ">Max Players<small className='text-red-500 ml-2 text-[1.25rem]'>*</small></label>
                            <input key={fields.maxPlayers.key} name={fields.maxPlayers.name} placeholder="10..." type="text" className="border-2 w-full p-px rounded-md shadow-md focus:outline-none focus:border-[#3795BD]" />
                            <p className="text-red-500 text-xs">{fields.maxPlayers.errors}</p>
                        </div>
                        <div className="mt-3">
                            <label htmlFor="Password" className="mb-2 block ">Date<small className='text-red-500 ml-2 text-[1.25rem]'>*</small></label>
                            <input key={fields.date.key} name={fields.date.name} placeholder="1999/10/02..." type="text" id='datetime' ref={dateInputRef} className="border-2 w-full p-px rounded-md shadow-md focus:outline-none focus:border-[#3795BD]" />
                            <p className="text-red-500 text-xs">{fields.date.errors}</p>
                        </div>
                        <div className="mt-5">
                            <button type="submit" className="border-2 shadow-md text-white hover:-translate-y-1 active:translate-y-0 transform rounded-md px-2 py-1 duration-300 hover:bg-transparent hover:shadow-xl hover:text-black  bg-[#3795BD] w-full border-[#3795BD]">Create Squad</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    } else {
        return (
            !loggedIn && <h1 className='text-center text-5xl text-red-500 flex justify-center items-center h-screen'>You have to be logged in to create squad!</h1>
        );
    }
}
