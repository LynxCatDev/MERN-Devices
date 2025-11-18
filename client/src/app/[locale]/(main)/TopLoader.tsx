'use client';

import { useEffect, useState } from 'react';
import NextTopLoader from 'nextjs-toploader';

export const TopLoader = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <NextTopLoader showSpinner={false} height={4} />;
};
