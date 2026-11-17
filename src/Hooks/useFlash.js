import { useCallback, useEffect, useState } from 'react';

/** Mensaje de confirmación breve que se oculta solo (5 s) o al cerrarlo. */
export default function useFlash(timeout = 5000) {
  const [message, setMessage] = useState('');
  useEffect(() => {
    if (!message) return undefined;
    const id = setTimeout(() => setMessage(''), timeout);
    return () => clearTimeout(id);
  }, [message, timeout]);
  const clear = useCallback(() => setMessage(''), []);
  return [message, setMessage, clear];
}
