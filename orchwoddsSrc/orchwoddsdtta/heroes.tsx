export type HeroId = 'rowan' | 'elowen' | 'bramble' | 'nylara';

export type Hero = {
  id: HeroId;
  name: string;

  image: any;

  lives: number;

  fixedBonusCoins: number;

  royalFortune: number;

  price: number;
};

export const HEROES: Hero[] = [
  {
    id: 'rowan',
    name: 'Rowan Fox',
    image: require('../../assets/images/herodef.png'),
    lives: 3,
    fixedBonusCoins: 0,
    royalFortune: 10,
    price: 0,
  },
  {
    id: 'elowen',
    name: 'Lady Elowen',
    image: require('../../assets/images/mansec.png'),
    lives: 4,
    fixedBonusCoins: 3,
    royalFortune: 25,
    price: 40,
  },
  {
    id: 'bramble',
    name: 'Baron Bramble',
    image: require('../../assets/images/womthird.png'),
    lives: 6,
    fixedBonusCoins: 5,
    royalFortune: 40,
    price: 70,
  },
  {
    id: 'nylara',
    name: 'Queen Nylara',
    image: require('../../assets/images/cleofrth.png'),
    lives: 8,
    fixedBonusCoins: 8,
    royalFortune: 60,
    price: 99,
  },
];
