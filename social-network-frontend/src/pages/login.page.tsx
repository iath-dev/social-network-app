import { useNavigate } from "react-router-dom";
import React from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { LoginForm, LoginResponse } from '../types/auth';
import axios from 'axios';

const LoginPage: React.FC = () => {
    const { register, handleSubmit } = useForm();
    const nav = useNavigate();

    const navigateToRegister = () => {
        nav("/register");
    }

    const onSubmit: SubmitHandler<LoginForm> = async (data) => {
        try {
            const res = await axios.post<LoginResponse>("http://localhost:3001/login", { email: data.email, password: data.password });

            const { token } = res.data;
            
            localStorage.setItem("token", token);
            nav("/");
            
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <section className='w-screen h-screen flex items-center justify-center'>
            <form className='gap-4 flex flex-col items-center justify-center rounded px-4 py-2 shadow-md bg-white gap-2' onSubmit={handleSubmit(onSubmit as SubmitHandler<FieldValues>)}>
                <h1 className="text-2xl font-bold">Login</h1>
                <fieldset>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                    <input id="email" {...register("email", { required: true })} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 " placeholder="Write your thoughts here..." />
                </fieldset>
                <fieldset>
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                    <input id="password" type='password' {...register("password", { required: true })} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 " placeholder="Write your thoughts here..." />
                </fieldset>
                <div className='flex gap-2'>
                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none">Login</button>
                    <button className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100" onClick={navigateToRegister}>Register</button>
                </div>
            </form>
        </section>
    )

//   return (
//     <Box sx={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//         <Container sx={{ padding: "1rem 2rem", display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
//             <form onSubmit={handleSubmit(onSubmit as SubmitHandler<FieldValues>)}>
//                 <Stack direction="column" justifyContent="space-between" alignItems="center" spacing={2}>
//                     <Typography variant="h4" component="h1" gutterBottom>
//                         Login
//                     </Typography>
//                     <TextField {...register("email", {required: true})} label="Email" variant="outlined" size='small' type='email' required />
//                     <TextField {...register("password", { required: true })} label="Password" variant="outlined" size='small' type='password' required />
//                     <Button variant="contained" size="small" fullWidth type='submit'>Login</Button>
//                     <Button variant="outlined" size="small" fullWidth onClick={navigateToRegister}>Register</Button>
//                 </Stack>
//             </form>
//         </Container>
//     </Box>
//   )
}

export default LoginPage