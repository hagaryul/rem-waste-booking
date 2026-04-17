export type BookingData = {
  postcode: string;
  addressId: string;
  addressLabel: string;
  generalWaste: boolean;
  heavyWaste: boolean;
  plasterboard: boolean;
  plasterboardOption: string | null;
  skipSize: string;
  price: number;
};
