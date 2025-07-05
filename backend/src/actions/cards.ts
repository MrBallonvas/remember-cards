import { CardData } from "../db/types";
import { v4 as uuidv4 } from "uuid";
import { get, getAll, del, change, create } from "../db/cards";

export async function getCard(card_id: string) {
  const response = await get(card_id);
  if (response.card_id) {
    return response;
  } else {
    return null;
  }
}
export async function getAllCards(card_heap: string) {
  const response = await getAll(card_heap);
  if (response) {
    return response;
  } else {
    return [];
  }
}
export async function delCard(card_id: string) {
  del(card_id);
}
export async function changeCard(card_id: string, data: CardData) {
  change(card_id, data);
}
export async function createCard(data: CardData) {
  const response = await create({ ...data, card_id: uuidv4() });
  if (response.card_id) {
    return response;
  } else {
    return null;
  }
}
