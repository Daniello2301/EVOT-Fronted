import { diplomaId } from '../helpers/diplomaModel.js';

function safeDate(value) {
  if (!value) return '—';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? '—' : parsed.toLocaleDateString('es-CO', {timeZone:'UTC'});
}

export default function AdminDiplomasTable({ diplomas, onEdit, onPreview, onDeactivate, busy, canDeactivate = false }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[880px] text-left text-sm text-gray-700">
        <thead className="bg-gray-50 text-xs uppercase text-gray-600">
          <tr>
            <th scope="col" className="px-4 py-3">Código</th>
            <th scope="col" className="px-4 py-3">Fecha de grado</th>
            <th scope="col" className="px-4 py-3">Documento</th>
            <th scope="col" className="px-4 py-3">Graduado</th>
            <th scope="col" className="px-4 py-3">Institución</th>
            <th scope="col" className="px-4 py-3">Programa</th>
            <th scope="col" className="px-4 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {diplomas.map((diploma) => (
            <tr key={diplomaId(diploma) || diploma.codigoDiploma} className="border-t border-gray-100">
              <td className="px-4 py-3 font-medium text-gray-900">{diploma.codigoDiploma || '—'}</td>
              <td className="px-4 py-3">{safeDate(diploma.fechaGrados)}</td>
              <td className="px-4 py-3">{diploma.graduado?.numeroDocumento || '—'}</td>
              <td className="px-4 py-3">{[diploma.graduado?.nombres, diploma.graduado?.apellidos].filter(Boolean).join(' ') || '—'}</td>
              <td className="px-4 py-3">{diploma.institucion?.nombreInstitucion || '—'}</td>
              <td className="px-4 py-3">{diploma.nombrePrograma || '—'}</td>
              <td className="px-4 py-3">
                <div className="flex gap-3 whitespace-nowrap">
                  <button type="button" disabled={busy} onClick={() => onPreview(diploma)} className="font-medium text-blue-700 hover:underline disabled:opacity-50">Ver</button>
                  <button type="button" disabled={busy || !diplomaId(diploma)} onClick={() => onEdit(diploma)} className="font-medium text-blue-700 hover:underline disabled:opacity-50">Editar</button>
                  {canDeactivate && <button type="button" disabled={busy || !diplomaId(diploma)} onClick={() => onDeactivate(diploma)} className="font-medium text-red-700 hover:underline disabled:opacity-50">Desactivar</button>}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
