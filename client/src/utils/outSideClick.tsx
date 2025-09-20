import { useEffect } from 'react';

export const useOutsideClick = (
  ref: React.RefObject<HTMLInputElement>,
  callback: () => void,
) => {
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      const target = event.target as HTMLInputElement;
      if (ref.current && !ref.current.contains(target)) {
        callback();
      }
    }

    document.addEventListener('click', handleOutsideClick, { passive: true });
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [ref]);
};
