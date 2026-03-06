import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CardUser from "../components/CardUser";

const equipo = [
    {
        id: 1,
        nombre: "Daniel Lopera",
        rol: "Frontend Developer",
        linkedin: "https://linkedin.com",
        github: "https://github.com",
    },
    {
        id: 2,
        nombre: "Nombre Apellido",
        rol: "Backend Developer",
        linkedin: "https://linkedin.com",
    },
    {
        id: 3,
        nombre: "Nombre Apellido",
        rol: "UI/UX Designer",
        instagram: "https://instagram.com",
    },
];

export default function Team() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 pt-36 pb-16">
                <section className="text-center mb-12 px-4">
                    <h1 className="text-4xl font-extrabold tracking-tight text-blue_dark md:text-5xl">
                        Nuestro Equipo
                    </h1>
                    <p className="text-gray-500 mt-4 max-w-xl mx-auto">
                        Conoce a las personas detrás de Evot Project.
                    </p>
                </section>

                <section className="max-w-screen-xl mx-auto px-4 flex flex-wrap justify-center gap-6">
                    {equipo.map((miembro) => (
                        <CardUser key={miembro.id} {...miembro} />
                    ))}
                </section>
            </main>
            <Footer />
        </div>
    );
}
