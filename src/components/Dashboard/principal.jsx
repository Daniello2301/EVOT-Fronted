import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const monthlyRequests = [
	{ month: "Ene", value: 64 },
	{ month: "Feb", value: 92 },
	{ month: "Mar", value: 108 },
	{ month: "Abr", value: 86 },
	{ month: "May", value: 124 },
	{ month: "Jun", value: 97 }
];

const approvalByType = [
	{ name: "Diplomas", value: 58, color: "#0ea5e9" },
	{ name: "Certificados", value: 27, color: "#0284c7" },
	{ name: "Constancias", value: 15, color: "#38bdf8" }
];

const quickActionsByRole = {
	ADMIN: [
		{ title: "Gestionar usuarios", detail: "Crear, activar y desactivar usuarios", to: "students" },
		{ title: "Gestionar instituciones", detail: "Administrar instituciones del sistema", to: "institutions" },
		{ title: "Gestionar diplomas", detail: "Editar y validar diplomas globales", to: "diplomas" },
		{ title: "Descargar reporte", detail: "Exportar resumen mensual", to: "diplomas" }
	],
	INSTITUCION: [
		{ title: "Mi institución", detail: "Actualizar datos de tu institución", to: "my-institution" },
		{ title: "Mis diplomas", detail: "Gestionar diplomas de tu institución", to: "diplomas" },
		{ title: "Revisar solicitudes", detail: "Atender solicitudes asociadas", to: "diplomas" }
	]
};

const maxRequests = Math.max(...monthlyRequests.map((item) => item.value));

