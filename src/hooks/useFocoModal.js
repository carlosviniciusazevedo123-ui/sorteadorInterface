import { useEffect, useRef } from 'react';

export function useFocoModal(aberto, onFechar, podeFechar = true) {
  const refModal = useRef(null);
  const fechamento = useRef({ onFechar, podeFechar });
  useEffect(() => {
    fechamento.current = { onFechar, podeFechar };
  }, [onFechar, podeFechar]);

  useEffect(() => {
    if (!aberto || !refModal.current) return;
    const modal = refModal.current;
    const focoAnterior = document.activeElement;
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const elementosFocaveis = () =>
      Array.from(
        modal.querySelectorAll(
          'button, a[href], input, select, textarea, [tabindex]'
        )
      ).filter(
        (elemento) =>
          !elemento.disabled && elemento.tabIndex >= 0 && !elemento.hidden
      );
    const focarPrimeiro = () => (elementosFocaveis()[0] || modal).focus();
    focarPrimeiro();

    const aoPressionar = (event) => {
      if (event.key === 'Escape' && fechamento.current.podeFechar) {
        event.preventDefault();
        fechamento.current.onFechar();
      }
      if (event.key !== 'Tab') return;
      const elementos = elementosFocaveis();
      const primeiro = elementos[0];
      const ultimo = elementos[elementos.length - 1];
      if (!primeiro) {
        event.preventDefault();
        modal.focus();
      } else if (
        event.shiftKey &&
        (document.activeElement === primeiro ||
          document.activeElement === modal)
      ) {
        event.preventDefault();
        ultimo.focus();
      } else if (!event.shiftKey && document.activeElement === ultimo) {
        event.preventDefault();
        primeiro.focus();
      }
    };
    const aoFocar = (event) => {
      if (!modal.contains(event.target)) focarPrimeiro();
    };
    document.addEventListener('keydown', aoPressionar);
    document.addEventListener('focusin', aoFocar);
    return () => {
      document.removeEventListener('keydown', aoPressionar);
      document.removeEventListener('focusin', aoFocar);
      document.body.style.overflow = overflowAnterior;
      if (focoAnterior?.isConnected) focoAnterior.focus();
    };
  }, [aberto]);
  return refModal;
}
