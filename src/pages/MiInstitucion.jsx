import { useCallback, useEffect, useState } from 'react';
import PageShell from '../components/common/PageShell';
import Notice from '../components/common/Notice';
import StatusBadge from '../components/common/StatusBadge';
import InstitucionFields from '../components/instituciones/InstitucionFields';
import { btnNeutral, btnPrimary } from '../components/common/ui';
import { useAuth } from '../context/AuthContext';
import useFlash from '../Hooks/useFlash';
import { createInstitucion, getMyInstitucion, updateMyInstitucion } from '../services/institucions.service';
import { apiErrorMessage, isNotFound } from '../helpers/apiResponse.js';
import { describeActivo } from '../helpers/estados.js';
import {
  EMPTY_INSTITUCION, INSTITUCION_MODES, extractInstitucion, institucionToForm, validateInstitucion
} from '../helpers/institucionModel.js';

/**
 * "Mi institución" (rol INSTITUCION).
 * - Sin institución asociada (404): formulario de alta. El backend devuelve
 *   tokens nuevos, pero su refresh token no queda guardado en el servidor;
 *   por eso se renueva la sesión con el refresh token vigente, que genera un
 *   access token desde el usuario ya asociado a la institución.
 * - Con institución: edición de los datos permitidos (el código es de solo lectura).
 */
export default function MiInstitucion() {
  const { refreshSession } = useAuth();
  const [institucion, setInstitucion] = useState(null);
  const [missing, setMissing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [form, setForm] = useState(EMPTY_INSTITUCION);
  const [errors, setErrors] = useState({});
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);
  const [flash, setFlash, clearFlash] = useFlash(7000);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const data = extractInstitucion(await getMyInstitucion());
      setInstitucion(data);
      setMissing(false);
      setForm(institucionToForm(data));
    } catch (err) {
      if (isNotFound(err)) {
        setMissing(true);
        setInstitucion(null);
        setForm({ ...EMPTY_INSTITUCION });
      } else {
        setLoadError(apiErrorMessage(err, 'No se pudo cargar la información de tu institución.'));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const mode = missing ? INSTITUCION_MODES.CREATE : INSTITUCION_MODES.ME;
  const onChange = (event) => setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    if (saving) return;
    const { errors: nextErrors, payload } = validateInstitucion(form, mode);
    setErrors(nextErrors);
    setSaveError('');
    if (!payload) {
      document.getElementById(`mi-inst-${Object.keys(nextErrors)[0]}`)?.focus();
      return;
    }
    setSaving(true);
    try {
      if (missing) {
        const created = extractInstitucion(await createInstitucion(payload));
        const renewed = await refreshSession();
        setInstitucion(created);
        setMissing(false);
        setForm(institucionToForm(created));
        setFlash(renewed
          ? 'Tu institución quedó registrada. Ya puedes registrar graduados y diplomas.'
          : 'Tu institución quedó registrada. Cierra sesión e ingresa de nuevo para habilitar el resto del panel.');
      } else {
        const updated = extractInstitucion(await updateMyInstitucion(payload));
        setInstitucion(updated);
        setForm(institucionToForm(updated));
        setFlash('Los cambios se guardaron correctamente.');
      }
    } catch (err) {
      setSaveError(apiErrorMessage(err, missing ? 'No se pudo registrar la institución.' : 'No se pudieron guardar los cambios.'));
    } finally {
      setSaving(false);
    }
  };

  const reset = () => { setForm(institucionToForm(institucion)); setErrors({}); setSaveError(''); };

  return (
    <PageShell
      title={missing ? 'Registra tu institución' : 'Mi institución'}
      description={missing
        ? 'Antes de emitir diplomas, completa los datos oficiales de tu institución. Solo se hace una vez.'
        : 'Datos oficiales con los que tu institución aparece en las verificaciones públicas.'}
      notices={flash && <Notice tone="success" onClose={clearFlash}>{flash}</Notice>}
    >
      <div className="p-4 sm:p-6">
        {loading && (
          <div role="status" className="space-y-4" aria-live="polite">
            <span className="sr-only">Cargando…</span>
            {[0, 1, 2].map((row) => <div key={row} className="h-11 animate-pulse rounded-lg bg-gray-200" />)}
          </div>
        )}

        {!loading && loadError && (
          <Notice tone="error" action={<button type="button" className={btnNeutral} onClick={load}>Reintentar</button>}>{loadError}</Notice>
        )}

        {!loading && !loadError && (
          <form onSubmit={submit} noValidate className="space-y-6">
            {missing && (
              <Notice tone="info" title="Tu cuenta aún no tiene una institución asociada">
                Mientras no la registres, no podrás gestionar graduados, diplomas ni solicitudes.
              </Notice>
            )}
            {!missing && institucion && (
              <div className="flex flex-wrap items-center gap-3 rounded-lg bg-gray-50 px-4 py-3">
                <span className="text-sm text-gray-600">Estado en EVOT:</span>
                <StatusBadge {...describeActivo(institucion.estado)} />
                {institucion.estado === false && (
                  <span className="text-sm text-gray-600">Un administrador desactivó la institución; no aparece en el listado público.</span>
                )}
              </div>
            )}
            {saveError && <Notice tone="error">{saveError}</Notice>}
            <InstitucionFields form={form} errors={errors} onChange={onChange} codeEditable={missing} idPrefix="mi-inst" disabled={saving} />
            <div className="flex flex-col-reverse gap-2 border-t border-gray-200 pt-4 sm:flex-row sm:justify-end">
              {!missing && <button type="button" className={btnNeutral} onClick={reset} disabled={saving}>Descartar cambios</button>}
              <button type="submit" className={btnPrimary} disabled={saving} aria-busy={saving}>
                {saving ? 'Guardando...' : missing ? 'Registrar institución' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        )}
      </div>
    </PageShell>
  );
}
