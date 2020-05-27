const _playerDictionary = {
  // FODL A
  "My Q's, DJ": "DJ My Q's",
  "Cat, Lazer": "Lazer Cat",
  "Surgeon, The": "The Surgeon",
  "Author, The": "The Author",
  "Dilly, Dilly": "Dilly Dilly",
  "Degrubs, Degrubs": "Degrubs",
  "Criminal, The": "The Criminal",
  "Accountant, The": "The Accountant",
  "Le, Pepe": "Pepe Le",
  "TheChud, Bud": "Bud The Chud",

  // FODL B
  "Nooch, The": "The Nooch",
  "Train, The": "The Train",
  "Madhouse, Madhouse": "MADhouse",
  "Rascal, Red": "Red Rascal",
  "Jig, The": "The Jig",
  "Slinger, Shenendoah": "Shenandoah Slinger",
  "T, Triple": "Triple T",
  "Toaster, Tungsten": "Toaster",
  "Radar, Radar": "Radar",
  "Lush, The": "The Lush",

  // FODL C
  "Darter, Deadhead": "Deadhead Darter",
  "Kid, Cali": "Cali Kid",
  "Cannoli, Unholy": "Unholy Cannoli",
  "Pappy, Slappy": "Slappy Pappy",
  "Alky, Alky": "Alky",
  "Outlander, The": "Outlander",
  "Corky, Uncle": "Uncle Corky",
  "McGooch, Scooter": "Scooter McGooch",
  "5, Blademau": "Blademau5",
  "Boy, Dough": "Doughboy",
  "Case, Josh": "Doughboy", // SHIT WHO IS THAT MASKED MAN

  // FODL D
  "Madman, Music City": "Music City Madman",
  "Boy, Bar": "Bar-Boy",
  "Attack, Mac": "Mac Attack",
  "Cleaner, The": "The Cleaner",
  "Feelgood, Dr.": "Dr. Feelgood",
  "Easy, Beef": "Beef Easy",
  "South, Darty": "Darty South",
  "Law, The": "The Law",
  "Packman, Mr.": "Mr. Packman",
  "Fires, Liberty": "Liberty Fires",
};

const playerLookup = (dcLeagueName) => {
  if (_playerDictionary[dcLeagueName]) {
    return _playerDictionary[dcLeagueName];
  }

  console.error("unknown name, Kylf should fix this:", dcLeagueName);
  return "Unknown";
};

module.exports = playerLookup;
