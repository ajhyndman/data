import Airtable from 'airtable';
import { config } from 'dotenv';
import { isEmpty, prepend, take, drop } from 'ramda';

import DATA from '../build/data/8.json';
import { MoveFields } from './airtable-types';
import { Move, Type } from './types';

type IdMap = {
  [name: string]: string;
};

// load environment vairables
config();

// @ts-ignore
const MOVES: Move[] = DATA.moves;
// @ts-ignore
const TYPES: Type[] = DATA.types;
const AIRTABLE_BASE_ID = 'appFmM32VIEYyRwxI';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

const CATEGORY_NAMES = {
  Status: 'STATUS',
  Special: 'SPECIAL',
  Physical: 'PHYSICAL',
} as const;

const TARGET_NAMES = {
  Self: 'SELF',
  Normal: 'NORMAL',
  Any: 'ANY',
  All: 'ALL',
  AdjacentAlly: 'ADJACENT_ALLY',
  AdjacentFoe: 'ADJACENT_OPPONENT',
  AdjacentAllyOrSelf: 'ADJACENT_ALLY_OR_SELF',
  AllAdjacentFoes: 'ADJACENT_OPPONENTS',
  AllAdjacent: 'ALL_ADJACENT',
  AllySide: 'ALL_ALLIES',
  AllyTeam: 'ALL_ALLIES',
  FoeSide: 'ALL_OPPONENTS',
  Scripted: 'SCRIPTED',
  RandomNormal: 'SCRIPTED',
} as const;

function groupsOf<T>(n: number, list: T[]): T[][] {
  return isEmpty(list) ? [] : prepend(take(n, list), groupsOf(n, drop(n, list)));
}

async function fetchTypeIds(): Promise<IdMap> {
  const records = await base('Type')
    .select({
      fields: ['name'],
    })
    .all();
  return records.reduce(
    (acc, record) => ({
      ...acc,
      // @ts-ignore
      [record.fields.name]: record.id,
    }),
    {}
  );
}

async function fetchMoveIds(): Promise<IdMap> {
  const records = await base('Move')
    .select({
      fields: ['name'],
    })
    .all();
  return records.reduce(
    (acc, record) => ({
      ...acc,
      // @ts-ignore
      [record.fields.name]: record.id,
    }),
    {}
  );
}

async function exportMoves(typeIds: IdMap, moveIds: IdMap) {
  const airtableMoves: MoveFields[] = MOVES.filter((move) => move != null)
    .filter((move) => !move.isNonStandard)
    .map((move) => {
      const typeName = TYPES[move.type].name;
      const typeId = typeIds[typeName];
      return {
        name: move.name,
        type: [typeId],
        category: CATEGORY_NAMES[move.category],
        power: move.basePower !== 0 ? move.basePower : undefined,
        accuracy: typeof move.accuracy === 'number' ? move.accuracy : undefined,
        priority: move.priority,
        target: TARGET_NAMES[move.target],
        flags: Object.keys(move.flags)
          // @ts-ignore
          .filter((key: string) => move.flags[key])
          .map((key) => key.toUpperCase() as any),
        pp: move.pp,
        // Learnset: [],
      };
    });

  const updates = airtableMoves
    .filter((move) => moveIds[move.name] != null)
    .map((fields) => ({
      id: moveIds[fields.name],
      fields,
    }));

  const creations = airtableMoves
    .filter((move) => moveIds[move.name] == null)
    .map((fields) => ({
      id: moveIds[fields.name],
      fields,
    }));

  await Promise.all(
    groupsOf(10, updates).map(async (updateGroup) => {
      try {
        await base('Move').replace(updateGroup);
      } catch (e) {
        console.error(e);
      }
    })
  );

  await Promise.all(
    groupsOf(10, creations).map(async (updateGroup) => {
      try {
        await base('Move').create(updateGroup);
      } catch (e) {
        console.error(e);
      }
    })
  );
}

async function main() {
  try {
    const typeIds = await fetchTypeIds();
    const moveIds = await fetchMoveIds();
    exportMoves(typeIds, moveIds);
  } catch (e) {
    console.error(e);
  }
}

main();
