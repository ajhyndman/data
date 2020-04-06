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

export type Type = {
  name: string;
};