export default function PrincipalDashboard() {
	const { authUser } = useAuth();
	const role = authUser?.rol;
	const isAdmin = role === "ADMIN";
	const isInstitution = role === "INSTITUCION";
	const quickActions = quickActionsByRole[role] ?? [];

	const donutStops = [
		`#0ea5e9 0% ${approvalByType[0].value}%`,
		`#0284c7 ${approvalByType[0].value}% ${approvalByType[0].value + approvalByType[1].value}%`,
		`#38bdf8 ${approvalByType[0].value + approvalByType[1].value}% 100%`
	].join(", ");

	return (
		<section className="min-h-screen bg-slate-50 p-3 md:p-6">
			<div className="mx-auto w-full max-w-7xl space-y-6">
				<header className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br bg-blue_primary  p-6 text-white shadow-xl">
					
					<p className="text-xs uppercase tracking-[0.22em] text-cyan-100">Centro de Gestión</p>
					<h1 className="mt-2 text-2xl font-black md:text-4xl">Panel de administración general</h1>
					<p className="mt-2 max-w-2xl text-sm text-blue-50 md:text-base">
						{isAdmin
							? "Controla usuarios, instituciones y diplomas desde un panel centralizado."
							: "Gestiona tu institución y administra únicamente los diplomas de tu entidad."}
					</p>
					<div className="mt-4 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide text-cyan-50">
						Rol activo: {role ?? "SIN ROL"}
					</div>
				</header>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
					<article className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
						<p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Graduados</p>
						<p className="mt-2 text-3xl font-extrabold text-slate-900">126</p>
						<p className="mt-1 text-xs text-emerald-600">+12% vs ayer</p>
					</article>

					<article className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
						<p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Instituciones</p>
						<p className="mt-2 text-3xl font-extrabold text-slate-900">97</p>
						<p className="mt-1 text-xs text-emerald-600">77% completado</p>
					</article>

					<article className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
						<p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Diplomas</p>
						<p className="mt-2 text-3xl font-extrabold text-slate-900">29</p>
						<p className="mt-1 text-xs text-amber-600">Requieren revisión</p>
					</article>

					<article className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
						<p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Instituciones activas</p>
						<p className="mt-2 text-3xl font-extrabold text-slate-900">41</p>
						<p className="mt-1 text-xs text-sky-700">Cobertura nacional</p>
					</article>
				</div>

				<div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
					<article className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
						<div className="mb-4 flex items-center justify-between">
							<h2 className="text-lg font-bold text-slate-900">{
                                isAdmin 
                                ? "Registros por mes"
                                : "Solicitudes por mes"

                                }</h2>
							<span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">Últimos 6 meses</span>
						</div>

						<div className="flex h-56 items-end gap-3 border-b border-l border-slate-200 px-3 pb-3 pt-4">
							{monthlyRequests.map((item) => {
								const height = Math.max(16, (item.value / maxRequests) * 180);
								return (
									<div className="flex flex-1 flex-col items-center gap-2" key={item.month}>
										<span className="text-[11px] font-semibold text-slate-500">{item.value}</span>
										<div
											className="w-full rounded-t-lg bg-[#9CD5FF]"
											style={{ height: `${height}px` }}
										/>
										<span className="text-xs font-medium text-slate-600">{item.month}</span>
									</div>
								);
							})}
						</div>
					</article>

					<article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
						<h2 className="text-lg font-bold text-slate-900">Distribución por tipo</h2>
						<div className="mt-4 flex items-center justify-center">
							<div
								className="relative h-40 w-40 rounded-full"
								style={{ background: `conic-gradient(${donutStops})` }}
							>
								<div className="absolute inset-6 grid place-items-center rounded-full bg-white text-center">
									<p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Aprobación</p>
									<p className="text-2xl font-black text-slate-900">91%</p>
								</div>
							</div>
						</div>

						<ul className="mt-5 space-y-2">
							{approvalByType.map((item) => (
								<li className="flex items-center justify-between" key={item.name}>
									<div className="flex items-center gap-2">
										<span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
										<span className="text-sm font-medium text-slate-700">{item.name}</span>
									</div>
									<span className="text-sm font-bold text-slate-900">{item.value}%</span>
								</li>
							))}
						</ul>
					</article>
				</div>

				<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
					<article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
						<div className="mb-4 flex items-center justify-between">
							<h2 className="text-lg font-bold text-slate-900">Gestión operativa</h2>
							<span className="text-xs font-medium text-slate-500">Prioridad del día</span>
						</div>

						<div className="space-y-3">
							<div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
								<p className="text-sm font-semibold text-amber-700">Pendiente crítico</p>
								<p className="mt-1 text-sm text-slate-700">14 solicitudes llevan más de 48 horas sin aprobación.</p>
							</div>
							<div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
								<p className="text-sm font-semibold text-emerald-700">Servicio estable</p>
								<p className="mt-1 text-sm text-slate-700">Tiempo promedio de respuesta: 1.6 segundos.</p>
							</div>
							<div className="rounded-xl border border-sky-200 bg-sky-50 p-3">
								<p className="text-sm font-semibold text-sky-700">Meta semanal</p>
								<p className="mt-1 text-sm text-slate-700">Completar 320 validaciones documentales.</p>
							</div>
						</div>
					</article>

					<article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
						<h2 className="text-lg font-bold text-slate-900">Acciones rápidas</h2>
						<ul className="mt-4 space-y-3">
							{quickActions.map((item) => (
								<li
									className="group flex items-center justify-between rounded-xl border border-slate-200 p-3 transition hover:border-blue-300 hover:bg-blue-50"
									key={item.title}
								>
									<div>
										<p className="text-sm font-semibold text-slate-800">{item.title}</p>
										<p className="text-xs text-slate-500">{item.detail}</p>
									</div>
									<Link
										className="rounded-lg bg-blue_primary px-3 py-1.5 text-xs font-semibold text-white transition group-hover:bg-blue_dark"
										to={item.to}
									>
										Abrir
									</Link>
								</li>
							))}
						</ul>
					</article>
				</div>

				<article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
					<h2 className="text-lg font-bold text-slate-900">Permisos del rol</h2>
					<ul className="mt-4 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
						<li className="rounded-lg border border-slate-200 p-3">
							<span className="font-semibold text-slate-900">Usuarios:</span>{" "}
							{isAdmin ? "Acceso total" : "Sin acceso"}
						</li>
						<li className="rounded-lg border border-slate-200 p-3">
							<span className="font-semibold text-slate-900">Instituciones:</span>{" "}
							{isAdmin ? "Gestión global" : "Solo mi institución"}
						</li>
						<li className="rounded-lg border border-slate-200 p-3">
							<span className="font-semibold text-slate-900">Diplomas:</span>{" "}
							{isAdmin ? "Todos los diplomas" : "Solo diplomas de mi institución"}
						</li>
						<li className="rounded-lg border border-slate-200 p-3">
							<span className="font-semibold text-slate-900">Auditoría:</span>{" "}
							{isAdmin || isInstitution ? "Visible" : "No disponible"}
						</li>
					</ul>
				</article>
			</div>
		</section>
	);
}
