import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../layouts/Layout';
import { AuthCard } from '../layouts/AuthCard'; 
import { Button } from '../components/Button';
import { SignUpButton } from '../components/SignUpButton';
import '../styles/custom.css';
import supabase from '../config/supabaseClient';

export const Login = () => {
 // console.log(supabase)

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const [formError, setFormError] = useState(null);

  const signInWithEmail = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Login error:", error.message);
      setFormError("Invalid email or password.");
      return;
    }

    setFormError(null);
    alert("Logged in succesfully!");
    navigate("/perfil");
  }

  const onSignUp = () => {
    navigate('/signup');
  };

  return (
    <Layout>
      <AuthCard title="Log In to PathExplorer">
        <form className="space-y-5" onSubmit={signInWithEmail}>
          <div>
            <label className="block text-left mb-2 text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-5 py-3 text-base text-gray-700 placeholder-gray-400
                         bg-gray-100 border border-gray-200 rounded-full
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-left mb-2 text-sm font-medium text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-5 py-3 text-base text-gray-700 placeholder-gray-400
                         bg-gray-100 border border-gray-200 rounded-full
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full mt-4">
            Log In
          </Button>
        </form>

        <p className="mt-5 text-sm text-center text-gray-600">
          Don&apos;t have an account?{' '}
          <SignUpButton onClick={onSignUp}>Sign up</SignUpButton>
        </p>
        { formError && (<p>{formError}</p>)}
      </AuthCard>
    </Layout>
  );
};
