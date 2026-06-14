// Verified, free-to-use educational images (Pexels). Each URL was checked to
// load and to match the described subject so lessons render attractive,
// relevant pictures for young learners.
const px = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1200`;

export const IMG = {
  skyBlue: px(912110), // blue sky with white clouds
  mountainSnow: px(2086621), // tall snowy mountain
  greenValley: px(414122), // green mountains and valley
  waterfall: px(358457), // waterfall in a green forest
  childQuran: px(8164742), // child reading the Qur'an on a stand
  bookshelf: px(207662), // shelves full of books
  childBooks: px(261895), // young child looking at books
  grandMosque: px(1537086), // Sheikh Zayed Grand Mosque
  cat: px(1170986), // friendly orange cat
  dog: px(2253275), // happy golden dog
  puppies: px(1108099), // two puppies among flowers
  chickens: px(1769279), // farm chickens
  butterflies: px(326055), // butterflies in a forest
  lantern: px(2233416), // glowing lantern at night
  elephant: px(982021), // elephant in green nature
  elephantSunset: px(1054655), // elephant at sunset
  plantBulb: px(1108572), // small green plant growing
  sea: px(2049422), // sea waves on rocks
} as const;
