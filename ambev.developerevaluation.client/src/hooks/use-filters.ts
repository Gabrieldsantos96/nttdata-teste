import {
  getRouteApi,
  RegisteredRouter,
  RouteIds,
  SearchParamOptions,
} from "@tanstack/react-router";

const DEFAULT_PAGE_INDEX = 0;
const DEFAULT_PAGE_SIZE = 10;

export const cleanEmptyParams = <T extends Record<string, unknown>>(
  search: T
) => {
  const newSearch = { ...search };
  Object.keys(newSearch).forEach((key) => {
    const value = newSearch[key];
    if (
      value === undefined ||
      value === "" ||
      (typeof value === "number" && isNaN(value))
    )
      delete newSearch[key];
  });

  if (search.pageIndex === DEFAULT_PAGE_INDEX) delete newSearch.pageIndex;
  if (search.pageSize === DEFAULT_PAGE_SIZE) delete newSearch.pageSize;

  return newSearch;
};

export function useFilters<
  TId extends RouteIds<RegisteredRouter["routeTree"]>,
  TSearchParams extends SearchParamOptions<
    RegisteredRouter,
    TId,
    TId
  >["search"],
>(routeId: TId) {
  const routeApi = getRouteApi<TId>(routeId);
  const navigate = routeApi.useNavigate();
  const filters = routeApi.useSearch();

  const setFilters = (partialFilters: Partial<TSearchParams>) =>
    navigate({
      search: cleanEmptyParams({
        ...filters,
        ...partialFilters,
      }) as TSearchParams,
    });

  const resetFilters = () => navigate({ search: {} as TSearchParams });

  return { filters, setFilters, resetFilters };
}
