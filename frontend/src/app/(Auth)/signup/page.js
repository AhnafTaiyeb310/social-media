'use client'
import { useSignup } from '@/features/auth/hooks/useSignup'
import Link from 'next/link'
import React, { useState } from 'react'
import { SleekButton, SleekInput, SleekCard } from '@/components/ui/SleekElements';

function Signup() {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    confirm_password: "",
  })
    
  const { handleSignup, error } = useSignup();
    
  const handleSubmit = async (e)=> {
    e.preventDefault()
    await handleSignup(form)
  }

  return (
    <div className="min-h-screen bg-white flex overflow-hidden">
      {/* Left Side: Marketing */}
      <div className="hidden lg:flex lg:w-1/2 bg-secondary relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-40 left-20 w-80 h-80 border-2 border-white rotate-45"></div>
          <div className="absolute top-20 right-10 w-40 h-40 border border-white rounded-full"></div>
        </div>
                
        <div className="relative z-10 max-w-lg text-white">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-secondary font-black text-3xl mb-8 shadow-xl">S</div>
          <h1 className="text-6xl font-extrabold tracking-tight mb-6">
            Join the future of <br/> <span className="text-purple-200">dev collaboration.</span>
          </h1>
          <p className="text-xl font-medium text-purple-50/80 leading-relaxed mb-8">
            Connect with developers globally. Share your insights, ask questions, and be part of the most vibrant community in tech.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">🤝</div>
              <span className="font-bold text-lg">Meaningful developer connections</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">🏗️</div>
              <span className="font-bold text-lg">Collaborate on real-world systems</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">🎓</div>
              <span className="font-bold text-lg">Learn from industry experts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <div className="lg:hidden mx-auto w-12 h-12 bg-secondary rounded-xl flex items-center justify-center text-white font-bold text-2xl mb-4 shadow-lg shadow-secondary/20">S</div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create your account</h2>
            <p className="mt-2 text-sm text-gray-500 font-medium">Join 50,000+ developers sharing knowledge.</p>
          </div>

          <SleekCard className="p-8 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1" htmlFor="username">
                  Username
                </label>
                <SleekInput
                  id='username'
                  type='text'
                  placeholder='johndoe'
                  value={form.username}
                  onChange={e=> setForm({...form, username: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1" htmlFor="email">
                  Email
                </label>
                <SleekInput
                  id='email'
                  type='email'
                  placeholder='name@example.com'
                  value={form.email}
                  onChange={e=> setForm({...form, email: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1" htmlFor="password">
                  Password
                </label>
                <SleekInput
                  id='password'
                  type='password'
                  placeholder='••••••••'
                  value={form.password}
                  onChange={e=> setForm({...form, password: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1" htmlFor="confirm_password">
                  Confirm
                </label>
                <SleekInput
                  id='confirm_password'
                  type='password'
                  placeholder='••••••••'
                  value={form.confirm_password}
                  onChange={e=> setForm({...form, confirm_password: e.target.value})}
                  required
                />
              </div>

              <SleekButton type="submit" className="w-full shadow-lg mt-4 bg-secondary">
                Get Started
              </SleekButton>
            </form>

            {error && (
              <div className="p-3 bg-danger/10 border border-danger/20 rounded-xl text-danger text-xs font-bold text-center uppercase tracking-wide">
                {typeof error === 'object' ? 'Registration failed' : error}
              </div>
            )}

            <div className="relative pt-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-black">
                <span className="bg-white px-4 text-gray-300">Social registration</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <SleekButton variant="outline" className="!text-[10px] font-black h-12 uppercase tracking-widest">
                Google
              </SleekButton>
              <SleekButton variant="outline" className="!text-[10px] font-black h-12 uppercase tracking-widest">
                GitHub
              </SleekButton>
            </div>
          </SleekCard>

          <p className="text-center lg:text-left text-sm font-medium text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="text-secondary font-bold hover:underline decoration-2 underline-offset-4">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
