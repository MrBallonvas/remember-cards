import { QuerySession } from "ydb-sdk";
import { Heap } from "./data-helpers";
import { HeapData } from "./types";
import DBClient from "./index";

export async function get(heap_id: string) {
  const result = (await DBClient.getInstance()).driver?.queryClient.do({
    fn: async (session: QuerySession) => {
      const heap = new Heap({ heap_id });
      const { resultSets } = await session.execute({
        parameters: {
          $heap_id: heap.getTypedValue("heap_id"),
        },
        text: `
					DECLARE $heap_id AS Utf8;

					SELECT *
					FROM heaps
					WHERE heap_id = $heap_id
				`,
      });
      const { value: resultSet } = await resultSets.next();
      const { value: row } = await resultSet.rows.next();
      return row[0];
    },
  });
  return result;
}
export async function getAll() {
  const result = (await DBClient.getInstance()).driver?.queryClient.do({
    fn: async (session: QuerySession) => {
      const { resultSets } = await session.execute({
        text: `
					SELECT *
					FROM heaps
				`,
      });
      const { value: resultSet } = await resultSets.next();
      const { value: row } = await resultSet.rows.next();
      return row;
    },
  });
  return result;
}
export async function del(heap_id: string) {
  (await DBClient.getInstance()).driver?.queryClient.do({
    fn: async (session: QuerySession) => {
      const heap = new Heap({ heap_id });
      await session.execute({
        parameters: {
          $heap_id: heap.getTypedValue("heap_id"),
        },
        text: `
					DECLARE $heap_id AS Utf8;

					DELETE
					FROM heaps
					WHERE heap_id = $heap_id
				`,
      });
    },
  });
}
export async function change(heap_id: string, data: HeapData) {
  (await DBClient.getInstance()).driver?.queryClient.do({
    fn: async (session: QuerySession) => {
      const heap = new Heap({ ...data, heap_id });
      await session.execute({
        parameters: {
          $heap_id: heap.getTypedValue("heap_id"),
          $heap_title: heap.getTypedValue("heap_title"),
          $heap_description: heap.getTypedValue("heap_description"),
        },
        text: `
					DECLARE $heap_id AS Utf8;
					DECLARE $heap_title AS Utf8;
					DECLARE $heap_description AS Utf8;

					UPDATE cards
					SET heap_description=$heap_description
						AND heap_title=$heap_title
					WHERE heap_id=$heap_id
				`,
      });
    },
  });
}
export async function create(data: HeapData) {
  const result = (await DBClient.getInstance()).driver?.queryClient.do({
    fn: async (session: QuerySession) => {
      const heap = new Heap({ ...data });
      const { resultSets } = await session.execute({
        parameters: {
          $heap_id: heap.getTypedValue("heap_id"),
          $heap_title: heap.getTypedValue("heap_title"),
          $heap_description: heap.getTypedValue("heap_description"),
        },
        text: `
					DECLARE $heap_id AS Utf8;
					DECLARE $heap_title AS Utf8;
					DECLARE $heap_description AS Utf8;

					UPSERT INTO heaps
					(
						heap_id, heap_title, heap_description
					)
					VALUES
					(
						$heap_id, $heap_title, $heap_description
					)
				`,
      });
      const { value: resultSet } = await resultSets.next();
      const { value: row } = await resultSet.rows.next();
      return row;
    },
  });
  return result;
}
