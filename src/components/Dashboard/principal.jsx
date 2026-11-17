import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageMeta from '../common/PageMeta';
import Notice from '../common/Notice';
import { btnNeutral, btnPrimary, btnSecondary } from '../common/ui';
import { useAuth } from '../../context/AuthContext';
import { getAllInstituciones } from '../../services/institucions.service';
import { getAllUsuarios } from '../../services/usuarios.service';
import { getAllGraduados } from '../../services/graduado.service';
import { getDiplomasByInstitution } from '../../services/diplomas.service';
import { getSolicitudesDocumento, getSolicitudesEdicion } from '../../services/solicitudes.service';
import { extractPage } from '../../helpers/apiResponse.js';
import { ROLES, rolLabel } from '../../helpers/estados.js';
import { formatDateTime, formatNumber } from '../../helpers/formatters.js';
import { dashboardPath } from '../../helpers/dashboardNav.js';
import { greeting, pendingQueueForRole, statValue, statsForRole } from '../../helpers/dashboardStats.js';

const SOURCES = {
  instituciones: getAllInstituciones,
  usuarios: getAllUsuarios,
  graduados: getAllGraduados,
  diplomasInstitucion: getDiplomasByInstitution,
  solicitudesEdicion: getSolicitudesEdicion,
  solicitudesDocumento: getSolicitudesDocumento
};

const QUICK_ACTIONS = {
  [ROLES.ADMIN]: [
    { label: 'Crear usuario', to: dashboardPath('users'), primary: true },
    { label: 'Revisar instituciones', to: dashboardPath('institutions') },
    { label: 'Ver diplomas', to: dashboardPath('diplomas') }
  ],
  [ROLES.INSTITUCION]: [
    { label: 'Registrar diploma', to: dashboardPath('diplomas'), primary: true },
    { label: 'Registrar graduado', to: dashboardPath('graduados') },
    { label: 'Mi institución', to: dashboardPath('my-institution') }
  ]
};

function StatCard({ stat, value, loading }) {
  const highlight = stat.attention && value > 0;
  return (
    <Link
      to={stat.href}
      className={`evot-surface-card block p-5 ${highlight ? 'ring-2 ring-amber-400' : ''}`}
      aria-label={`${stat.label}: ${loading ? 'cargando' : value ?? 'no disponible'}`}
    >
      <p className="text-sm font-medium text-slate-600">{stat.label}</p>
      {loading ? (
        <div aria-hidden="true" className="mt-3 h-9 w-20 animate-pulse rounded bg-gray-200" />
      ) : (
        <p className="mt-2 font-display text-3xl font-bold tabular-nums text-black_primary">{value === null ? '—' : formatNumber(value)}</p>
      )}
      <p className={`mt-2 text-xs font-semibold ${highlight ? 'text-amber-800' : 'text-blue_primary'}`}>
        {highlight ? 'Requiere tu revisión →' : 'Ver detalle →'}
      </p>
    </Link>
  );
}

/** Inicio del panel: indicadores reales, pendientes y accesos rápidos por rol. */
export default function PrincipalDashboard() {
  const { authUser } = useAuth();
  const rol = authUser?.rol;
  const stats = statsForRole(rol);
  const queue = pendingQueueForRole(rol);
  const [values, setValues] = useState({});
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [partialError, setPartialError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setPartialError(false);
    const requests = stats.map((stat) => SOURCES[stat.source](stat.params));
    const queueRequest = queue ? SOURCES[queue.source](queue.params) : Promise.resolve(null);
    const [queueResult, ...results] = await Promise.allSettled([queueRequest, ...requests]);
    const nextValues = {};
    stats.forEach((stat, index) => { nextValues[stat.key] = statValue(results[index]); });
    setValues(nextValues);
    setPending(queueResult.status === 'fulfilled' && queueResult.value ? extractPage(queueResult.value).results : []);
    setPartialError(Object.values(nextValues).some((value) => value === null) || (queueResult.status === 'rejected' && queueResult.reason?.response?.status !== 404));
    setLoading(false);
  // stats/queue dependen solo del rol.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rol]);

  useEffect(() => { load(); }, [load]);

  const nombre = authUser?.nombreUsuario || authUser?.correo || '';
  const isAdmin = rol === ROLES.ADMIN;

  return (
    <section className="mx-auto w-full max-w-screen-xl space-y-6">
      <PageMeta title="Inicio | EVOT" description="Resumen de la actividad en EVOT." />

      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue_primary">{rolLabel(rol)}</p>
          <h1 className="font-display text-2xl font-bold text-black_primary sm:text-3xl">{greeting()}{nombre ? `, ${nombre}` : ''}</h1>
          <p className="mt-1 text-sm text-slate-600 sm:text-base">
            {isAdmin ? 'Así va EVOT hoy.' : 'Así va tu institución en EVOT hoy.'}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-3 sm:flex">
          {(QUICK_ACTIONS[rol] ?? []).map((action) => (
            <Link key={action.label} to={action.to} className={action.primary ? btnPrimary : btnSecondary}>{action.label}</Link>
          ))}
        </div>
      </header>

      {partialError && !loading && (
        <Notice tone="warning" action={<button type="button" className={btnNeutral} onClick={load}>Reintentar</button>}>
          Algunos datos no se pudieron cargar. Los valores con “—” no están disponibles en este momento.
        </Notice>
      )}

      <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => <StatCard key={stat.key} stat={stat} value={values[stat.key] ?? null} loading={loading} />)}
      </div>

      {queue && (
        <section aria-labelledby="pendientes-title" className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-evot-card">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 px-4 py-3 sm:px-5">
            <h2 id="pendientes-title" className="font-display text-lg font-semibold text-black_primary">{queue.title}</h2>
            <Link to={queue.href} className="inline-flex min-h-[44px] items-center text-sm font-semibold text-blue_primary hover:underline">Ver todas</Link>
          </div>
          {loading ? (
            <div aria-hidden="true" className="space-y-3 p-5">
              {[0, 1, 2].map((row) => <div key={row} className="h-10 animate-pulse rounded bg-gray-100" />)}
            </div>
          ) : pending.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-slate-600">No tienes nada pendiente por revisar.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {pending.map((item) => (
                <li key={item._id} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {isAdmin ? (item.diploma?.codigoDiploma ?? 'Diploma') : `${item.nombres ?? ''} ${item.apellidos ?? ''}`.trim()}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {isAdmin
                        ? `${item.solicitadoPor?.nombreUsuario ?? 'Institución'} · ${item.motivoSolicitud ?? ''}`
                        : `Diploma ${item.diploma?.codigoDiploma ?? '—'} · ${item.correoSolicitante ?? ''}`}
                    </p>
                  </div>
                  <p className="shrink-0 text-xs text-gray-500">{formatDateTime(item.createdAt)}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </section>
  );
}
