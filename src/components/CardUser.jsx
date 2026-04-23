import UserIcon from "../icons/User"

export default function CardUser({
    nombre,
    rol,
    foto,
    facebook,
    linkedin,
    instagram,
}) {
    return (
        <div className="max-w-[250px] h-auto grid justify-center overflow-hidden border-solid p-2 border-2 rounded-lg transition ease-in hover:scale-105 hover:shadow-md">
            <div className="w-[200px] h-[200px] overflow-hidden rounded-lg">
                <img
                    className="w-full h-full object-cover object-center"
                    src={foto || UserIcon}
                    alt={nombre}
                />
            </div>
            <div className="flex flex-col m-2">
                <h2 className="text-xl text-blue_primary font-semibold">
                    {nombre || "Nombre"}
                </h2>
                <p className="text-gray-500 text-sm">{rol || "Rol"}</p>
            </div>
            <div className="flex flex-grow mx-4 my-3 gap-1">
                {facebook && (
                    <a
                        href={facebook}
                        target="_blank"
                        rel="noreferrer"
                        className="h-8 w-8 p-1 hover:rounded-full hover:bg-blue_primary hover:text-white_primary flex items-center justify-center transition-colors"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3" />
                        </svg>
                    </a>
                )}
                {linkedin && (
                    <a
                        href={linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="h-8 w-8 p-1 hover:rounded-full hover:bg-blue_primary hover:text-white_primary flex items-center justify-center transition-colors"
                    >
                        <svg


                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
                            <path d="M8 11l0 5" />
                            <path d="M8 8l0 .01" />
                            <path d="M12 16l0 -5" />
                            <path d="M16 16v-3a2 2 0 0 0 -4 0" />
                        </svg>
                    </a>
                )}
                {instagram && (
                    <a
                        href={instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="h-8 w-8 p-1 hover:rounded-full hover:bg-blue_primary hover:text-white_primary flex items-center justify-center transition-colors"
                    >
                        <svg


                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M4 4m0 4a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z" />
                            <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                            <path d="M16.5 7.5l0 .01" />
                        </svg>
                    </a>
                )}
            </div>
        </div>
    );
}
