type EventCard = {
  id: string;
  title: string;
  event: string;

  outcomes: {
    bad: string;
    neutral: string;
    good: string;
  };
};

export const EASY_EVENTS: EventCard[] = [
  {
    id: 'easy-1',
    title: 'The Cliff Edge',
    event: 'You step too close to a steep cliff.',
    outcomes: {
      bad: 'The branch snaps— you fall and lose a life.',
      neutral: 'You slide down but stop just in time.',
      good: 'You climb down safely and spot a coin in the grass.',
    },
  },
  {
    id: 'easy-2',
    title: 'Thorny Bushes',
    event: 'You push through a patch of thorny bushes.',
    outcomes: {
      bad: 'The thorns cut deep— you lose a life.',
      neutral: 'You get scratched, but keep going.',
      good: 'You squeeze through and find a coin between the leaves.',
    },
  },
  {
    id: 'easy-3',
    title: 'Shaky Bridge',
    event: 'An old wooden bridge creaks under your feet.',
    outcomes: {
      bad: 'A plank breaks— you fall and lose a life.',
      neutral: 'You wobble, but make it across.',
      good: 'You notice a coin on a board and cross safely.',
    },
  },
  {
    id: 'easy-4',
    title: 'Strange Berries',
    event: 'You find a bush full of juicy berries.',
    outcomes: {
      bad: 'One tastes bad— you feel sick and lose a life.',
      neutral: 'You decide not to risk it and walk away.',
      good: 'The berries boost your mood— and you spot a coin beneath the bush.',
    },
  },
  {
    id: 'easy-5',
    title: 'Foggy Path',
    event: 'Thick fog covers the trail.',
    outcomes: {
      bad: 'You wander into trouble and lose a life.',
      neutral: 'You wait until the fog clears a little.',
      good: 'You find the right path— and a coin near a root.',
    },
  },
  {
    id: 'easy-6',
    title: 'The Owl Watcher',
    event: 'A giant owl stares at you from a branch.',
    outcomes: {
      bad: 'It startles you— you stumble and lose a life.',
      neutral: 'You back away slowly. Safe.',
      good: 'The owl nods… and you find a coin below the tree.',
    },
  },
  {
    id: 'easy-7',
    title: 'Rolling Rock',
    event: 'A stone under your foot starts rolling downhill.',
    outcomes: {
      bad: 'You fall with it and lose a life.',
      neutral: 'You jump aside just in time.',
      good: 'The rock reveals a hidden coin.',
    },
  },
  {
    id: 'easy-8',
    title: 'Mushroom Circle',
    event: 'You step into a strange circle of mushrooms.',
    outcomes: {
      bad: 'The ground gives way— you lose a life.',
      neutral: 'You feel chills and quickly step out.',
      good: 'A coin glints in the center of the circle.',
    },
  },
  {
    id: 'easy-9',
    title: 'Fresh Tracks',
    event: 'You notice fresh predator tracks on the ground.',
    outcomes: {
      bad: 'Something attacks— you lose a life.',
      neutral: 'You freeze and wait until it’s quiet again.',
      good: 'You carefully avoid danger and find a coin on the trail.',
    },
  },
  {
    id: 'easy-10',
    title: 'Hollow Tree',
    event: 'A dark hollow inside a tree catches your eye.',
    outcomes: {
      bad: 'A bug jumps out and stings— you lose a life.',
      neutral: 'Just dry leaves. Nothing more.',
      good: 'A coin is hidden inside the hollow.',
    },
  },
  {
    id: 'easy-11',
    title: 'The Stream Jump',
    event: 'You try to jump over a stream.',
    outcomes: {
      bad: 'You slip and hit the stones— you lose a life.',
      neutral: 'You land awkwardly, but stay standing.',
      good: 'You spot a coin on a rock by the water.',
    },
  },
  {
    id: 'easy-12',
    title: 'Fox Guide',
    event: 'A fox appears and gestures for you to follow.',
    outcomes: {
      bad: 'It leads you into thick thorns— you lose a life.',
      neutral: 'The fox runs off. You continue alone.',
      good: 'The fox leads you to a coin under leaves.',
    },
  },
  {
    id: 'easy-13',
    title: 'Hidden Burrow',
    event: 'You spot a small burrow under roots.',
    outcomes: {
      bad: 'You get stuck and hurt yourself— you lose a life.',
      neutral: 'Too tight. You step back.',
      good: 'A coin sits right by the entrance.',
    },
  },
  {
    id: 'easy-14',
    title: 'Falling Branch',
    event: 'A dry branch cracks above you.',
    outcomes: {
      bad: 'It drops on you— you lose a life.',
      neutral: 'You dodge at the last second.',
      good: 'The branch knocks loose a coin from a nest.',
    },
  },
  {
    id: 'easy-15',
    title: 'Berry Clearing',
    event: 'You enter a clearing filled with glowing berries.',
    outcomes: {
      bad: 'Mud grabs your feet— you lose a life.',
      neutral: 'You walk along the edge safely.',
      good: 'You find a coin on dry ground.',
    },
  },
  {
    id: 'easy-16',
    title: 'Broken Signpost',
    event: 'A wooden sign points in two directions.',
    outcomes: {
      bad: 'You choose wrong and get hurt— you lose a life.',
      neutral: 'You turn back with no harm done.',
      good: 'A coin lies beside the sign.',
    },
  },
  {
    id: 'easy-17',
    title: 'Rustling Bushes',
    event: 'Something moves inside the bushes.',
    outcomes: {
      bad: 'It jumps out— you lose a life.',
      neutral: 'Just the wind.',
      good: 'You find a coin in the grass nearby.',
    },
  },
  {
    id: 'easy-18',
    title: 'Shimmering Dew',
    event: 'Strange dew sparkles on the leaves.',
    outcomes: {
      bad: 'You touch it— it burns. You lose a life.',
      neutral: 'You avoid it carefully.',
      good: 'A drop rolls away, revealing a coin.',
    },
  },
  {
    id: 'easy-19',
    title: 'Small Cave',
    event: 'A small cave entrance appears ahead.',
    outcomes: {
      bad: 'A rock falls inside— you lose a life.',
      neutral: 'You peek in and leave.',
      good: 'A coin sits near the entrance.',
    },
  },
  {
    id: 'easy-20',
    title: 'Rotten Stump',
    event: 'You step onto a stump to look around.',
    outcomes: {
      bad: 'It crumbles— you fall and lose a life.',
      neutral: 'It wobbles, but holds.',
      good: 'A coin is tucked under the bark.',
    },
  },
  {
    id: 'easy-21',
    title: 'Firefly Swarm',
    event: 'Fireflies swirl around you in a bright cloud.',
    outcomes: {
      bad: 'You get dizzy and fall— you lose a life.',
      neutral: 'They drift away.',
      good: 'They light up a coin on the ground.',
    },
  },
  {
    id: 'easy-22',
    title: 'Triple Fork Path',
    event: 'The trail splits into three directions.',
    outcomes: {
      bad: 'You pick the worst route— you lose a life.',
      neutral: 'You return safely.',
      good: 'You find a coin on the best path.',
    },
  },
  {
    id: 'easy-23',
    title: 'Hanging Root',
    event: 'A thick root hangs across the trail.',
    outcomes: {
      bad: 'You trip hard— you lose a life.',
      neutral: 'You duck under it.',
      good: 'A coin is stuck on the root like a charm.',
    },
  },
  {
    id: 'easy-24',
    title: 'Slippery Stone',
    event: 'A river stone looks dangerously slick.',
    outcomes: {
      bad: 'You slip and crash— you lose a life.',
      neutral: 'You keep your balance.',
      good: 'You notice a coin beside the stone.',
    },
  },
  {
    id: 'easy-25',
    title: 'Soft Moss Trap',
    event: 'The moss looks soft… too soft.',
    outcomes: {
      bad: 'You sink and get hurt— you lose a life.',
      neutral: 'You pull back quickly.',
      good: 'A coin rests on the edge of the moss.',
    },
  },
  {
    id: 'easy-26',
    title: 'Jumping Rabbit',
    event: 'A rabbit suddenly hops in front of you.',
    outcomes: {
      bad: 'You trip over it— you lose a life.',
      neutral: 'It runs away. No problem.',
      good: 'It leads you right to a coin.',
    },
  },
  {
    id: 'easy-27',
    title: 'Tiny Bell Sound',
    event: 'You hear a soft bell ringing nearby.',
    outcomes: {
      bad: 'You chase it into danger— you lose a life.',
      neutral: 'You ignore it and move on.',
      good: 'You find a coin near the sound.',
    },
  },
  {
    id: 'easy-28',
    title: 'Berry Rain',
    event: 'Berries drop from a bush like rain.',
    outcomes: {
      bad: 'One hits your eye— you lose a life.',
      neutral: 'You shield yourself and keep walking.',
      good: 'A coin falls with the berries.',
    },
  },
  {
    id: 'easy-29',
    title: 'Snake Rock',
    event: 'Something shiny lies on a warm rock.',
    outcomes: {
      bad: 'It’s a snake— it bites. You lose a life.',
      neutral: 'It slips away into the grass.',
      good: 'It leaves behind a coin.',
    },
  },
  {
    id: 'easy-30',
    title: 'Steep Hill',
    event: 'You climb a steep, rocky hill.',
    outcomes: {
      bad: 'Loose stones send you tumbling— you lose a life.',
      neutral: 'You climb carefully and stay safe.',
      good: 'A coin waits at the top.',
    },
  },
  {
    id: 'easy-31',
    title: 'Mirror Leaf',
    event: 'A leaf reflects light like a mirror.',
    outcomes: {
      bad: 'It blinds you— you fall. You lose a life.',
      neutral: 'You turn away and continue.',
      good: 'A coin is hidden under the leaf.',
    },
  },
  {
    id: 'easy-32',
    title: 'Ancient Gate',
    event: 'A crumbling stone gate stands ahead.',
    outcomes: {
      bad: 'Stones fall— you lose a life.',
      neutral: 'You pass carefully.',
      good: 'A coin is lodged in the gate’s carving.',
    },
  },
  {
    id: 'easy-33',
    title: 'Empty Cart',
    event: 'An old cart sits beside the trail.',
    outcomes: {
      bad: 'A wheel snaps and hits you— you lose a life.',
      neutral: 'Nothing inside.',
      good: 'A coin rests in the cart’s corner.',
    },
  },
  {
    id: 'easy-34',
    title: 'Old Stairs',
    event: 'You climb a set of worn wooden steps.',
    outcomes: {
      bad: 'A step breaks— you lose a life.',
      neutral: 'You climb slowly and safely.',
      good: 'A coin shines on the top step.',
    },
  },
  {
    id: 'easy-35',
    title: 'Leafy Whirlwind',
    event: 'Wind throws leaves into your face.',
    outcomes: {
      bad: 'You stumble and fall— you lose a life.',
      neutral: 'You wait it out.',
      good: 'After the wind, you spot a coin.',
    },
  },
  {
    id: 'easy-36',
    title: 'Sudden Silence',
    event: 'The forest suddenly goes silent.',
    outcomes: {
      bad: 'You panic and get hurt— you lose a life.',
      neutral: 'You breathe and keep moving.',
      good: 'In the quiet, you notice a coin.',
    },
  },
  {
    id: 'easy-37',
    title: 'Glowing Hollow',
    event: 'Warm light shines from a tree hollow.',
    outcomes: {
      bad: 'It’s a trap— you lose a life.',
      neutral: 'You don’t touch it and walk on.',
      good: 'A softly glowing coin lies inside.',
    },
  },
  {
    id: 'easy-38',
    title: 'High Root Step',
    event: 'You step over a tall root.',
    outcomes: {
      bad: 'You trip and lose a life.',
      neutral: 'You step over it smoothly.',
      good: 'A coin is hidden beneath the root.',
    },
  },
  {
    id: 'easy-39',
    title: 'Spark in the Dust',
    event: 'Something sparkles in the dusty path.',
    outcomes: {
      bad: 'Dust hits your eyes— you lose a life.',
      neutral: 'You cough and keep walking.',
      good: 'It’s a coin!',
    },
  },
  {
    id: 'easy-40',
    title: 'Distant Laugh',
    event: 'You hear a strange laugh far away.',
    outcomes: {
      bad: 'You run and fall— you lose a life.',
      neutral: 'You stop and calm down.',
      good: 'You find a coin near the laughing tree.',
    },
  },
];

