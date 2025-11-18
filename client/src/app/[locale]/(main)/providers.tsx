'use client';

import { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { CacheProvider as EmotionCacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react';

const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        bg: { value: '#121212' },
        text: { value: 'white' },
      },
    },
  },
});

function EmotionRegistry({ children }: { children: React.ReactNode }) {
  const [cache] = useState(() => {
    const emotionCache = createCache({ key: 'chakra', prepend: true });
    emotionCache.compat = true;
    return emotionCache;
  });

  useServerInsertedHTML(() => {
    const entries = Object.entries(cache.inserted);

    if (entries.length === 0) {
      return null;
    }

    cache.inserted = {};

    return (
      <style
        data-emotion={`${cache.key} ${entries.map(([key]) => key).join(' ')}`}
        dangerouslySetInnerHTML={{
          __html: entries.map(([, value]) => value).join(''),
        }}
      />
    );
  });

  return <EmotionCacheProvider value={cache}>{children}</EmotionCacheProvider>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <EmotionRegistry>
      <ChakraProvider value={system}>{children}</ChakraProvider>
    </EmotionRegistry>
  );
}
