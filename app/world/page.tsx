'use client';

import dynamic from 'next/dynamic';

// Three.js is browser-only — load the world client-side with no SSR.
const World = dynamic(() => import('@/components/world/World'), { ssr: false });

export default function WorldPage() {
  return <World />;
}
