'use client';

import Link from 'next/link';

import './not-found.scss';

const NotFound = () => {
  return (
    <div className="not-found">
      <h1>Not Found</h1>
      <p>Could not find requested resource</p>
      <Link href="/" aria-label="Return to homepage">
        Return Home
      </Link>
    </div>
  );
};

export default NotFound;
