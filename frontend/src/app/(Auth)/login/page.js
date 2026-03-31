'use client'
import { useLogin } from '@/features/auth/hooks/useLogin';
import React, { useState } from 'react'

function Login() {
    const [form, setForm] = useState({
        email: "",
        password: "",
    })
    const { handleLogin, error } = useLogin();
    const handleSubmit = async (e)=> {
        e.preventDefault();
        await handleLogin(form);
    }
    return (
    <div>
        <form onSubmit={handleSubmit}>
            <input
                id='email'
                type='email'
                placeholder='email'
                value={form.email}
                onChange={(e)=> setForm({...form, email: e.target.value})}
            />
            <input
                id='password'
                type='password'
                placeholder='password'
                value={form.password}
                onChange={(e)=> setForm({...form, password: e.target.value})}
            />
            <button type='submit'> submit</button>
        </form>
        {error && <p>{error}</p>}
    </div>
    )
}

export default Login
