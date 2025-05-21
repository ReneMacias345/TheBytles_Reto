export const RecCert = ({ title, description, image, link ,capability}) => {
  return (
    <div className="w-[300px] h-[340px] bg-white rounded-2xl shadow-lg transition-transform transform hover:-translate-y-2 hover:shadow-2xl flex flex-col flex-shrink-0">

      <img
        src={image}
        alt={title}
        className="w-full h-[170px] object-contain rounded-t-2xl p-1"
      />
      

      <div className="p-4 flex flex-col h-full">
        <h3 className="text-md font-semibold text-[#A100FF] mb-2">{title}</h3>
        

        <div className="flex-grow overflow-hidden">
          <p className="text-xs text-gray-600 break-words whitespace-normal text-justify">
            {description}
          </p>
        </div>
        <h3> {capability}</h3>
        
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-center bg-[#A100FF] text-white text-xs px-4 py-2 rounded-full hover:opacity-90 transition"
        >
          View recommendation
        </a>
      </div>
    </div>
  );
};