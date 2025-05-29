export const RecCert = ({ title, description, image, link ,capability}) => {
  return (
    <div className="w-[300px] h-[350px] bg-white rounded-2xl shadow-lg transition-transform transform hover:-translate-y-2 hover:shadow-2xl flex flex-col flex-shrink-0">

      <img
        src={image}
        alt={title}
        className="w-full h-[130px] object-contain rounded-t-2xl p-2"
      />
      

      <div className="p-4 flex flex-col h-full">
        <h3 className="text-md font-semibold text-[#A100FF] mb-2 break-words whitespace-normal leading-snug">
            {title}</h3>
        

        <div className="flex-grow overflow-hidden">
          <p className="text-xs text-black break-words whitespace-normal text-justify">
            {description}
          </p>
        </div>

        <h4 className="text-xs font-semibold text-[#A100FF] break-words whitespace-normal leading-snug">
             Capability:{capability}
             </h4>
        
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