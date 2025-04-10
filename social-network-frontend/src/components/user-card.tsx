import React, { useEffect, useState } from "react";
import { UserProfile } from "../types/auth";
import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Post } from "../types/posts";

interface UserCardComponent {
    onSubmit: () => void;
}

const UserCard: React.FC<UserCardComponent> = ({ onSubmit }) => {
    const { register, handleSubmit, reset } = useForm();
    const [user, setUser] = useState<UserProfile | null>(null);

    const getProfile = async () => {
        const token = localStorage.getItem("token");
        
        if (!token) return;

        const res = await axios.get<UserProfile>("http://localhost:3001/profile", { headers: { Authorization: `Bearer ${token}` } });
        
        setUser(res.data);
    }

    const onPost: SubmitHandler<Pick<Post, 'content'>> = async (data) => {
        try {
            const { content } = data;
            
            const token = localStorage.getItem("token");
            
            if (!content || !token) return;

            await axios.post("http://localhost:3002", { content }, { headers: { Authorization: `Bearer ${token}` } });

            reset();
            onSubmit();
            
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getProfile();
    }, [])

    if (!user) return null;

    return (
        <div className="rounded px-4 py-2 shadow-md bg-white gap-2">
            <div className="flex flex-col justify-between">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <h1 className="text-md font-medium text-gray-500">{user.email}</h1>
            </div>
            <form className="flex flex-col gap-2 mt-4" onSubmit={handleSubmit(onPost as SubmitHandler<FieldValues>)}>
                <div>
                    <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900">Your message</label>
                    <textarea id="content" {...register("content", { required: true })} rows={5} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 " placeholder="Write your thoughts here..."></textarea>
                </div>
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none">Publish</button>
            </form>
        </div>
    )
}

export default UserCard;