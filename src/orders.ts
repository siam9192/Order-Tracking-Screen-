import { OrderIssue, OrderStatus, type Order } from "./types/order.type";

const orders: Order[] = [
  {
    id: "ORD-10001",
    status: OrderStatus.Shipped,
    issue: OrderIssue.Delayed,
    trackingTimeline: [
      {
        status: OrderStatus.Processing,
        timestamp: "2026-09-23T12:00:00Z",
        description: "Order confirmed and prepared for shipment",
      },
      {
        status: OrderStatus.Shipped,
        timestamp: "2026-09-24T09:30:00Z",
        description: "Package handed to the carrier",
      },
    ],
    orderDate: "2026-09-23T10:30:00Z",
    estimatedDelivery: "2026-09-28",
    newEstimatedDelivery: "2026-09-30",
    product: {
      name: "Wireless Bluetooth Headphones",
      quantity: 1,
      price: 2499,
      currency: "BDT",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRYH8U7SSLk83fVS3HJejWUeQnYYarNUHP3BqYh57qXQ&s=10",
    },
    total: 2499,
  },
  {
    id: "ORD-10002",
    status: OrderStatus.Delivered,
    trackingTimeline: [
      {
        status: OrderStatus.Processing,
        timestamp: "2026-09-18T10:00:00Z",
        description: "Order confirmed",
      },
      {
        status: OrderStatus.Shipped,
        timestamp: "2026-09-20T08:20:00Z",
        description: "Package handed to the carrier",
      },
      {
        status: OrderStatus.OutForDelivery,
        timestamp: "2026-09-24T09:00:00Z",
        description: "Courier is delivering your package",
      },
      {
        status: OrderStatus.Delivered,
        timestamp: "2026-09-24T15:30:00Z",
        description: "Package delivered",
      },
    ],
    orderDate: "2026-09-18T08:10:00Z",
    estimatedDelivery: "2026-09-24",
    deliveredAt: "2026-09-24T15:30:00Z",
    product: {
      name: "Portable Bluetooth Speaker",
      quantity: 1,
      price: 1899,
      currency: "BDT",
      image: "https://assets.gadgetandgear.com/upload/media/jbl/jbl-xtreme-5-blue.jpeg",
    },
    total: 1899,
  },
  
  {
    id: "ORD-10003",
    status: OrderStatus.Processing,
    trackingTimeline: [],
    orderDate: "2026-09-20T09:15:00Z",
    estimatedDelivery: "2026-09-30",
    product: {
      name: "Smart Watch Series 5",
      quantity: 1,
      price: 6500,
      currency: "BDT",
      image: "https://www.ryans.com/storage/products/main/apple-watch-series-5-44mm-space-gray-aluminum-11571901540.webp",
    },
    total: 6500,
  },
];

export default orders;
