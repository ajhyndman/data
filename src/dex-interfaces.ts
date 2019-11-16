import { GenerationNumber } from './gens';

////////////////////////////////////////////////////////////////////////////////

// TypeScript just gives up at inferring an ExtSpec. If we leave just the rich fields ('present') then an extension without any rich fields will trigger "weak type detection" (https://mariusschulz.com/blog/weak-type-detection-in-typescript). But if we leave the [k: string]: unknown bits, then leaving out a type annotation means all fields are present.
//
// So for now, just deal with errors where you put something other than
// 'present'. Or maybe there's another way. idk.
export type ExtSpec = {
  gens?: {
    //[k: string]: unknown;
  };
  species?: {
    //prevo?: 'present';
    //evos?: 'present';
    //abilities?: 'present';
    //types?: 'present';
    //learnset?: 'present';
    //[k: string]: unknown;
  };
  abilities?: {
    //[k: string]: unknown;
  };
  items?: {
    //[k: string]: unknown;
  };
  moves?: {
    //type?: 'present';
  };
  types?: {
    //[k: string]: unknown;
  };
};

// Array may be empty if no fields.
type ExtField<Ext extends ExtSpec, Field extends string> = Ext extends Record<Field, unknown>
  ? Ext[Field]
  : {};

type RichField<
  Ext extends ExtSpec,
  Field extends string,
  R extends Record<string, unknown>
> = ExtField<Ext, Field> extends Record<keyof R, 'present'> ? R : {};

// TODO better name.
type CollectionField<Ext extends ExtSpec, R extends Record<string, unknown>> = Ext extends Record<
  keyof R,
  unknown
>
  ? R
  : {};

////////////////////////////////////////////////////////////////////////////////

export interface Store<T> {
  [Symbol.iterator](): Iterator<T>;
  find(fn: (obj: T) => boolean): T | undefined;
  find1(fn: (obj: T) => boolean): T;
}

export type Format = 'Plain' | 'Rich';

type Ref<K extends Format, T> = { Plain: number; Rich: T }[K];
// Can't use { Plain: undefined, Rich: T }, because that requires the key be present in the record. Instead, intersect this record.
type Backref<K extends Format, Field extends string, T> = {
  Plain: {};
  Rich: Record<Field, T>;
}[K];
// TODO: move delta here
type Collection<K extends Format, T> = { Plain: Array<T | null>; Rich: Store<T> }[K];

export interface Dex<K extends Format, Ext extends ExtSpec = {}> {
  gens: Collection<K, Generation<K, Ext>>;
}

export type Generation<K extends Format, Ext extends ExtSpec = {}> = Omit<
  ExtField<Ext, 'gens'>,
  'species' | 'abilities' | 'items' | 'moves' | 'types'
> &
  CollectionField<Ext, { species: Collection<K, Species<K, Ext>> }> &
  CollectionField<Ext, { abilities: Collection<K, Ability<K, Ext>> }> &
  CollectionField<Ext, { items: Collection<K, Item<K, Ext>> }> &
  CollectionField<Ext, { moves: Collection<K, Move<K, Ext>> }> &
  CollectionField<Ext, { types: Collection<K, Type<K, Ext>> }>;

export type GameObject<K extends Format, Ext extends ExtSpec = {}> = Backref<
  K,
  'gen',
  Generation<K, Ext>
>;

export type Species<K extends Format, Ext extends ExtSpec = {}> = Omit<
  ExtField<Ext, 'species'>,
  'prevo' | 'evos' | 'abilities' | 'types' | 'learnset' | 'altBattleFormes'
> &
  GameObject<K, Ext> &
  RichField<Ext, 'species', { prevo: Ref<K, Species<K, Ext>> | null }> &
  RichField<Ext, 'species', { evos: Array<Ref<K, Species<K, Ext>>> }> &
  RichField<Ext, 'species', { abilities: Array<Ref<K, Ability<K, Ext>>> }> &
  RichField<Ext, 'species', { types: Array<Ref<K, Type<K, Ext>>> }> &
  // TODO: Learnset interface
  RichField<Ext, 'species', { learnset: Array<Ref<K, Move<K, Ext>>> }> &
  RichField<Ext, 'species', { altBattleFormes: Array<Ref<K, Species<K, Ext>>> }>;

export type Ability<K extends Format, Ext extends ExtSpec = {}> = ExtField<Ext, 'abilities'> &
  GameObject<K, Ext>;

export type Item<K extends Format, Ext extends ExtSpec = {}> = ExtField<Ext, 'items'> &
  GameObject<K, Ext>;

export type Move<K extends Format, Ext extends ExtSpec = {}> = Omit<
  ExtField<Ext, 'moves'>,
  'type'
> &
  GameObject<K, Ext> &
  RichField<Ext, 'moves', { type: Ref<K, Type<K, Ext>> }>;

export type Type<K extends Format, Ext extends ExtSpec = {}> = ExtField<Ext, 'types'> &
  GameObject<K, Ext>;
