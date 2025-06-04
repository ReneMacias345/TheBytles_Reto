import React, { useState, useRef } from 'react';
import supabase from '../config/supabaseClient';

export const CertCard = ({ id, certName, description, date, expiration, onEdit, cert_url }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(certName);
  const [editDate, setEditDate] = useState(date);
  const [editExpiration, setEditExpiration] = useState(expiration);
  const [editDescription, setEditDescription] = useState(description);
  const [editFile, setEditFile] = useState(null);
  const fileInputRef = useRef(null);

  const uploadCertPDF = async (file, userId) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `cert/${userId}-${id}.${fileExt}`;
    const contentType = file.type || "application/pdf";

    const { error: uploadError } = await supabase.storage
      .from("media")
      .upload(fileName, file, {
        upsert: true,
        contentType,
        cacheControl: "3600",
      });

    if (uploadError) {
      console.error("Upload error:", uploadError.message);
      alert("Error uploading certificate PDF.");
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from("media")
      .getPublicUrl(fileName);

    return publicUrlData?.publicUrl || null;
  };

  return (
    <div className="bg-gray-100 p-6 rounded-3xl shadow-md flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">{certName}</h3>
        <div className="h-1 bg-[#A100FF] rounded"></div>
        <p className="text-sm text-gray-600 mb-4 mt-2">{description}</p>
      </div>

      <div className="flex justify-between items-center text-xs text-gray-500 [mt-auto">
        <div>
          <p><strong>Realized:</strong> {date}</p>
          <p><strong>Expires:</strong> {expiration || 'N/A'}</p>
        </div>

        <div className="flex gap-2 items-center ml-12"></div>
        <button
          onClick={() => setShowEditModal(true)}
          className="flex items-center px-3 py-1 bg-gray-200 text-gray-800 rounded-full hover:opacity-90 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5 mr-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82
              a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685
              a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Z"
            />
          </svg>
          Edit
        </button>
        <button
          onClick={() => {
            if (cert_url) {
              window.open(cert_url, '_blank');
            } else {
              alert("No certification file available.");
            }
          }}
          className="flex items-center px-3 py-1 bg-[#A100FF] text-white rounded-full hover:opacity-90 transition text-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4 mr-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          See certification
        </button>
      </div>

      {showEditModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-xl p-6 rounded-xl shadow-md relative">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-3 right-3 bg-gray-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold text-center mb-4">Edit Certification</h2>
            <form className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Certification Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A100FF]"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Date of Realization</label>
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A100FF]"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Expiration Date</label>
                <input
                  type="date"
                  value={editExpiration}
                  onChange={(e) => setEditExpiration(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A100FF]"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A100FF]"
                  rows="3"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Replace Certification PDF</label>
                <div className="flex items-center space-x-2">
                    <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="flex items-center px-3 py-1 bg-gray-100 text-sm text-[#A100FF] rounded hover:underline"
                    >
                     <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 inline-block mr-2 transition-colors group-hover:stroke-white"
                    >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    Upload PDF
                    </button>
                    {editFile && <p className="text-sm text-gray-600">{editFile.name}</p>}
                </div>
                <input
                    type="file"
                    accept="application/pdf"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => setEditFile(e.target.files[0])}
                />
                </div>
              <button
                type="button"
                onClick={async () => {
                  const { data: { session } } = await supabase.auth.getSession();
                  const userId = session?.user?.id;

                  if (!userId) {
                    alert("User not logged in.");
                    return;
                  }

                  let publicUrl = null;

                  if (editFile) {
                    publicUrl = await uploadCertPDF(editFile, userId);
                    if (!publicUrl) return;
                  }

                  await onEdit({
                    id,
                    certName: editName,
                    date: editDate,
                    expiration: editExpiration,
                    description: editDescription,
                    cert_url: publicUrl 
                  });

                  setShowEditModal(false);
                }}
                className="w-full py-2 bg-[#A100FF] text-white rounded-full hover:opacity-90 transition"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
