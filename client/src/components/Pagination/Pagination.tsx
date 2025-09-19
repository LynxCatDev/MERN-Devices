'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import './Pagination.scss';

interface IPagination {
  totalPages?: number;
  currentPage: number;
  maxVisiblePages?: number;
}
export const Pagination = ({
  totalPages,
  currentPage,
  maxVisiblePages = 3,
}: IPagination) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const q = searchParams.get('q');

  const getQuery = (page: number) => ({
    q,
    page,
  });
  const renderPageLink = (pageNumber: number) => (
    <Link
      href={{ pathname, query: getQuery(pageNumber) }}
      className={currentPage === pageNumber ? 'active' : ''}
      aria-label={`Go to page ${pageNumber}`}
      aria-current={currentPage === pageNumber ? 'page' : undefined}
      key={pageNumber}
    >
      {pageNumber}
    </Link>
  );

  const renderPageLinks = () => {
    const pageLinks = [];

    if (totalPages <= 1) {
      return null;
    }

    const startPage = Math.max(
      1,
      currentPage - Math.floor(maxVisiblePages / 2),
    );
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (startPage > 1) {
      pageLinks.push(renderPageLink(1));
      if (startPage > 2) {
        pageLinks.push(
          <span className="ellipsis" key="start-ellipsis">
            ...
          </span>,
        );
      }
    }

    // eslint-disable-next-line no-plusplus
    for (let i = startPage; i <= endPage; i++) {
      pageLinks.push(renderPageLink(i));
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageLinks.push(
          <span className="ellipsis" key="end-ellipsis">
            ...
          </span>,
        );
      }
      pageLinks.push(renderPageLink(totalPages));
    }

    return pageLinks;
  };
  return (
    <div className="pagination">
      {currentPage > 1 && (
        <Link
          href={{ pathname, query: getQuery(currentPage - 1) }}
          className="controls"
          aria-label="Go to previous page"
        >
          Prev
        </Link>
      )}

      {renderPageLinks()}

      {currentPage < totalPages && (
        <Link
          href={{ pathname, query: getQuery(currentPage + 1) }}
          className="controls"
          aria-label="Go to next page"
        >
          Next
        </Link>
      )}
    </div>
  );
};
