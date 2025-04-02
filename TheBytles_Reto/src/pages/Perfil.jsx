import React from 'react';
import supabase from '../config/supabaseClient';

export const Perfil = () => {
  console.log(supabase)
  return (
    <div className="container mt-5">
      <h1 className="title">Perfil</h1>
      <p >Hola John</p>
    </div>
  );
};
