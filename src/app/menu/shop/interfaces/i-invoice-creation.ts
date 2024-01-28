export interface IInvoiceCreation {
  price: number;
  currency: string,
  orderId: string;
  itemDesc: string;
  notificationUrl: string;
  redirectUrl: string;
}
