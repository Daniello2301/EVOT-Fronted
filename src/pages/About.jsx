import aboutImg from "../assets/about.svg";

export default function About() {
    return (
        <main className="flex-1 pt-1">
            {/* Hero */}
            <section
                className="w-full h-64 flex items-center justify-center bg-cover bg-center relative"
                style={{ backgroundImage: `url(${aboutImg})` }}
            >
                <div className="absolute inset-0 bg-blue_primary/60" />
                <h1 className="relative z-10 text-4xl font-extrabold text-white_primary text-center md:text-5xl">
                    Acerca de Nosotros
                </h1>
            </section>

            {/* Misión */}
            <section className="max-w-3xl mx-auto px-4 py-16 text-center">
                <h2 className="text-2xl font-bold text-blue_primary mb-4">
                    Nuestra Misión
                </h2>
                <p className="text-lg text-gray-500 tracking-wide text-justify leading-relaxed">
                    Somos un equipo pequeño de grandes mentes, enfocado en encontrar las
                    mejores soluciones a los problemas más básicos y cotidianos que se
                    puedan presentar en pequeñas comunidades, con la intención de no
                    dejar a ninguno por fuera.
                </p>
            </section>

            {/* Valores */}
            <section className="bg-gray_primary py-16">
                <div className="max-w-screen-xl mx-auto px-4">
                    <h2 className="text-2xl font-bold text-blue_primary text-center mb-10">
                        Nuestros Valores
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                titulo: "Transparencia",
                                descripcion:
                                    "Creemos en la verificación abierta y confiable de logros académicos.",
                            },
                            {
                                titulo: "Innovación",
                                descripcion:
                                    "Buscamos soluciones tecnológicas simples para problemas complejos.",
                            },
                            {
                                titulo: "Inclusión",
                                descripcion:
                                    "Trabajamos para que ninguna comunidad quede sin acceso a sus certificados.",
                            },
                        ].map((valor) => (
                            <div
                                key={valor.titulo}
                                className="bg-white_primary rounded-xl p-6 shadow-sm text-center"
                            >
                                <h3 className="text-lg font-bold text-blue_primary mb-2">
                                    {valor.titulo}
                                </h3>
                                <p className="text-gray-500 text-sm">{valor.descripcion}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
