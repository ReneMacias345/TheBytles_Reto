import React, { useState, useEffect } from 'react';
import { ScreenLayout } from '../layouts/ScreenLayout';
import { InfoCard } from '../layouts/InfoCard';
import { RecCert } from '../components/RecCert';
import supabase from '../config/supabaseClient';

// Para mostrar recomendaciones de crecimiento profesional
export const Growth = () => {
  // Estado para almacenar los datos del usuario
  const [userData, setUserData] = useState(null);
  // Estado para almacenar recomendaciones generales de crecimiento
  const [exampleGrowth, setGrowData] = useState({ recommendations: [] });
  // Estado para almacenar recomendaciones de certificaciones
  const [certRecs, setCertRecs] = useState([]);
  // Estado para almacenar recomendaciones de cursos
  const [courseRecs, setCourseRecs] = useState([]);

  // Efecto para probar conexión con Supabase al montar el componente
  useEffect(() => {
    const testSupabaseConnection = async () => {
      // Prueba de conexión con tabla de certificaciones
      const { data: certTest, error: certError } = await supabase
        .from("Cert_Recomendation")
        .select("*")
        .limit(1);

      if (certError) {
        console.error("❌ Error al conectar con Cert_Recomendation:", certError);
      } else {
        console.log("✅ Conexión exitosa. Cert_Recomendation:", certTest);
      }

      // Prueba de conexión con tabla de cursos
      const { data: courseTest, error: courseError } = await supabase
        .from("Course_Recomendation")
        .select("*")
        .limit(1);

      if (courseError) {
        console.error("Error al conectar con Course_Recomendation:", courseError);
      } else {
        console.log("Conexion exitosa. Course_Recomendation:", courseTest);
      }
    };

    testSupabaseConnection();
  }, []);

  // Efecto principal para cargar datos del usuario y recomendaciones
  useEffect(() => {
    const fetchData = async () => {
      // Obtener sesión del usuario actual
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (!userId) {
        console.error("User not logged in.");
        return;
      }

      // Obtener información básica del usuario (nombre y apellido)
      const { data: userInfoData, error: userError } = await supabase
        .from("User")
        .select("firstName, lastName")
        .eq("userId", userId)
        .single();

      if (userError) {
        console.error("Error fetching user info:", userError);
        return;
      }

      setUserData(userInfoData);

      // Obtener recomendaciones generales de la tabla Grow
      const { data: growData, error: growError } = await supabase
        .from("Grow")
        .select("Recomendation")
        .eq("user_grow_id", userId)
        .order("Generated", { ascending: false })
        .limit(4);

      if (growError) {
        console.error("Error fetching Grow data:", growError);
      } else {
        const allRecommendations = growData.map((entry) => entry.Recomendation);
        setGrowData({ recommendations: allRecommendations });
        console.log("Recomendaciones desde Grow:", allRecommendations);
      }

      // Obtener embedding del usuario para recomendaciones personalizadas
      const { data: userEmbeddingData, error: embeddingError } = await supabase
        .from("User")
        .select("embedding")
        .eq("userId", userId)
        .single();

      if (embeddingError || !userEmbeddingData?.embedding) {
        console.error("Error fetching user embedding:", embeddingError);
      } else {
        // Obtener cursos recomendados basados en el embedding del usuario
        const { data: topCourses, error: topCoursesError } = await supabase
          .rpc("get_top_5_courses", {
            user_vec: userEmbeddingData.embedding
          });

        if (topCoursesError) {
          console.error("Error fetching top courses:", topCoursesError);
        } else {
          console.log("Top 5 Course Matches:", topCourses);
          setCourseRecs(topCourses);
        }

        // Obtener certificaciones recomendadas basadas en el embedding del usuario
        const { data: topCerts, error: topCertsError } = await supabase
          .rpc("get_top_5_certificates", {
            user_vec: userEmbeddingData.embedding
          });

        if (topCertsError) {
          console.error("Error fetching top certificates:", topCertsError);
        } else {
          setCertRecs(topCerts);
          console.log("Top 5 Cert Matches:", topCerts);
        }
      }
    };

    fetchData();
  }, []);

  return (
    <ScreenLayout>
      {/* Tarjeta de recomendaciones generales */}
      <InfoCard>
        <div className="grid gap-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Recomendations for your Professional Growth</h2>
            <p className="text-sm text-[#A100FF] font-semibold mb-4">
              Employee: {userData ? `${userData.firstName} ${userData.lastName}` : 'Loading...'}
            </p>
            <ul className="space-y-3 text-gray-700 text-sm">
              {exampleGrowth.recommendations.length > 0 ? (
                exampleGrowth.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#A100FF] mt-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {rec}
                  </li>
                ))
              ) : (
                <li className="text-gray-400 italic">No recommendations available.</li>
              )}
            </ul>
          </div>
        </div>
      </InfoCard>

      {/* Tarjeta de certificaciones recomendadas */}
      <InfoCard>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recommended Certifications</h2>
        <div className="overflow-x-auto whitespace-nowrap flex gap-6 pb-2 scrollbar-transparent">
          {certRecs.length > 0 ? (
            certRecs.map((rec, idx) => (
              <RecCert
                key={idx}
                title={rec.Cert_Name}
                description={<div className="text-sm text-gray-600 mb-4 break-words whitespace-pre-wrap">{rec.Cert_Des}</div>}
                image={rec.Cert_Image}
                link={rec.Cert_Link}
                capability={rec.Capability}
                recId={rec.id_recomendation}  // Usa el ID real
                recType="certification"
              />
            ))
          ) : (
            <p className="text-gray-400 italic">No certifications available.</p>
          )}
        </div>
      </InfoCard>

      {/* Tarjeta de cursos recomendados */}
      <InfoCard>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recommended Courses</h2>
        <div className="overflow-x-auto whitespace-nowrap flex gap-6 pb-2 scrollbar-transparent">
          {courseRecs.length > 0 ? (
            courseRecs.map((rec, idx) => (
              <RecCert
                key={idx}
                title={rec.Course_Name}
                description={<div className="text-sm text-gray-600 mb-4 break-words whitespace-pre-wrap">{rec.Course_Des}</div>}
                image={rec.Course_Image}
                link={rec.Course_Link}
                capability={rec.Capability}
                recId={rec.id_course_recomendation} 
                recType="course"
              />
            ))
          ) : (
            <p className="text-gray-400 italic">No courses available.</p>
          )}
        </div>
      </InfoCard>
    </ScreenLayout>
  );
};