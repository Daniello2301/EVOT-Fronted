export default function CardPartner({ partner }) {
    return (
        <div className="w-[180px] h-auto grid justify-center overflow-hidden border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-3">
            <div className="h-[100px] w-full flex items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                {partner?.logo
                    ? <img className="w-full h-full object-contain" src={partner.logo} alt={partner.nombreInstitucion} />
                    : <span className="text-4xl font-bold text-blue_dark">
                        {partner?.nombreInstitucion?.charAt(0) ?? 'I'}
                    </span>
                }
            </div>
            <div className="p-2 flex justify-center mt-1">
                <h2 className="text-blue_dark text-center text-sm font-medium">
                    {partner?.nombreInstitucion ?? 'Institución'}
                </h2>
            </div>
        </div>
    );
}