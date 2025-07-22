export const sortUserMethods = {
  none: { method: () => null },
  "fullname(A-Z)": {
    method: (a, b) =>
      a.fullname < b.fullname ? -1 : a.fullname > b.fullname ? 1 : 0,
  },
  "fullname(Z-A)": {
    method: (a, b) =>
      a.fullname > b.fullname ? -1 : a.fullname < b.fullname ? 1 : 0,
  },
  "createdAt(Asc)": {
    method: (a, b) =>
      a.createdAt < b.createdAt ? -1 : a.createdAt > b.createdAt ? 1 : 0,
  },
  "createdAt(Desc)": {
    method: (a, b) =>
      a.createdAt > b.createdAt ? -1 : a.createdAt < b.createdAt ? 1 : 0,
  },
};

export const sortRoomMethods = {
  none: { method: () => null },
  "roomType(A-Z)": {
    method: (a, b) =>
      a.roomType < b.roomType ? -1 : a.roomType > b.roomType ? 1 : 0,
  },
  "roomType(Z-A)": {
    method: (a, b) =>
      a.roomType > b.roomType ? -1 : a.roomType < b.roomType ? 1 : 0,
  },
  "roomPrice(L-H)": {
    method: (a, b) =>
      a.roomPrice < b.roomPrice ? -1 : a.roomPrice > b.roomPrice ? 1 : 0,
  },
  "roomPrice(H-L)": {
    method: (a, b) =>
      a.roomPrice > b.roomPrice ? -1 : a.roomPrice < b.roomPrice ? 1 : 0,
  },
  "roomCapacity(L-H)": {
    method: (a, b) =>
      a.roomCapacity < b.roomCapacity
        ? -1
        : a.roomCapacity > b.roomCapacity
        ? 1
        : 0,
  },
  "roomCapacity(H-L)": {
    method: (a, b) =>
      a.roomCapacity > b.roomCapacity
        ? -1
        : a.roomCapacity < b.roomCapacity
        ? 1
        : 0,
  },
};
