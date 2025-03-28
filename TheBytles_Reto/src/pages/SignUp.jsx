import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../layouts/Layout'; 
import { Button } from '../components/Button';
import warningLogo from '../assets/warning.png';

export const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [careerLevel, setCareerLevel] = useState('');
  const [atc, setAtc] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [cvFile, setCVFile] = useState(null);
  const profilePicInputRef = useRef(null);
  const navigate = useNavigate();
  const handleSignUp = (e) => {
    navigate('/perfil');
  };

  const handleSignIn = () => {
    navigate('/');
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'image/png') {
      setProfilePic(file);
    } else {
      alert('Please select a PNG image.');
    }
  };

  const handleCVChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setCVFile(file);
    } else {
      alert('Please select a PDF file.');
    }
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
        <div className="w-full md:w-3/5 flex justify-center items-center p-4 mt-[-200px]">
          <div className="bg-white p-6 rounded-3xl shadow-xl w-full max-w-lg">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                {profilePic ? (
                  <img
                    src={URL.createObjectURL(profilePic)}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5.121 17.804A6.978 6.978 0 0112 15c1.57 0 3.013.51 4.121 1.375
                         M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2 20h20"
                    />
                  </svg>
                )}
              </div>

              <button
                type="button"
                className="ml-3 font-medium text-[#A100FF] hover:underline bg-transparent"
                onClick={() => profilePicInputRef.current.click()}
              >
                Change
              </button>
              <input
                type="file"
                ref={profilePicInputRef}
                className="hidden"
                accept="image/png"
                onChange={handleProfilePicChange}
              />
            </div>

            <form onSubmit={handleSignUp} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
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
                    type="text"
                    className="w-full px-3 py-2 text-base text-gray-700 
                               bg-gray-100 border border-gray-200 rounded-full
                               focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 text-base text-gray-700 
                             bg-gray-100 border border-gray-200 rounded-full
                             focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  className="w-full px-3 py-2 text-base text-gray-700
                             bg-gray-100 border border-gray-200 rounded-full
                             focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="">Select Role</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="SCRUM Master">SCRUM Master</option>
                  <option value="QA Automation Test Lead">QA Automation Test Lead</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Career Level
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 text-base text-gray-700 
                               bg-gray-100 border border-gray-200 rounded-full
                               focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={careerLevel}
                    onChange={(e) => setCareerLevel(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    ATC
                  </label>
                  <select
                    className="w-full px-3 py-2 text-base text-gray-700
                               bg-gray-100 border border-gray-200 rounded-full
                               focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={atc}
                    onChange={(e) => setAtc(e.target.value)}
                  >
                    <option value="">Select ATC</option>
                    <option value="CDMX">CDMX</option>
                    <option value="MTY">MTY</option>
                    <option value="QRO">QRO</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Enter Password <span className="text-red-500">*</span>
                </label>
                <input
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
                  type="password"
                  className="w-full px-3 py-2 text-base text-gray-700 
                             bg-gray-100 border border-gray-200 rounded-full
                             focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Upload CV
                </label>
                <label className="border-2 border-dashed border-gray-300 rounded-2xl p-4 text-center text-gray-500 bg-gray-50 cursor-pointer block">
                  <p className="text-sm">
                    Choose a file or drag &amp; drop it here <br />
                    PDF only
                  </p>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleCVChange}
                  />
                </label>
                {cvFile && (
                  <p className="mt-2 text-sm text-gray-700">
                    File selected: {cvFile.name}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full mt-3 py-2">
                Sign Up
              </Button>
            </form>

            <p className="mt-3 text-sm text-center text-gray-600">
              Already have an account?{' '}
              <button
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