export const MEDIUM_EVENTS: EventCard[] = [
  {
    id: 'med-1',
    title: 'Slippery Bridge',
    event: 'You step onto an old bridge over a dark stream.',
    outcomes: {
      bad: 'A plank snaps and you crash down — you lose a life.',
      neutral: 'The bridge shakes, but you cross safely.',
      good: 'You cross and find coins wedged in the rope.',
    },
  },
  {
    id: 'med-2',
    title: 'Whispering Bush',
    event: 'A berry bush rustles like it’s whispering your name.',
    outcomes: {
      bad: 'Sharp thorns scratch you badly — you lose a life.',
      neutral: 'It was only the wind.',
      good: 'A small stash falls from the leaves.',
    },
  },
  {
    id: 'med-3',
    title: 'Lost Traveler',
    event: 'A tired traveler asks you for directions.',
    outcomes: {
      bad: 'They trick you and shove you aside — you lose a life.',
      neutral: 'You point the way and move on.',
      good: 'They thank you with a handful of coins.',
    },
  },
  {
    id: 'med-4',
    title: 'Foggy Path',
    event: 'Thick fog covers the trail ahead.',
    outcomes: {
      bad: 'You step into a hidden ditch — you lose a life.',
      neutral: 'You slow down and make it through.',
      good: 'The fog clears, revealing coins on the ground.',
    },
  },
  {
    id: 'med-5',
    title: 'Angry Raven',
    event: 'A raven lands in front of you, staring boldly.',
    outcomes: {
      bad: 'It attacks your head and you fall — you lose a life.',
      neutral: 'It caws loudly and flies away.',
      good: 'It drops shiny coins from above.',
    },
  },
  {
    id: 'med-6',
    title: 'Berry River',
    event: 'You try to cross a fast berry-colored river.',
    outcomes: {
      bad: 'The current knocks you down — you lose a life.',
      neutral: 'You slip but grab a stone.',
      good: 'You make it across and find coins near the shore.',
    },
  },
  {
    id: 'med-7',
    title: 'Hidden Root',
    event: 'A thick root sticks out across the path.',
    outcomes: {
      bad: 'You trip hard and hit the ground — you lose a life.',
      neutral: 'You stumble, but keep walking.',
      good: 'Under the root you find a tiny coin stash.',
    },
  },
  {
    id: 'med-8',
    title: 'Shimmering Cave',
    event: 'A small cave glows faintly from inside.',
    outcomes: {
      bad: 'Loose stones fall and hit you — you lose a life.',
      neutral: 'You peek in, then back away.',
      good: 'Coins sparkle near the entrance.',
    },
  },
  {
    id: 'med-9',
    title: 'Strange Footprints',
    event: 'You notice strange footprints circling your trail.',
    outcomes: {
      bad: 'Something jumps at you from behind — you lose a life.',
      neutral: 'The tracks fade away.',
      good: 'The footprints lead to hidden coins.',
    },
  },
  {
    id: 'med-10',
    title: 'Bee Swarm',
    event: 'A buzzing swarm blocks your way near a berry tree.',
    outcomes: {
      bad: 'You get stung badly — you lose a life.',
      neutral: 'You wait quietly until they pass.',
      good: 'They fly away, revealing coins below.',
    },
  },
  {
    id: 'med-11',
    title: 'Broken Lantern',
    event: 'You find an old lantern still glowing weakly.',
    outcomes: {
      bad: 'It shatters and sparks burn you — you lose a life.',
      neutral: 'The light fades out.',
      good: 'Coins were hidden under the lantern.',
    },
  },
  {
    id: 'med-12',
    title: 'Talking Mushroom',
    event: 'A mushroom with a face blinks at you.',
    outcomes: {
      bad: 'It releases spores and you collapse — you lose a life.',
      neutral: 'It giggles and goes silent.',
      good: 'It points to coins near a rock.',
    },
  },
  {
    id: 'med-13',
    title: 'Wild Berry Deer',
    event: 'A deer with berry vines on its antlers blocks the path.',
    outcomes: {
      bad: 'It charges and knocks you down — you lose a life.',
      neutral: 'It watches you, then walks away.',
      good: 'Coins fall from its antlers.',
    },
  },
  {
    id: 'med-14',
    title: 'Shaky Ladder',
    event: 'A wooden ladder leads to a higher platform.',
    outcomes: {
      bad: 'The ladder breaks and you fall — you lose a life.',
      neutral: 'You climb halfway, then return.',
      good: 'At the top you find coins.',
    },
  },
  {
    id: 'med-15',
    title: 'Crystal Puddle',
    event: 'A puddle sparkles like liquid crystal.',
    outcomes: {
      bad: 'It burns your skin — you lose a life.',
      neutral: 'You step around it carefully.',
      good: 'Coins glow under the water.',
    },
  },
  {
    id: 'med-16',
    title: 'Silent Watchtower',
    event: 'An abandoned watchtower rises above the trees.',
    outcomes: {
      bad: 'The stairs collapse under you — you lose a life.',
      neutral: 'You look around but find nothing.',
      good: 'You discover coins in a dusty corner.',
    },
  },
  {
    id: 'med-17',
    title: 'Berry Thief',
    event: 'A sneaky figure grabs berries and runs past you.',
    outcomes: {
      bad: 'They push you down to escape — you lose a life.',
      neutral: 'They disappear into the bushes.',
      good: 'They drop coins while running.',
    },
  },
  {
    id: 'med-18',
    title: 'Singing Wind',
    event: 'The wind starts to sing between the trees.',
    outcomes: {
      bad: 'A gust throws you into a trunk — you lose a life.',
      neutral: 'The sound fades away.',
      good: 'The wind blows coins to your feet.',
    },
  },
  {
    id: 'med-19',
    title: 'Glowing Pond',
    event: 'A pond glows purple under the moonlight.',
    outcomes: {
      bad: 'You slip into icy water — you lose a life.',
      neutral: 'You step back and stay safe.',
      good: 'Coins rest near the shore.',
    },
  },
  {
    id: 'med-20',
    title: 'Thorny Tunnel',
    event: 'A narrow tunnel of vines blocks the shortcut.',
    outcomes: {
      bad: 'Thorns tear you badly — you lose a life.',
      neutral: 'You crawl through slowly.',
      good: 'You exit and find coins.',
    },
  },
  {
    id: 'med-21',
    title: 'Fallen Statue',
    event: 'A broken statue lies half-buried in the ground.',
    outcomes: {
      bad: 'A stone piece falls on you — you lose a life.',
      neutral: 'You walk around it safely.',
      good: 'Coins roll out from under it.',
    },
  },
  {
    id: 'med-22',
    title: 'Mysterious Door',
    event: 'A tiny door is carved into an old tree.',
    outcomes: {
      bad: 'It slams on your hand — you lose a life.',
      neutral: 'It won’t open at all.',
      good: 'It opens to reveal coins inside.',
    },
  },
  {
    id: 'med-23',
    title: 'Berry Market Ghost',
    event: 'You see a ghostly market stand shimmering ahead.',
    outcomes: {
      bad: 'A cold shock hits you — you lose a life.',
      neutral: 'The market fades away.',
      good: 'Coins remain where it stood.',
    },
  },
  {
    id: 'med-24',
    title: 'Golden Leaf',
    event: 'A golden leaf spins in the air before you.',
    outcomes: {
      bad: 'It cuts your skin like a blade — you lose a life.',
      neutral: 'It floats away harmlessly.',
      good: 'It lands on hidden coins.',
    },
  },
  {
    id: 'med-25',
    title: 'Shy Fox',
    event: 'A fox with bright eyes watches you closely.',
    outcomes: {
      bad: 'It bites your hand and runs — you lose a life.',
      neutral: 'It vanishes into the grass.',
      good: 'It leads you to coins under leaves.',
    },
  },
  {
    id: 'med-26',
    title: 'Berry Storm',
    event: 'A sudden storm shakes the forest.',
    outcomes: {
      bad: 'A branch falls on you — you lose a life.',
      neutral: 'You hide until it passes.',
      good: 'After the storm, you spot coins in the mud.',
    },
  },
  {
    id: 'med-27',
    title: 'Old Well',
    event: 'An old well stands beside the path.',
    outcomes: {
      bad: 'You slip and fall inside — you lose a life.',
      neutral: 'You step back in time.',
      good: 'Coins shine on the edge.',
    },
  },
  {
    id: 'med-28',
    title: 'Crooked Signpost',
    event: 'A crooked sign points to “Berry Castle”.',
    outcomes: {
      bad: 'It collapses onto you — you lose a life.',
      neutral: 'It points nowhere useful.',
      good: 'Coins are stuck behind the sign.',
    },
  },
  {
    id: 'med-29',
    title: 'Floating Lanterns',
    event: 'Lanterns drift through the trees like fireflies.',
    outcomes: {
      bad: 'One bursts near you — you lose a life.',
      neutral: 'They float away quietly.',
      good: 'One drops coins into your path.',
    },
  },
  {
    id: 'med-30',
    title: 'Crown Shrine',
    event: 'A small shrine holds a glowing crown symbol.',
    outcomes: {
      bad: 'The shrine’s magic hurts you — you lose a life.',
      neutral: 'Nothing reacts at all.',
      good: 'Coins appear in the soft glow.',
    },
  },
];

