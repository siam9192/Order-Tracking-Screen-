export enum OrderStatus {
  Processing = "processing",
  Shipped = "shipped",
  OutForDelivery = "out_for_delivery",
  Delayed = "delayed",
  DeliveredNotReceived = "delivered_not_received",
  Delivered = "delivered",
}

export enum OrderStatusLabel {
  Processing = "Processing",
  Shipped = "Shipped",
  OutForDelivery = "Out for Delivery",
  Delayed = "Delivery Delayed",
  DeliveredNotReceived = "Delivered but Not Received",
  Delivered = "Delivered",
}

export type OrderProduct = {
  name: string;
  quantity: number;
  price: number;
  currency: string;
  image: string;
};

export type Order = {
  id: string;
  status: OrderStatus;
  statusLabel: OrderStatusLabel;
  orderDate: string;
  estimatedDelivery: string;
  estimatedDeliveryTime?: string;
  newEstimatedDelivery?: string;
  deliveredAt?: string;
  product: OrderProduct;
  total: number;
};
