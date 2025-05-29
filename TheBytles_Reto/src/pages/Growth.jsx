import React, { useState, useEffect } from 'react';
import { ScreenLayout } from '../layouts/ScreenLayout';
import { InfoCard } from '../layouts/InfoCard';
import { RecCert } from '../components/RecCert';
import supabase from '../config/supabaseClient';

export const Growth = () => {
  const [userData, setUserData] = useState(null);
  const [exampleGrowth, setGrowData] = useState({ recommendations: [] });
  const [certRecs, setCertRecs] = useState([]);
  const [courseRecs, setCourseRecs] = useState([]);

  useEffect(() => {
    const testSupabaseConnection = async () => {
    
      const { data: certTest, error: certError } = await supabase
        .from("Cert_Recomendation")
        .select("*")
        .limit(1);

      if (certError) {
        console.error("❌ Error al conectar con Cert_Recomendation:", certError);
      } else {
        console.log("✅ Conexión exitosa. Cert_Recomendation:", certTest);
      }

  
      const { data: courseTest, error: courseError } = await supabase
        .from("Course_Recomendation")
        .select("*")
        .limit(1);

      if (courseError) {
        console.error("❌ Error al conectar con Course_Recomendation:", courseError);
      } else {
        console.log("✅ Conexión exitosa. Course_Recomendation:", courseTest);
      }
    };

    testSupabaseConnection();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (!userId) {
        console.error("User not logged in.");
        return;
      }

      
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

      // Fetch Recommendations from Grow Table
      const { data: growData, error: growError } = await supabase
        .from("Grow")
        .select("Recomendation")
        .eq("user_grow_id", userId);

      if (growError) {
        console.error("Error fetching Grow data:", growError);
      } else {
        const allRecommendations = growData.map((entry) => entry.Recomendation);
        setGrowData({ recommendations: allRecommendations });
        console.log("📦 Recomendaciones desde Grow:", allRecommendations);
      }


      const { data: certData, error: certError } = await supabase
        .from("Cert_Recomendation")
        .select("Cert_Name, Cert_Des, Capability, Cert_Link, Cert_Image");

      if (certError) {
        console.error("Error fetching Cert_Recomendation:", certError);
      } else {
        setCertRecs(certData);
        console.log("📘 Certificaciones recomendadas:", certData);
      }

     
      const { data: courseData, error: courseError } = await supabase
        .from("Course_Recomendation")
        .select("Course_Name, Course_Des, Capability, Course_Link, Course_Image");

      if (courseError) {
        console.error("Error fetching Course_Recomendation:", courseError);
      } else {
        setCourseRecs(courseData);
        console.log("📗 Cursos recomendados:", courseData);
      }
    };

    fetchData();
  }, []);

  return (
    <ScreenLayout>
      <InfoCard>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Professional Growth</h2>
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

          <div className="flex flex-col items-center justify-center text-center">
            <svg className="w-24 h-24 text-[#A100FF] mb-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959..." />
            </svg>
            <p className="text-sm text-gray-600 max-w-xs">
              Time you enjoy wasting, was not wasted.
            </p>
          </div>
        </div>
      </InfoCard>

      <InfoCard>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recommended Certifications</h2>
        <div className="overflow-x-auto whitespace-nowrap flex gap-6 pb-2 scrollbar-transparent">
          {certRecs.length > 0 ? (
            certRecs.map((rec, idx) => (
              <RecCert
                key={idx}
                title={rec.Cert_Name}
                description={rec.Cert_Des}
                image={rec.Cert_Image}
                link={rec.Cert_Link}
                capability={rec.Capability}
              />
            ))
          ) : (
            <p className="text-gray-400 italic">No certifications available.</p>
          )}
        </div>
      </InfoCard>

      <InfoCard>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recommended Courses</h2>
        <div className="overflow-x-auto whitespace-nowrap flex gap-6 pb-2 scrollbar-transparent">
          {courseRecs.length > 0 ? (
            courseRecs.map((rec, idx) => (
              <RecCert
                key={idx}
                title={rec.Course_Name}
                description={rec.Course_Des}
                image={rec.Course_Image}
                link={rec.Course_Link}
                capability={rec.Capability}
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
