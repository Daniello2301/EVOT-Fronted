import DiplomaFormModal from './DiplomaFormModal';

export default function CreateDiplomaModal({ open, onClose, onSaved }) {
  return <DiplomaFormModal open={open} onClose={onClose} onSaved={onSaved} mode="create" />;
}
