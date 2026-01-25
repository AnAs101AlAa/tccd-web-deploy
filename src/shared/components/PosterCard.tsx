export default function PosterCard({title, data, icon}: {title: string; data: string; icon: React.ReactNode}) {
  return (
    <div className="w-full p-2 py-6 border group relative border-gray-300 hover:border-black shadow-md transition-all duration-300 ease-in-out rounded-lg flex flex-col items-center">
    {icon}
    <p className="font-bold lg:text-[21px] md:text-[19px] text-[17px] mt-2">{title}</p>
        <p className="text-center text-[13px] md:text-[15px] lg:text-[17px] mt-0 md:mt-2 text-gray-500">
        {data}
        </p>
    <div className={`group-hover:w-full w-0 rounded-b-full transition-all duration-300 ease-in-out absolute bottom-0 left-0 bg-gradient-to-br from-[#cd3a38] to-[#295E7E] h-1`} />
    </div>
  );
}