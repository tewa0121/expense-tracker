import Modal from './Modal';

const ConfirmDialog = ({ open, title, message, confirmLabel = 'Delete', onConfirm, onCancel }) => (
  <Modal open={open} onClose={onCancel} title={title} size="sm">
    <p className="text-sm text-muted">{message}</p>
    <div className="mt-6 flex gap-3">
      <button type="button" className="btn-secondary flex-1" onClick={onCancel}>Cancel</button>
      <button
        type="button"
        data-autofocus
        className="btn flex-1 bg-loss text-white hover:brightness-95 dark:text-bg"
        onClick={onConfirm}
      >
        {confirmLabel}
      </button>
    </div>
  </Modal>
);

export default ConfirmDialog;
