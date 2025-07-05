import {
  declareType,
  TypedData,
  Types,
  withTypeOptions,
  snakeToCamelCaseConversion,
} from "ydb-sdk";
import { CardData, HeapData } from "./types";

@withTypeOptions({ namesConversion: snakeToCamelCaseConversion })
class Heap extends TypedData {
  @declareType(Types.UTF8)
  public heap_id?: string;

  @declareType(Types.UTF8)
  public heap_title?: string;

  @declareType(Types.UTF8)
  public heap_description?: string;

  static create(
    heap_id: string,
    heap_title: string,
    heap_description: string,
  ): Heap {
    return new this({ heap_id, heap_title, heap_description });
  }

  constructor(data: HeapData) {
    super(data);
    this.heap_id = data.heap_id as string;
    this.heap_title = data.heap_title;
    this.heap_description = data.heap_description;
  }
}

@withTypeOptions({ namesConversion: snakeToCamelCaseConversion })
class Card extends TypedData {
  @declareType(Types.UTF8)
  public card_id?: string;

  @declareType(Types.UTF8)
  public card_heap?: string;

  @declareType(Types.UTF8)
  public card_first_side?: string;

  @declareType(Types.UTF8)
  public card_second_side?: string;

  @declareType(Types.UTF8)
  public card_type?: string;

  @declareType(Types.UTF8)
  public card_status?: string;

  @declareType(Types.UTF8)
  public card_updated?: string;

  static create(
    card_id: string,
    card_heap: string,
    card_first_side: string,
    card_second_side: string,
    card_type: string,
    card_status: string,
    card_updated: string,
  ): Card {
    return new this({
      card_id,
      card_heap,
      card_first_side,
      card_second_side,
      card_type,
      card_status,
      card_updated,
    });
  }

  constructor(data: CardData) {
    super(data);
    this.card_id = data.card_id as string;
    this.card_heap = data.card_heap;
    this.card_first_side = data.card_first_side;
    this.card_second_side = data.card_second_side;
    this.card_type = data.card_type;
    this.card_status = data.card_status;
    this.card_updated = data.card_updated;
  }
}

export { Card, Heap };
