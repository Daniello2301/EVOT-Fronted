import DiplomaFormModal from './DiplomaFormModal';

export default function UpdateDiplomaModal({ open, diploma, onClose, onSaved }) {
  return <DiplomaFormModal open={open} onClose={onClose} onSaved={onSaved} mode="edit" diploma={diploma} />;
}
