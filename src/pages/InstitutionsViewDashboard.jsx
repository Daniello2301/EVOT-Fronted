import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyInstitucion, updateMyInstitucion } from "../services/institucions.service";

const institutionFormFields = [
    { key: "nombreInstitucion", label: "Nombre de la institución" },
    { key: "codigoInstitucion", label: "Código" },
    { key: "ciudad", label: "Ciudad" },
    { key: "departamento", label: "Departamento" }
];

export default function InstitutionsViewDashboard() {
    const { authUser } = useAuth();
    const role = authUser?.rol;
    const isAdmin = role === "ADMIN";
    const isInstitution = role === "INSTITUCION";

    const [myInstitution, setMyInstitution] = useState(null);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

    useEffect(() => {
        if (!isInstitution) return;

        const loadMyInstitution = async () => {
            setLoading(true);
            setStatusMessage("");
            try {
                const response = await getMyInstitucion();
                const payload = response?.data ?? response;
                setMyInstitution(payload);
                setFormData({
                    nombreInstitucion: payload?.nombreInstitucion ?? "",
                    codigoInstitucion: payload?.codigoInstitucion ?? "",
                    ciudad: payload?.ciudad ?? "",
                    departamento: payload?.departamento ?? ""
                });
            } catch (error) {
                setStatusMessage("No fue posible cargar la información de tu institución.");
            } finally {
                setLoading(false);
            }
        };

        loadMyInstitution();
    }, [isInstitution]);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setStatusMessage("");

        try {
            await updateMyInstitucion({
                nombreInstitucion: formData.nombreInstitucion,
                ciudad: formData.ciudad,
                departamento: formData.departamento
            });
            setStatusMessage("Cambios guardados correctamente.");
        } catch (error) {
            setStatusMessage("No se pudo actualizar la información. Inténtalo nuevamente.");
        } finally {
            setSaving(false);
        }
    };

    if (isAdmin) {
        return (
            <section className="p-4 md:p-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h1 className="text-2xl font-black text-slate-900">Gestión de instituciones</h1>
                    <p className="mt-2 text-sm text-slate-600">
                        Como administrador puedes crear, editar, activar o desactivar instituciones en el módulo global.
                    </p>
                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        <article className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                            <p className="text-xs uppercase tracking-wide text-blue-700">Acceso</p>
                            <p className="mt-1 text-sm font-semibold text-slate-900">Total</p>
                        </article>
                        <article className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                            <p className="text-xs uppercase tracking-wide text-emerald-700">Cobertura</p>
                            <p className="mt-1 text-sm font-semibold text-slate-900">Todas las instituciones</p>
                        </article>
                        <article className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                            <p className="text-xs uppercase tracking-wide text-amber-700">Recomendación</p>
                            <p className="mt-1 text-sm font-semibold text-slate-900">Auditar cambios críticos</p>
                        </article>
                    </div>
                </div>
            </section>
        );
    }

    if (!isInstitution) {
        return (
            <section className="p-4 md:p-6">
                <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-700">
                    No tienes permisos para gestionar instituciones.
                </div>
            </section>
        );
    }

    return (
        <section className="p-4 md:p-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h1 className="text-2xl font-black text-slate-900">Mi institución</h1>
                <p className="mt-2 text-sm text-slate-600">
                    Puedes actualizar únicamente la información de tu institución.
                </p>

                {loading ? (
                    <p className="mt-4 text-sm text-slate-500">Cargando datos...</p>
                ) : (
                    <form className="mt-5 grid gap-4 md:grid-cols-2" onSubmit={handleSave}>
                        {institutionFormFields.map((field) => (
                            <label className="text-sm font-medium text-slate-700" key={field.key}>
                                {field.label}
                                <input
                                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue_primary focus:outline-none"
                                    disabled={field.key === "codigoInstitucion"}
                                    name={field.key}
                                    onChange={(e) => {
                                        const { name, value } = e.target;
                                        setFormData((prev) => ({ ...prev, [name]: value }));
                                    }}
                                    type="text"
                                    value={formData[field.key] ?? ""}
                                />
                            </label>
                        ))}

                        <div className="md:col-span-2 flex items-center gap-3">
                            <button
                                className="rounded-lg bg-blue_primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue_dark disabled:opacity-60"
                                disabled={saving}
                                type="submit"
                            >
                                {saving ? "Guardando..." : "Guardar cambios"}
                            </button>
                            {myInstitution?._id && <span className="text-xs text-slate-500">ID: {myInstitution._id}</span>}
                        </div>
                    </form>
                )}

                {statusMessage && (
                    <p className="mt-4 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700">{statusMessage}</p>
                )}
            </div>
        </section>
    );
}