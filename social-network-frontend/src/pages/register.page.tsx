import React from 'react';
import { SubmitHandler, FieldValues, useForm } from 'react-hook-form';
import { RegisterFormData } from '../types/auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage: React.FC = () => {
    const { register, handleSubmit } = useForm();
    const nav = useNavigate();

    const navigateToLogin = () => {
        nav("/login");
    }

    const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
        try {
            if (data.password !== data.confirm) {
                return;
            }

            await axios.post("http://localhost:3001/register", { email: data.email, name: data.name, password: data.password });
            
            
            navigateToLogin()
            
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <section className='w-screen h-screen flex items-center justify-center'>
        <form className='gap-4 flex flex-col items-center justify-center rounded px-4 py-2 shadow-md bg-white gap-2' onSubmit={handleSubmit(onSubmit as SubmitHandler<FieldValues>)}>
            <h1 className="text-2xl font-bold">Register</h1>
            <fieldset>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Name</label>
                <input id="name" {...register("name", { required: true })} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 " placeholder="Write your thoughts here..." />
            </fieldset>
            <fieldset>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                <input id="email" {...register("email", { required: true })} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 " placeholder="Write your thoughts here..." />
            </fieldset>
            <fieldset>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                <input id="password" type='password' {...register("password", { required: true })} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 " placeholder="Write your thoughts here..." />
            </fieldset>
            <fieldset>
                <label htmlFor="confirm" className="block mb-2 text-sm font-medium text-gray-900">Confirm Password</label>
                <input id="confirm" type='password' {...register("confirm", { required: true })} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 " placeholder="Write your thoughts here..." />
            </fieldset>
            <div className='flex gap-2'>
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none">Register</button>
                <button className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100" onClick={navigateToLogin}>Back</button>
            </div>
        </form>
    </section>
  )
}   

export default RegisterPage