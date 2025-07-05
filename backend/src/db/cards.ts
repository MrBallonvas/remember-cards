import DBClient from "./index";
import { Card } from "./data-helpers";
import { QuerySession } from "ydb-sdk";
import { CardData } from "./types";

export async function get(card_id: string) {
  const result = (await DBClient.getInstance()).driver?.queryClient.do({
    fn: async (session: QuerySession) => {
      const card = new Card({ card_id });
      const { resultSets } = await session.execute({
        parameters: {
          $card_id: card.getTypedValue("card_id"),
        },
        text: `
					DECLARE $card_id AS Utf8;

					SELECT *
					FROM cards
					WHERE card_id = $card_id
				`,
      });
      const { value: resultSet } = await resultSets.next();
      const { value: row } = await resultSet.rows.next();
      return row[0];
    },
  });
  return result;
}
export async function getAll(heap_id: string) {
  const result = (await DBClient.getInstance()).driver?.queryClient.do({
    fn: async (session: QuerySession) => {
      const card = new Card({ card_heap: heap_id });
      const { resultSets } = await session.execute({
        parameters: {
          $heap_id: card.getTypedValue("card_heap"),
        },
        text: `
					DECLARE $heap_id AS Utf8;

					SELECT *
					FROM cards
					WHERE card_heap = $heap_id
				`,
      });
      const { value: resultSet } = await resultSets.next();
      const { value: row } = await resultSet.rows.next();
      return row;
    },
  });
  return result;
}
export async function del(card_id: string) {
  (await DBClient.getInstance()).driver?.queryClient.do({
    fn: async (session: QuerySession) => {
      const card = new Card({ card_id });
      await session.execute({
        parameters: {
          $card_id: card.getTypedValue("card_id"),
        },
        text: `
					DECLARE $card_id AS Utf8;

					DELETE
					FROM cards
					WHERE card_id = $card_id
				`,
      });
    },
  });
}
export async function change(card_id: string, data: CardData) {
  const result = (await DBClient.getInstance()).driver?.queryClient.do({
    fn: async (session: QuerySession) => {
      const card = new Card({ ...data, card_id });
      await session.execute({
        parameters: {
          $card_id: card.getTypedValue("card_id"),
          $card_heap: card.getTypedValue("card_heap"),
          $card_first_side: card.getTypedValue("card_first_side"),
          $card_second_side: card.getTypedValue("card_second_side"),
          $card_type: card.getTypedValue("card_type"),
          $card_status: card.getTypedValue("card_status"),
          $card_updated: card.getTypedValue("card_updated"),
        },
        text: `
					DECLARE $card_id AS Utf8;
					DECLARE $card_heap AS Utf8;
					DECLARE $card_first_side AS Utf8;
					DECLARE $card_second_side AS Utf8;
					DECLARE $card_type AS Utf8;
					DECLARE $card_status AS Utf8;
					DECLARE $card_updated AS Utf8;

					UPDATE cards
					SET card_heap=$card_heap
						AND card_first_side=$card_first_side
						AND card_second_side=$card_second_side
						AND card_type=$card_type
						AND card_status=$card_updated
					WHERE card_id=$card_id
				`,
      });
    },
  });
  return result;
}
export async function create(data: CardData) {
  const result = (await DBClient.getInstance()).driver?.queryClient.do({
    fn: async (session: QuerySession) => {
      const card = new Card({ ...data });
      const { resultSets } = await session.execute({
        parameters: {
          $card_id: card.getTypedValue("card_id"),
          $card_heap: card.getTypedValue("card_heap"),
          $card_first_side: card.getTypedValue("card_first_side"),
          $card_second_side: card.getTypedValue("card_second_side"),
          $card_type: card.getTypedValue("card_type"),
          $card_status: card.getTypedValue("card_status"),
        },
        text: `
					DECLARE $card_id AS Utf8;
					DECLARE $card_heap AS Utf8;
					DECLARE $card_first_side AS Utf8;
					DECLARE $card_second_side AS Utf8;
					DECLARE $card_type AS Utf8;
					DECLARE $card_status AS Utf8;
					DECLARE $card_updated AS Utf8;

					UPSERT INTO cards
					(
						card_id, card_heap, card_first_side, card_second_side, card_type, card_status, card_updated
					)
					VALUES
					(
						$card_id, $card_heap, $card_first_side, $card_second_side, card_type, card_status, "new"
					)
				`,
      });
      const { value: resultSet } = await resultSets.next();
      const { value: row } = await resultSet.rows.next();
      return row[0];
    },
  });
  return result;
}
