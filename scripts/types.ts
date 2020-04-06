export type Move = {
  accuracy: number | 'Bypass';
  basePower: number;
  category: 'Special' | 'Physical' | 'Status';
  desc: string;
  flags: {
    authentic: boolean;
    bite: boolean;
    bullet: boolean;
    charge: boolean;
    contact: boolean;
    dance: boolean;
    defrost: boolean;
    distance: boolean;
    gravity: boolean;
    heal: boolean;
    mirror: boolean;
    mystery: boolean;
    nonsky: boolean;
    powder: boolean;
    protect: boolean;
    pulse: boolean;
    punch: boolean;
    recharge: boolean;
    reflectable: boolean;
    snatch: boolean;
    sound: boolean;
  };
  isNonStandard: null | 'CAP' | 'Unobtainable';
  name: string;
  pp: number;
  priority: number;
  shortDesc: string;
  target:
    | 'Self'
    | 'Normal'
    | 'Any'
    | 'All'
    | 'AdjacentAlly'
    | 'AdjacentFoe'
    | 'AdjacentAllyOrSelf'
    | 'AllAdjacentFoes'
    | 'AllAdjacent'
    | 'AllySide'
    | 'FoeSide'
    | 'Scripted'
    | 'AllyTeam'
    | 'RandomNormal';
  type: number;
};

export type Species = {
  abilities: number[];
  altBattleFormes: number[];
  baseStats: {
    atk: number;
    def: number;
    hp: number;
    spa: number;
    spd: number;
    spe: number;
  };
  evos: number[];
  heightm: number;
  isBattleOnly: boolean;
  isNonstandard: null | 'CAP';
  learnset: { how: string[]; what: number }[];
  name: string;
  num: number;
  prevo?: number;
  tier: never; // TODO
  types: number[];
  weightkg: number;
};

export type Type = {
  name: string;
};