export const HARD_EVENTS: EventCard[] = [
  {
    id: 'hard-1',
    title: 'Serpent Ambush',
    event: 'A long shadow slides across the path… something is hunting you.',
    outcomes: {
      bad: 'The serpent strikes — you lose a life.',
      neutral: 'You freeze until it disappears.',
      good: 'You outsmart it and gain a rare reward.',
    },
  },
  {
    id: 'hard-2',
    title: 'Crumbling Cliff Path',
    event: 'The trail narrows into a cliffside ledge with loose stones.',
    outcomes: {
      bad: 'The ground breaks — you lose a life.',
      neutral: 'You move slowly and survive.',
      good: 'You find a hidden stash and gain a rare reward.',
    },
  },
  {
    id: 'hard-3',
    title: 'Dark Thorn Maze',
    event: 'Thick thorn walls form a tight maze around you.',
    outcomes: {
      bad: 'You get trapped and hurt — you lose a life.',
      neutral: 'You squeeze through with scratches.',
      good: 'You escape and gain a rare reward.',
    },
  },
  {
    id: 'hard-4',
    title: 'Cursed Berry Bite',
    event: 'A perfect berry glows on a lonely branch.',
    outcomes: {
      bad: 'It’s cursed — you collapse — you lose a life.',
      neutral: 'You resist the temptation.',
      good: 'It restores your spirit and grants a rare reward.',
    },
  },
  {
    id: 'hard-5',
    title: 'Raven Swarm',
    event: 'A storm of ravens circles above, screaming loudly.',
    outcomes: {
      bad: 'They attack — you lose a life.',
      neutral: 'You cover your head and wait.',
      good: 'They scatter, leaving a rare reward behind.',
    },
  },
  {
    id: 'hard-6',
    title: 'Frozen Stream',
    event: 'You step onto a frozen stream that cracks under your boots.',
    outcomes: {
      bad: 'The ice breaks — you lose a life.',
      neutral: 'You jump back in time.',
      good: 'You cross safely and gain a rare reward.',
    },
  },
  {
    id: 'hard-7',
    title: 'Haunted Gate',
    event: 'An ancient stone gate hums with strange energy.',
    outcomes: {
      bad: 'The gate lashes out — you lose a life.',
      neutral: 'You pass quickly.',
      good: 'The gate blesses you with a rare reward.',
    },
  },
  {
    id: 'hard-8',
    title: 'Poison Mist',
    event: 'A purple mist crawls between the trees toward you.',
    outcomes: {
      bad: 'You inhale it and fall — you lose a life.',
      neutral: 'You hold your breath and escape.',
      good: 'You find clean air and gain a rare reward.',
    },
  },
  {
    id: 'hard-9',
    title: 'Giant Spider Web',
    event: 'Sticky silver webs block the trail like curtains.',
    outcomes: {
      bad: 'You get caught — you lose a life.',
      neutral: 'You tear free and run.',
      good: 'You find treasure in the web and gain a rare reward.',
    },
  },
  {
    id: 'hard-10',
    title: 'Hidden Sinkhole',
    event: 'The ground looks normal… but feels hollow.',
    outcomes: {
      bad: 'You fall into a sinkhole — you lose a life.',
      neutral: 'You stop just in time.',
      good: 'You discover a hidden cache and gain a rare reward.',
    },
  },
  {
    id: 'hard-11',
    title: 'Wild Boar Charge',
    event: 'A wild boar bursts from the bushes, charging straight at you.',
    outcomes: {
      bad: 'It knocks you down — you lose a life.',
      neutral: 'You dodge at the last second.',
      good: 'It runs off, leaving a rare reward.',
    },
  },
  {
    id: 'hard-12',
    title: 'Broken Rope Bridge',
    event: 'A rope bridge swings violently over a deep ravine.',
    outcomes: {
      bad: 'The rope snaps — you lose a life.',
      neutral: 'You crawl across safely.',
      good: 'You reach the other side and gain a rare reward.',
    },
  },
  {
    id: 'hard-13',
    title: 'Witch’s Lantern',
    event: 'A floating lantern follows you, glowing brighter with every step.',
    outcomes: {
      bad: 'It explodes in your face — you lose a life.',
      neutral: 'It fades away quietly.',
      good: 'It reveals a hidden gift — rare reward.',
    },
  },
  {
    id: 'hard-14',
    title: 'The Howling Hollow',
    event: 'A hollow tree howls like a beast when you get close.',
    outcomes: {
      bad: 'It slams you with a shockwave — you lose a life.',
      neutral: 'You step away slowly.',
      good: 'You find something inside and gain a rare reward.',
    },
  },
  {
    id: 'hard-15',
    title: 'Mirror Lake',
    event: 'A lake reflects your face… but the reflection moves wrong.',
    outcomes: {
      bad: 'You panic and fall — you lose a life.',
      neutral: 'You look away and keep going.',
      good: 'The lake reveals a secret — rare reward.',
    },
  },
  {
    id: 'hard-16',
    title: 'Falling Stones',
    event: 'Stones start raining down from the cliff above.',
    outcomes: {
      bad: 'You get hit — you lose a life.',
      neutral: 'You hide under a ledge.',
      good: 'The stones uncover a stash — rare reward.',
    },
  },
  {
    id: 'hard-17',
    title: 'Thorn Whip Vines',
    event: 'Vines lash at you like whips as you pass.',
    outcomes: {
      bad: 'They cut deep — you lose a life.',
      neutral: 'You push through.',
      good: 'You slip past and gain a rare reward.',
    },
  },
  {
    id: 'hard-18',
    title: 'Shadow Knight',
    event: 'A dark armored figure blocks the path without a word.',
    outcomes: {
      bad: 'It strikes first — you lose a life.',
      neutral: 'You step around carefully.',
      good: 'It bows and grants a rare reward.',
    },
  },
  {
    id: 'hard-19',
    title: 'Berry Beast',
    event: 'A huge creature made of vines and berries roars nearby.',
    outcomes: {
      bad: 'It attacks — you lose a life.',
      neutral: 'It loses interest.',
      good: 'It drops a gift — rare reward.',
    },
  },
  {
    id: 'hard-20',
    title: 'Burning Path',
    event: 'The ground glows hot, like hidden embers under leaves.',
    outcomes: {
      bad: 'You burn your feet — you lose a life.',
      neutral: 'You hop across quickly.',
      good: 'You reach a safe spot and gain a rare reward.',
    },
  },
  {
    id: 'hard-21',
    title: 'Stormy Wind Wall',
    event: 'A wall of wind blocks your way like an invisible gate.',
    outcomes: {
      bad: 'It throws you back — you lose a life.',
      neutral: 'You wait until it calms.',
      good: 'It opens a path and grants a rare reward.',
    },
  },
  {
    id: 'hard-22',
    title: 'Ancient Trap Tiles',
    event: 'The ground is covered in strange stone tiles with symbols.',
    outcomes: {
      bad: 'A tile snaps and hurts you — you lose a life.',
      neutral: 'You step carefully and pass.',
      good: 'A hidden compartment opens — rare reward.',
    },
  },
  {
    id: 'hard-23',
    title: 'The Whispering Crown',
    event: 'A crown-shaped symbol glows on a tree trunk.',
    outcomes: {
      bad: 'It drains your strength — you lose a life.',
      neutral: 'You ignore it.',
      good: 'It blesses you — rare reward.',
    },
  },
  {
    id: 'hard-24',
    title: 'Wolf Pack Eyes',
    event: 'Glowing eyes appear in the darkness all around you.',
    outcomes: {
      bad: 'They attack — you lose a life.',
      neutral: 'You stand still until they vanish.',
      good: 'They leave behind a rare reward.',
    },
  },
  {
    id: 'hard-25',
    title: 'Deep Mud Trap',
    event: 'The ground turns into deep mud with every step.',
    outcomes: {
      bad: 'You sink and struggle — you lose a life.',
      neutral: 'You pull yourself out.',
      good: 'You find something shiny in the mud — rare reward.',
    },
  },
  {
    id: 'hard-26',
    title: 'Crystal Shards',
    event: 'Sharp crystals grow across the path like spikes.',
    outcomes: {
      bad: 'You get cut — you lose a life.',
      neutral: 'You carefully step through.',
      good: 'You collect a hidden prize — rare reward.',
    },
  },
  {
    id: 'hard-27',
    title: 'Hollow Bridge Collapse',
    event: 'A hollow log bridge creaks over a rushing river.',
    outcomes: {
      bad: 'It collapses — you lose a life.',
      neutral: 'You crawl across safely.',
      good: 'You find a hidden stash inside — rare reward.',
    },
  },
  {
    id: 'hard-28',
    title: 'The Witch’s Deal',
    event: 'A mysterious figure offers you “a shortcut”.',
    outcomes: {
      bad: 'It’s a trick — you lose a life.',
      neutral: 'You refuse and walk away.',
      good: 'You choose wisely and gain a rare reward.',
    },
  },
  {
    id: 'hard-29',
    title: 'Giant Berry Trap',
    event: 'A huge berry rolls downhill toward you like a boulder.',
    outcomes: {
      bad: 'It hits you hard — you lose a life.',
      neutral: 'You jump aside.',
      good: 'It cracks open, revealing a rare reward.',
    },
  },
  {
    id: 'hard-30',
    title: 'Royal Vault',
    event: 'You find a sealed royal vault hidden in vines.',
    outcomes: {
      bad: 'The lock shocks you — you lose a life.',
      neutral: 'It won’t open.',
      good: 'The vault opens and grants a rare reward.',
    },
  },
];
