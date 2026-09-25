export enum OrderStatus {
  Processing = "processing",
  Shipped = "shipped",
  OutForDelivery = "out_for_delivery",
  Delivered = "delivered",
}

export enum OrderIssue {
  Delayed = "delayed",
  DeliveredNotReceived = "delivered_not_received",
}

export type OrderProduct = {
  name: string;
  quantity: number;
  price: number;
  currency: string;
  image: string;
};

export type TrackingTimelineEntry = {
  status: OrderStatus;
  timestamp: string;
  description?: string;
};

export type Order = {
  id: string;

  // Actual delivery status
  status: OrderStatus;

  // Special situation reported by the system/customer
  issue?: OrderIssue;

  // An empty timeline means tracking information is not available yet
  trackingTimeline: TrackingTimelineEntry[];

  orderDate: string;

  // Normal estimated delivery
  estimatedDelivery?: string;
  estimatedDeliveryTime?: string;

  // Used when the order is delayed
  newEstimatedDelivery?: string;

  // Used when the order has been delivered
  deliveredAt?: string;

  product: OrderProduct;

  total: number;
};
