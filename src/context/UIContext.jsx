import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import TransactionModal from '../components/TransactionModal';

const UIContext = createContext(null);

/** Lets any page (and the app shell's + button) open the add/edit transaction dialog. */
export const UIProvider = ({ children }) => {
  const [modal, setModal] = useState({ open: false, transaction: undefined });

  const openTransactionModal = useCallback((transaction) => setModal({ open: true, transaction }), []);
  const closeTransactionModal = useCallback(() => setModal((m) => ({ ...m, open: false })), []);

  const value = useMemo(() => ({ openTransactionModal }), [openTransactionModal]);

  return (
    <UIContext.Provider value={value}>
      {children}
      <TransactionModal open={modal.open} transaction={modal.transaction} onClose={closeTransactionModal} />
    </UIContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUI = () => useContext(UIContext);
