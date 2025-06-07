import { useState } from 'react';
import supabase from '../config/supabaseClient'; // Asegúrate de que el path es correcto

export const RecCert = ({ title, description, image, link, capability, recId, recType }) => {
  // Estado para controlar la visibilidad del modal de confirmación
  const [showModal, setShowModal] = useState(false);
  // Estado para rastrear si la recomendación está marcada como completada
  const [completed, setCompleted] = useState(false);

  // Función para manejar la confirmación de completado
  const handleConfirm = async () => {
    setShowModal(false); // Cierra el modal

    try {
      // Obtiene la sesión actual del usuario desde Supabase
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      // Verifica si hay error al obtener la sesión o si el usuario no está autenticado
      if (sessionError || !userId) {
        console.error("Error retrieving session:", sessionError);
        alert("Error: User not authenticated.");
        return;
      }

      // Inserta un registro en la tabla Course_Cert_Completed
      const { error: insertError } = await supabase
        .from("Course_Cert_Completed")
        .insert({
          user_cc_id: userId,
          cert_course_id: recId,
          type: recType
        });

      // Maneja errores en la inserción
      if (insertError) {
        console.error("Error inserting completion:", insertError);
        alert("Something went wrong saving your completion.");
      } else {
        // Marca como completado y muestra feedback al usuario
        setCompleted(true);
        alert("🎉 Saved! You completed this recommendation.");
        window.location.reload(); // Recarga la página para actualizar el estado
      }
    } catch (error) {
      // Maneja errores inesperados
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred.");
    }
  };

  return (
    <div className="w-[300px] h-[350px] bg-white rounded-2xl shadow-lg transition-transform transform hover:-translate-y-2 hover:shadow-2xl flex flex-col flex-shrink-0">
      {/* Imagen de la certificación/recomendación */}
      <img
        src={image}
        alt={title}
        className="w-full h-[100px] object-contain rounded-t-2xl p-2"
      />

      {/* Contenido de la tarjeta */}
      <div className="p-4 flex flex-col h-full">
        {/* Título de la recomendación */}
        <h3 className="text-md font-semibold text-[#A100FF] mb-2 break-words whitespace-normal leading-snug">{title}</h3>

        {/* Descripción  */}
        <div className="flex-grow overflow-hidden">
          <p className="text-xs text-black break-words whitespace-normal text-justify">{description}</p>
        </div>

        {/* Capacidad asociada */}
        <h4 className="text-xs font-semibold text-[#A100FF] break-words whitespace-normal leading-snug mb-2">
          Capability: {capability}
        </h4>

        {/* Botones de acción */}
        <div className="flex justify-between space-x-2 mt-auto">
          {/* Botón para ver el recurso externo */}
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center bg-[#A100FF] text-white text-xs px-2 py-2 rounded-full hover:opacity-90 transition"
          >
            View
          </a>
          {/* Botón para marcar como completado (deshabilitado si ya está completado) */}
          <button
            onClick={() => setShowModal(true)}
            className="flex-1 text-center bg-[#A100FF] text-white text-xs px-2 py-2 rounded-full hover:opacity-90 transition"
            disabled={completed}
          >
            {completed ? "✔ Done" : "Completed"}
          </button>
        </div>
      </div>

      {/* Modal de confirmación (sólo visible cuando showModal es true) */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 rounded-2xl">
          <div className="bg-white p-6 rounded-xl shadow-md w-72 text-center">
            <h2 className="text-md font-semibold mb-4 text-gray-800">Are you sure?</h2>
            <div className="flex justify-around">
              {/* Botón de confirmación */}
              <button
                onClick={handleConfirm}
                className="bg-[#A100FF] text-white px-4 py-1 rounded-full hover:bg-purple-700 transition"
              >
                Yes
              </button>
              {/* Botón para cancelar */}
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