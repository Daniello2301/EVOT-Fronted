import FormField from '../common/FormField';
import { inputClass } from '../common/ui';
import { localInputDate } from '../../helpers/formatters.js';

/** Campos del formulario de institución, compartidos por alta, edición ADMIN y "Mi institución". */
export default function InstitucionFields({ form, errors = {}, onChange, codeEditable = true, idPrefix = 'institucion', disabled = false }) {
  const field = (name) => `${idPrefix}-${name}`;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <FormField
        id={field('codigoInstitucion')}
        label="Código de la institución"
        required={codeEditable}
        error={errors.codigoInstitucion}
        hint={codeEditable ? 'Código numérico asignado por la autoridad educativa.' : 'Solo un administrador puede cambiar el código.'}
      >
        <input name="codigoInstitucion" inputMode="numeric" autoComplete="off" className={inputClass} value={form.codigoInstitucion} onChange={onChange} disabled={disabled || !codeEditable} readOnly={!codeEditable} />
      </FormField>
      <FormField id={field('nombreInstitucion')} label="Nombre de la institución" required error={errors.nombreInstitucion}>
        <input name="nombreInstitucion" autoComplete="organization" className={inputClass} value={form.nombreInstitucion} onChange={onChange} disabled={disabled} />
      </FormField>
      <FormField id={field('ciudad')} label="Ciudad" required error={errors.ciudad}>
        <input name="ciudad" autoComplete="address-level2" className={inputClass} value={form.ciudad} onChange={onChange} disabled={disabled} />
      </FormField>
      <FormField id={field('departamento')} label="Departamento" required error={errors.departamento}>
        <input name="departamento" autoComplete="address-level1" className={inputClass} value={form.departamento} onChange={onChange} disabled={disabled} />
      </FormField>
      <FormField id={field('resolucion')} label="Resolución de aprobación" required error={errors.resolucion} hint="Número del acto administrativo que autoriza a la institución.">
        <input name="resolucion" autoComplete="off" className={inputClass} value={form.resolucion} onChange={onChange} disabled={disabled} />
      </FormField>
      <FormField id={field('fechaResolucion')} label="Fecha de la resolución" required error={errors.fechaResolucion}>
        <input name="fechaResolucion" type="date" max={localInputDate(0)} className={inputClass} value={form.fechaResolucion} onChange={onChange} disabled={disabled} />
      </FormField>
    </div>
  );
}
