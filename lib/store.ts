export const bookingStore = {
  usedBookings: new Set<string>(),
  bs14djCallCount: 0,
  reset() {
    this.usedBookings = new Set();
    this.bs14djCallCount = 0;
  },
};
