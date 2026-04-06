import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function StudentRegister() {
    const { login, recuperarEstadoPendiente } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        numeroDocumento: "",
        nombreUsuario: "",
        correo: "",
        contraseña: "",
        confirmarContraseña: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Validar que las contraseñas coincidan
        if (formData.contraseña !== formData.confirmarContraseña) {
            setError("Las contraseñas no coinciden");
            setLoading(false);
            return;
        }

        try {
            // 1. Registrar al usuario
            const response = await fetch('tu-api/registro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombreUsuario: formData.nombreUsuario,
                    correo: formData.correo,
                    contraseña: formData.contraseña
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.msg || 'Error al registrarse');
            }

            // 2. ⭐ Hacer login automático después del registro exitoso
            const estadoPendiente = await login(formData.correo, formData.contraseña);

            // 3. ⭐ Redirigir según si hay estado pendiente o no
            if (estadoPendiente) {
                // Si el usuario estaba intentando solicitar un diploma, volver a esa página
                navigate(estadoPendiente.url);
            } else {
                // Si no, ir al home o dashboard
                navigate("/");
            }

        } catch (err) {
            setError(err.message || "Error al registrarse");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center flex-1 py-12 px-4">
            <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-blue_primary md:text-2xl">
                        Crear cuenta de estudiante
                    </h1>

                    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-blue_primary">
                                Número de documento
                            </label>
                            <input
                                type="text"
                                name="numeroDocumento"
                                value={formData.numeroDocumento}
                                onChange={handleChange}
                                className="bg-gray_primary border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="123456789"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-blue_primary">
                                Nombre de usuario
                            </label>
                            <input
                                type="text"
                                name="nombreUsuario"
                                value={formData.nombreUsuario}
                                onChange={handleChange}
                                className="bg-gray_primary border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="Juan Pérez"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium text-blue_primary">
                                Correo electrónico
                            </label>
                            <input
                                type="email"
                                name="correo"
                                value={formData.correo}
                                onChange={handleChange}
                                className="bg-gray_primary border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="name@company.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium text-blue_primary">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                name="contraseña"
                                value={formData.contraseña}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="bg-gray_primary border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium text-blue_primary">
                                Confirmar contraseña
                            </label>
                            <input
                                type="password"
                                name="confirmarContraseña"
                                value={formData.confirmarContraseña}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="bg-gray_primary border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                required
                            />
                        </div>

                        {error && (
                            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Registrando..." : "Registrarse"}
                        </button>

                        {/* Link para volver al login */}
                        <div className="text-sm font-medium text-gray-500">
                            ¿Ya tienes cuenta?{" "}
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="text-blue-600 hover:underline bg-transparent border-none cursor-pointer"
                            >
                                Inicia sesión
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}

export default StudentRegister;