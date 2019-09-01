export default {
  location: {
    worldName: 'Ghazzaland',
    world: 1,
    index: 2,
  },
  rom: {
    tilemap: [0x1B3E5C, 0x1B4AC3],
    oam: [0xE3CC0, 0xE3FAC],
    portals: [0xD4970, 0xD49A0],
  },
  tilemap: {
    totalStages: 3,
    height: 60,
    width: 300,
    scheme: [
      {
        name: 'grass',
        ids: [0x8F, 0x96, 0x99, 0x9A, 0x9B, 0x9C, 0x9D],
      },
      {
        name: 'rock',
        ids: [0x46, 0x51, 0x52, 0x53, 0x54, 0x55, 0x57, 0x5B, 0x5C, 0x5D, 0x5E, 0x5F, 0x60, 0x62, 0x63, 0x7B, 0x7D, 0x7E, 0x7F, 0x80, 0x81, 0x82, 0x86, 0x87, 0x89, 0x8C, 0x8D, 0x8E, 0x50, 0x90, 0x91, 0x92, 0x93, 0x94, 0x9E, 0xA3, 0xA7, 0xB2, 0xB6, 0xB8, 0xB9],
      },
      {
        name: 'lightRock',
        ids: [0x85, 0x8B, 0xA8, 0xA9, 0xAA, 0xAD, 0xAF, 0xB0, 0xB5, 0xB7, 0xBA, 0xBB, 0xBC, 0xBD, 0xC0],
      },
      {
        name: 'darkRock',
        ids: [0x40, 0x41, 0x42, 0x45, 0x44, 0x49, 0x4A, 0x4B, 0x4C, 0x4D, 0x4E, 0x4F, 0x56, 0x58, 0x64, 0x65, 0x67, 0x6A, 0x6C, 0x6E, 0x68, 0x69, 0x72, 0x77, 0x83, 0x98, 0x9F, 0xA0, 0xA1, 0xA2, 0xAB, 0xAC, 0xAE, 0xB3, 0xB4, 0xBF, 0xBE, 0xC1, 0xC2],
      },
      {
        name: 'wood',
        ids: [0x66, 0x6B, 0x6D, 0x73, 0x74, 0x75, 0x70, 0x76, 0x78],
      },
      {
        name: 'bridge',
        ids: [0x43, 0x47, 0x48, 0x7A, 0x7C, 0x88, 0x8A, 0x95, 0x97, 0xA4, 0xA5, 0xA6, 0xB1],
      },
      {
        name: 'bridgeRope',
        ids: [0x01, 0x02, 0x16, 0x17, 0x18, 0x1E, 0x1F, 0x20],
      },
      {
        name: 'board',
        ids: [0x03, 0x05, 0x06, 0x07, 0x08, 0x0A, 0x0D, 0x11, 0x13, 0x1A, 0x37, 0x38, 0x39, 0x3A],
      },
    ],
  }
}
