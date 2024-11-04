import * as React from 'react';

import Seo from '@/components/Seo';

export const metadata = {
  title: 'AeFinder',
  description:
    'AeFinder is a powerful decentralised protocol used for indexing and querying the data of the blockchain',
};

export default function HomePage() {
  return <Seo templateTitle='AeFinder' />;
}
