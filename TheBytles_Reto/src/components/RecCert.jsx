import { useState } from 'react';
import supabase from '../config/supabaseClient'; // Asegúrate de que el path es correcto

export const RecCert = ({ title, description, image, link, capability, recId, recType }) => {
  const [showModal, setShowModal] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleConfirm = async () => {
    setShowModal(false);

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (sessionError || !userId) {
        console.error("Error retrieving session:", sessionError);
        alert("Error: User not authenticated.");
        return;
      }

      const { error: insertError } = await supabase
        .from("Course_Cert_Completed")
        .insert({
          user_cc_id: userId,
          cert_course_id: recId,
          type: recType
        });

      if (insertError) {
        console.error("Error inserting completion:", insertError);
        alert("Something went wrong saving your completion.");
      } else {
        setCompleted(true);
        alert("🎉 Saved! You completed this recommendation.");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred.");
    }
  };

  return (
    <div className="w-[300px] h-[350px] bg-white rounded-2xl shadow-lg transition-transform transform hover:-translate-y-2 hover:shadow-2xl flex flex-col flex-shrink-0">
      <img
        src={image}
        alt={title}
        className="w-full h-[100px] object-contain rounded-t-2xl p-2"
      />

      <div className="p-4 flex flex-col h-full">
        <h3 className="text-md font-semibold text-[#A100FF] mb-2 break-words whitespace-normal leading-snug">{title}</h3>

        <div className="flex-grow overflow-hidden">
          <p className="text-xs text-black break-words whitespace-normal text-justify">{description}</p>
        </div>

        <h4 className="text-xs font-semibold text-[#A100FF] break-words whitespace-normal leading-snug mb-2">
          Capability: {capability}
        </h4>

        <div className="flex justify-between space-x-2 mt-auto">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center bg-[#A100FF] text-white text-xs px-2 py-2 rounded-full hover:opacity-90 transition"
          >
            View
          </a>
          <button
            onClick={() => setShowModal(true)}
            className="flex-1 text-center bg-[#A100FF] text-white text-xs px-2 py-2 rounded-full hover:opacity-90 transition"
            disabled={completed}
          >
            {completed ? "✔ Done" : "Completed"}
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 rounded-2xl">
          <div className="bg-white p-6 rounded-xl shadow-md w-72 text-center">
            <h2 className="text-md font-semibold mb-4 text-gray-800">Are you sure?</h2>
            <div className="flex justify-around">
              <button
                onClick={handleConfirm}
                className="bg-[#A100FF] text-white px-4 py-1 rounded-full hover:bg-purple-700 transition"
              >
                Yes
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-1 rounded-full hover:bg-gray-400 transition"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
