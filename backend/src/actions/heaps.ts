import { HeapData } from "../db/types";
import { get, getAll, del, change, create } from "../db/heaps";
import { v4 as uuidv4 } from "uuid";

export async function getHeap(heap_id: string) {
  const response = await get(heap_id);
  if (response.heap_id) {
    return response;
  } else {
    return null;
  }
}
export async function getAllHeaps() {
  const response = await getAll();
  if (response) {
    return response;
  } else {
    return [];
  }
}
export async function delHeap(heap_id: string) {
  del(heap_id);
}
export async function changeHeap(heap_id: string, data: HeapData) {
  change(heap_id, data);
}
export async function createHeap(data: HeapData) {
  const response = await create({ ...data, heap_id: uuidv4() });
  if (response.heap_id) {
    return response;
  } else {
    return null;
  }
}
