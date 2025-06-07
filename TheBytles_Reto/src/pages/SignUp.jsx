import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../layouts/Layout'; 
import { Button } from '../components/Button';
import warningLogo from '../assets/warning.png';
import supabase from '../config/supabaseClient';

export const SignUp = () => {
  // Estados para los campos del formulario
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [capability, setCapability] = useState('');
  const [careerLevel, setCareerLevel] = useState('');
  const [atc, setAtc] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [since, setSince] = useState('');
  const navigate = useNavigate(); // Hook para navegar
  const [formError, setFormError] = useState(null); // Manejo de errores del formulario

  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validación de campos vacíos
    if (!firstName || !lastName || !email || !atc || !password || !repeatPassword || !capability || !since ) {
      setFormError("Please fill in all the required fields");
      return;
    }

    // Validación de coincidencia de contraseñas
    if (password !== repeatPassword) {
      setFormError("Passwords do not match");
      return;
    }

    // Validación básica de email
    if (!email.includes("@" && ".")) {
      setFormError("Please enter a valid email.");
      return;
    }
    
    // Validación de longitud mínima de contraseña
    if (password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }

    // Validación de rango de career level
    if (careerLevel > 13 || careerLevel < 1) {
      setFormError("Career level must be in the 1-13 range.");
      return;
    }
  
    // Registro del usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
  
    // Manejo de error en Supabase Auth
    if (authError) {
      setFormError(authError.message);
      return;
    }

    const userId = authData?.user?.id; // Obtener ID del usuario registrado

    if (!userId) {
      setFormError("User ID not found after signup.");
      return;
    }

    // Inserción de datos en tabla "User"
    const { data: userData, error: userError } = await supabase
      .from("User")
      .insert([
        {
          userId,
          firstName,
          lastName,
          email,
          capability,
          careerLevel: parseInt(careerLevel),
          atc,
          //password, // PLS PLS PLS quitar en produccion, supabase ya lo guarda seguramente :D
          Since: since
        },
      ]);
  
    // Validación de error de inserción
    if (userError) {
      if (userError.code === "23505") {
        setFormError("This email is already registered in our database. Please try logging in.");
      } 
      return;
    }
  
    // profilePic y CV aca ?
  
    setFormError(null); // Limpiar errores
    alert("Account created succesfully! Please check your inbox: You must authenticate before logging in.");
    navigate("/"); // Redirige al inicio
  };

  // Navegar a login
  const handleSignIn = () => {
    navigate('/');
  };

  return (
    <Layout>
      <div className="flex min-h-screen bg-[#F8F9FD]">
        <div className="hidden md:flex md:w-2/5 flex-col justify-center px-32 mt-[-200px] ml-8">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">
            Create your account
          </h1>
          <div className="flex items-start">
            <img
              src={warningLogo}
              alt="Warning"
              className="w-6 h-6 mr-2 mt-1"
            />
            <p className="text-base text-gray-600 leading-snug">
              Please provide accurate and up-to-date information when signing up.
              This ensures a secure account, seamless experience, and better
              allows us to tailor our services to your needs.
            </p>
          </div>
        </div>

        {/* Contenedor del formulario */}
        <div className="w-full md:w-3/5 flex justify-center items-center p-4 mt-[-200px]">
          <div className="bg-white p-6 rounded-3xl shadow-xl w-full max-w-lg">

            {/* Formulario de registro */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Nombre y apellido */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="firstname"
                    type="text"
                    pattern="[A-Za-zÀ-ÿ\s]+"
                    title="Please enter only letters"
                    className="w-full px-3 py-2 text-base text-gray-700 
                               bg-gray-100 border border-gray-200 rounded-full
                               focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="lastname"
                    type="text"
                    pattern="[A-Za-zÀ-ÿ\s]+"
                    title="Please enter only letters"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-base text-gray-700 bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  className="w-full px-3 py-2 text-base text-gray-700 
                             bg-gray-100 border border-gray-200 rounded-full
                             focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Capability */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Capability <span className="text-red-500">*</span>
                </label>
                <select
                  name="capability"
                  className="w-full px-3 py-2 text-base text-gray-700
                             bg-gray-100 border border-gray-200 rounded-full
                             focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={capability}
                  onChange={(e) => setCapability(e.target.value)}
                  required
                >
                  <option value="">Select Capability</option>
                  <option value="Software Development">Software Development</option>
                  <option value="Systems and Network Administration">Systems and Network Administration</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Data Science and Big Data">Data Science and Big Data</option>
                  <option value="Artificial Intelligence and Machine Learning">Artificial Intelligence and Machine Learning</option>
                  <option value="IT and Project Management">IT and Project Management</option>
                  <option value="Cloud Computing and DevOps">Cloud Computing and DevOps</option>
                  <option value="Video Game Development">Video Game Development</option>
                  <option value="Internet of Things (IoT)">Internet of Things (IoT)</option>
                  <option value="Blockchain and Cryptocurrencies">Blockchain and Cryptocurrencies</option>
                  <option value="Technical Support and Help Desk">Technical Support and Help Desk</option>  
                </select>
              </div>

              {/* Career Level y ATC */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Career Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="carrerlevel"
                    className="w-full px-3 py-2 text-base text-gray-700
                               bg-gray-100 border border-gray-200 rounded-full
                               focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={careerLevel}
                    onChange={(e) => setCareerLevel(parseInt(e.target.value))}
                    required
                  >
                    <option value="">Select Career Level</option>
                    {/* Opciones 1-13 */}
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    ATC <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="atc"
                    className="w-full px-3 py-2 text-base text-gray-700
                               bg-gray-100 border border-gray-200 rounded-full
                               focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={atc}
                    onChange={(e) => setAtc(e.target.value)}
                    required
                  >
                    <option value="">Select ATC</option>
                    <option value="CDMX">CDMX</option>
                    <option value="MTY">MTY</option>
                    <option value="QRO">QRO</option>
                  </select>
                </div>
              </div>

              {/* Fecha de ingreso */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Start working in Accenture at <span className="text-red-500">*</span>
                </label>
                <input
                  name="since"
                  type="date"
                  className="w-full px-3 py-2 text-base text-gray-700 
                             bg-gray-100 border border-gray-200 rounded-full
                             focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={since}
                  onChange={(e) => setSince(e.target.value)}
                  required
                />
              </div>

              {/* Contraseña */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Enter Password <span className="text-red-500">*</span>
                </label>
                <input
                  name="password"
                  type="password"
                  className="w-full px-3 py-2 text-base text-gray-700 
                             bg-gray-100 border border-gray-200 rounded-full
                             focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Repeat Password <span className="text-red-500">*</span>
                </label>
                <input
                  name="repeatpassword"
                  type="password"
                  className="w-full px-3 py-2 text-base text-gray-700 
                             bg-gray-100 border border-gray-200 rounded-full
                             focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  required
                />
              </div>

              {/* Botón de registro */}
              <Button name="signup" type="submit" className="w-full mt-3 py-2">
                Sign up
              </Button>

              {/* Mensaje de error si existe */}
              { formError && (<p className='text-center text-red-500 text-lg font-bold mt-4'>{formError}</p>)}
            </form>

            {/* Link a login */}
            <p className="mt-3 text-sm text-center text-gray-600">
              Already have an account?{' '}
              <button
                name="signin"
                className="font-medium text-[#A100FF] hover:underline bg-transparent"
                onClick={handleSignIn}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};
