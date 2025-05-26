import React, { useState, useEffect } from 'react';
import { ScreenLayout } from '../layouts/ScreenLayout';
import { InfoCard } from '../layouts/InfoCard';
import { RecCert } from '../components/RecCert';
import supabase from '../config/supabaseClient';

export const Growth = () => {
const [userData, setUserData] = useState(null);
const [exampleGrowth, setGrowData] = useState({ recommendations: [] });

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

    const { data: maxDateData, error: maxDateError } = await supabase
      .from("Grow")
      .select("Generated")
      .eq("user_grow_id", userId)
      .order("Generated", { ascending: false })
      .limit(1);

    if (maxDateError) {
      console.error("Error fetching latest date:", maxDateError);
      return;
    }

    const maxDateRaw = maxDateData?.[0]?.Generated;
    if (!maxDateRaw) {
      console.warn("No records found for user in Grow table.");
      return;
    }

    const maxDateOnly = maxDateRaw.slice(0, 10); // "YYYY-MM-DD"
    console.log("Filtrando por fecha:", maxDateOnly);

    const { data: growData, error: growError } = await supabase
      .from("Grow")
      .select("Recomendation")
      .eq("user_grow_id", userId)
      .gte("Generated", `${maxDateOnly}T00:00:00`)
      .lte("Generated", `${maxDateOnly}T23:59:59.999`);

    if (growError) {
      console.error("Error fetching filtered Grow info:", growError);
      return;
    }

    console.log("growData:", growData);

    const allRecommendations = growData.map((entry) => entry.Recomendation);
    setGrowData({ recommendations: allRecommendations });
  };

  fetchData();
}, []);

  console.log("Recomendaciones:", exampleGrowth.recommendations);

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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-24 h-24 text-[#A100FF] mb-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 0 0 5.427-.63 48.05 48.05 0 0 0 .582-4.717.532.532 0 0 0-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 0 0 .658-.663 48.422 48.422 0 0 0-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 0 1-.61-.58v0Z" />
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
          <RecCert
            title="AWS Cloud Practitioner"
            description="Start your cloud journey with Master the agile methodology with this essential certification.Master the agile methodology with this essential certification.Master the agile methodology with this essential certification."
            image="https://d1.awsstatic.com/training-and-certification/Certification%20Badges/AWS-Certified-Cloud-Practitioner_badge.3d7a42a061fe682f1b90c4c8e0f8bdae2524b714.png"
            link="https://aws.amazon.com/certification/certified-cloud-practitioner/"
            capability="Cibersecurity"
          />
          <RecCert
            title="Scrum Master Certification"
            description="Master the agile methodology with this essential certification.Master the agile methodology with this essential certification.vMaster the agile methodology with this essential certification.Master the agile methodology with this essential "
            image="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*lmRVLYGmZkzR_8hLQgdUOw.png"
            link="https://www.scrum.org/professional-scrum-master-i-certification"
            capability="Cibersecurity"
          />
          <RecCert
            title="Scrum Master Certification"
            description="Master the agile methodology with this essential certification.Master the agile methodology with this essential certification.vMaster the agile methodology with this essential certification.Master the agile methodology with this essential "
            image="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*lmRVLYGmZkzR_8hLQgdUOw.png"
            link="https://www.scrum.org/professional-scrum-master-i-certification"
            capability="Cibersecurity"
          />
          <RecCert
            title="Scrum Master Certification"
            description="Master the agile methodology with this essential certification.Master the agile methodology with this essential certification.vMaster the agile methodology with this essential certification.Master the agile methodology with this essential "
            image="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*lmRVLYGmZkzR_8hLQgdUOw.png"
            link="https://www.scrum.org/professional-scrum-master-i-certification"
            capability="Cibersecurity"
          />
          <RecCert
            title="Scrum Master Certification"
            description="Master the agile methodology with this essential certification.Master the agile methodology with this essential certification.vMaster the agile methodology with this essential certification.Master the agile methodology with this essential "
            image="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*lmRVLYGmZkzR_8hLQgdUOw.png"
            link="https://www.scrum.org/professional-scrum-master-i-certification"
            capability="Cibersecurity"
          />
        </div>
      </InfoCard>

      <InfoCard>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recommended Courses</h2>
        <div className="overflow-x-auto whitespace-nowrap flex gap-6 pb-2 scrollbar-transparent">
          <RecCert
            title="Try to be better"
            description="Start your cloud journey with Master the agile methodology with this essential certification.Master the agile methodology with this essential certification.Master the agile methodology with this essential certification."
            image="https://d1.awsstatic.com/training-and-certification/Certification%20Badges/AWS-Certified-Cloud-Practitioner_badge.3d7a42a061fe682f1b90c4c8e0f8bdae2524b714.png"
            link="https://aws.amazon.com/certification/certified-cloud-practitioner/"
            capability="Cibersecurity"
          />
          <RecCert
            title="Kung -Fu"
            description="Master the agile methodology with this essential certification.Master the agile methodology with this essential certification.vMaster the agile methodology with this essential certification.Master the agile methodology with this essential "
            image="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*lmRVLYGmZkzR_8hLQgdUOw.png"
            link="https://www.scrum.org/professional-scrum-master-i-certification"
            capability="Cibersecurity"
          />
          <RecCert
            title="Brawl Stars expert in 5 days"
            description="Master the agile methodology with this essential certification.Master the agile methodology with this essential certification.vMaster the agile methodology with this essential certification.Master the agile methodology with this essential "
            image="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*lmRVLYGmZkzR_8hLQgdUOw.png"
            link="https://www.scrum.org/professional-scrum-master-i-certification"
            capability="Cibersecurity"
          />
          <RecCert
            title="Be good"
            description="Master the agile methodology with this essential certification.Master the agile methodology with this essential certification.vMaster the agile methodology with this essential certification.Master the agile methodology with this essential "
            image="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*lmRVLYGmZkzR_8hLQgdUOw.png"
            link="https://www.scrum.org/professional-scrum-master-i-certification"
            capability="Cibersecurity"
          />
          <RecCert
            title="Scrum Master Certification"
            description="Master the agile methodology with this essential certification.Master the agile methodology with this essential certification.vMaster the agile methodology with this essential certification.Master the agile methodology with this essential "
            image="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*lmRVLYGmZkzR_8hLQgdUOw.png"
            link="https://www.scrum.org/professional-scrum-master-i-certification"
            capability="Cibersecurity"
          />
        </div>
      </InfoCard>
    </ScreenLayout>
  );
};
