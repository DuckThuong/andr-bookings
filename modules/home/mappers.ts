import type {
  HomeOperator,
  HomePromo,
  HomeService,
  HomeTrip,
  MasterItem,
} from "@/modules/home/types";

function sortItems(items: MasterItem[]) {
  return [...items].sort((left, right) => left.sort - right.sort);
}

function parseRule<T>(items: MasterItem[]): T[] {
  return sortItems(items).flatMap((item) => {
    try {
      const parsed = JSON.parse(item.rule) as T & { id?: string };
      return [
        {
          ...parsed,
          id: `${item.type}:${item.code || parsed.id || item.id}:${item.id}`,
        },
      ];
    } catch {
      return [];
    }
  });
}

export const mapServicesFromMaster = (items: MasterItem[]): HomeService[] =>
  parseRule<HomeService>(items);

export const mapPromosFromMaster = (items: MasterItem[]): HomePromo[] =>
  parseRule<HomePromo>(items);

export const mapOperatorsFromMaster = (items: MasterItem[]): HomeOperator[] =>
  parseRule<HomeOperator>(items);

export const mapTripsFromMaster = (items: MasterItem[]): HomeTrip[] =>
  parseRule<HomeTrip>(items);
