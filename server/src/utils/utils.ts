export const getPageNumber = (page?: string | number): number => {
  const normalizedPage = Number(page);

  if (!Number.isFinite(normalizedPage) || normalizedPage < 1) {
    return 1;
  }

  return Math.floor(normalizedPage);
};

export const getTotalPages = (itemNumber: number, limit: number = 1): number => {
  const safeLimit = Math.max(1, Number(limit) || 1);
  return Math.ceil(itemNumber / safeLimit);
};

export const getNextPage = (
  page: number,
  totalItems?: number,
  limit: number = 1,
) => (totalItems && getTotalPages(totalItems, limit) <= page ? null : page + 1);

export const getPrevPage = (page: number) => (page > 1 ? page - 1 : null);

export const paginate = <T>(
  array: T[],
  pageSize: number,
  pageNumber: number,
): T[] => {
  const safePageNumber = getPageNumber(pageNumber);
  const safePageSize = Math.max(1, Number(pageSize) || 1);

  return array.slice(
    (safePageNumber - 1) * safePageSize,
    safePageNumber * safePageSize,
  );
};
