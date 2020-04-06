export type MoveFields = {
  name: string;
  type: [string];
  category: 'STATUS' | 'SPECIAL' | 'PHYSICAL';
  power?: number;
  accuracy?: number;
  Learnset?: string[];
  priority: number;
  target:
    | 'SELF'
    | 'NORMAL'
    | 'ANY'
    | 'ALL'
    | 'ADJACENT_ALLY'
    | 'ADJACENT_OPPONENT'
    | 'ADJACENT_ALLY_OR_SELF'
    | 'ADJACENT_ALLIES'
    | 'ADJACENT_OPPONENTS'
    | 'ALL_ADJACENT'
    | 'ALL_ALLIES'
    | 'ALL_OPPONENTS'
    | 'SCRIPTED';
  flags: Array<
    | 'CONTACT'
    | 'BITE'
    | 'BULLET'
    | 'CHARGE'
    | 'DANCE'
    | 'DEFROST'
    | 'DISTANCE'
    | 'GRAVITY'
    | 'HEAL'
    | 'MIRROR'
    | 'MYSTERY'
    | 'NONSKY'
    | 'POWDER'
    | 'PROTECT'
    | 'PULSE'
    | 'PUNCH'
    | 'RECHARGE'
    | 'REFLECTABLE'
    | 'SNATCH'
    | 'SOUND'
  >;
  pp: number;
  numHits?: number;
};
