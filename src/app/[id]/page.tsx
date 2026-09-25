"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import orders from "../../orders";
import { OrderIssue, OrderStatus, type Order } from "../../types/order.type";

const statusStyles: Record<OrderStatus, string> = {
  [OrderStatus.Processing]: "bg-blue-100 text-blue-700 ring-blue-200",
  [OrderStatus.Shipped]: "bg-cyan-100 text-cyan-700 ring-cyan-200",
  [OrderStatus.OutForDelivery]: "bg-indigo-100 text-indigo-700 ring-indigo-200",
  [OrderStatus.Delivered]: "bg-emerald-100 text-emerald-700 ring-emerald-200",
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);

const getTimelineState = (order: Order) => {
  const entriesByStatus = new Map(
    order.trackingTimeline.map((entry) => [entry.status, entry]),
  );
  return [
    {
      label: "Order Placed",
      active: true,
      date: formatDate(order.orderDate),
      description: undefined,
    },
    ...[
      { status: OrderStatus.Processing, label: "Processing" },
      { status: OrderStatus.Shipped, label: "Shipped" },
      { status: OrderStatus.OutForDelivery, label: "Out for Delivery" },
      { status: OrderStatus.Delivered, label: "Delivered" },
    ].map(({ status, label }) => {
      const entry = entriesByStatus.get(status);
      return {
        label,
        active: Boolean(entry),
        date: entry ? formatDateTime(entry.timestamp) : "Pending",
        description: entry?.description,
      };
    }),
  ];
};

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [currentOrder, setCurrentOrder] = useState<Order | undefined>(() =>
    orders.find((item) => item.id === id),
  );
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  useEffect(() => {
    setCurrentOrder(orders.find((item) => item.id === id));
  }, [id]);

  if (!currentOrder) {
    return (
      <main className="min-h-screen bg-[#f5f9ff] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[28px] border border-blue-100 bg-white p-8 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">
            Order not found
          </p>
          <h1 className="mt-3 text-2xl font-bold text-slate-900">
            We couldn&apos;t find that order.
          </h1>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Back to orders
          </Link>
        </div>
      </main>
    );
  }

  const order = currentOrder;
  const isDelivered =
    order.status === OrderStatus.Delivered &&
    order.issue !== OrderIssue.DeliveredNotReceived;
  const isDelayed = order.issue === OrderIssue.Delayed;
  const isNotReceived = order.issue === OrderIssue.DeliveredNotReceived;
  const isTrackingUnavailable = order.trackingTimeline.length === 0;

  const handleConfirmNotReceived = () => {
    setCurrentOrder((previousOrder) => {
      if (!previousOrder) {
        return previousOrder;
      }

      return {
        ...previousOrder,
        issue: OrderIssue.DeliveredNotReceived,
        status: OrderStatus.Delivered,
        deliveredAt: previousOrder.deliveredAt ?? new Date().toISOString(),
      };
    });
    setIsConfirmationOpen(false);
  };

  const statusClass =
    order.issue === OrderIssue.Delayed
      ? "bg-amber-100 text-amber-700 ring-amber-200"
      : order.issue === OrderIssue.DeliveredNotReceived
        ? "bg-violet-100 text-violet-700 ring-violet-200"
        : isTrackingUnavailable
          ? "bg-slate-100 text-slate-700 ring-slate-200"
          : (statusStyles[order.status] ??
            "bg-slate-100 text-slate-700 ring-slate-200");

  const alertConfig = isDelayed
    ? {
        tone: "amber",
        title: "Delivery Delayed",
        subtitle: "Your order is taking longer than expected.",
        badge: "Delayed",
      }
    : isNotReceived
      ? {
          tone: "violet",
          title: "Package Not Received",
          subtitle:
            "Our system shows that your order was delivered, but you haven't received it.",
          badge: "Issue",
        }
      : isDelivered
        ? {
            tone: "emerald",
            title: "Order Delivered",
            subtitle:
              "Your delivery was completed successfully. If you did not receive it, report it below.",
            badge: "Delivered",
          }
        : {
            tone: "blue",
            title: "Tracking Not Available Yet",
            subtitle:
              "Your order has been confirmed, but tracking information isn't available yet.",
            badge: "Awaiting update",
          };

  const timeline = getTimelineState(order);

  const actions = isDelayed
    ? [
        { label: "Contact Support", primary: true },
        { label: "Report Delivery Issue", primary: false },
      ]
    : isNotReceived
      ? [
          { label: "Report Delivery Issue", primary: true },
          { label: "Contact Support", primary: false },
          { label: "View Delivery Details", primary: false },
        ]
      : [
          { label: "View Order Details", primary: true },
          { label: "Contact Support", primary: false },
        ];

  return (
    <main className="min-h-screen bg-[#f5f9ff] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-50"
        >
          ← Back to orders
        </Link>

        <div className="overflow-hidden rounded-[28px] border border-blue-100 bg-white">
          <div className="border-b border-blue-100 bg-white px-6 py-6 sm:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-600">
                  Order details
                </p>
                <h1 className="mt-2 text-3xl font-bold text-slate-900">
                  {order.id}
                </h1>
              </div>
              <span
                className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${statusClass}`}
              >
                {isDelayed
                  ? "Delivery Delayed"
                  : isNotReceived
                    ? "Package Not Received"
                    : isTrackingUnavailable
                      ? "Tracking Not Available"
                      : isDelivered
                        ? "Delivered"
                        : order.status}
              </span>
            </div>
          </div>

          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <div
                className={`rounded-2xl border p-5 ${
                  alertConfig.tone === "amber"
                    ? "border-amber-200 bg-amber-50"
                    : alertConfig.tone === "violet"
                      ? "border-violet-200 bg-violet-50"
                      : alertConfig.tone === "emerald"
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-blue-200 bg-blue-50"
                }`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p
                      className={`text-xs font-semibold uppercase tracking-[0.2em] ${
                        alertConfig.tone === "amber"
                          ? "text-amber-700"
                          : alertConfig.tone === "violet"
                            ? "text-violet-700"
                            : alertConfig.tone === "emerald"
                              ? "text-emerald-700"
                              : "text-blue-700"
                      }`}
                    >
                      {alertConfig.badge}
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-900">
                      {alertConfig.title}
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                      {alertConfig.subtitle}
                    </p>
                  </div>

                  {isDelayed ? (
                    <div className="rounded-xl bg-white/80 px-4 py-3 text-left ring-1 ring-amber-200">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                        Original estimate
                      </p>
                      <p className="mt-1 text-base font-semibold text-slate-900">
                        {order.estimatedDelivery}
                      </p>
                    </div>
                  ) : isNotReceived ? (
                    <div className="rounded-xl bg-white/80 px-4 py-3 text-left ring-1 ring-violet-200">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                        Delivered on
                      </p>
                      <p className="mt-1 text-base font-semibold text-slate-900">
                        {order.deliveredAt
                          ? formatDateTime(order.deliveredAt)
                          : "Not available"}
                      </p>
                    </div>
                  ) : isDelivered ? (
                    <div className="rounded-xl bg-white/80 px-4 py-3 text-left ring-1 ring-emerald-200">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                        Delivered on
                      </p>
                      <p className="mt-1 text-base font-semibold text-slate-900">
                        {order.deliveredAt
                          ? formatDateTime(order.deliveredAt)
                          : "Not available"}
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-xl bg-white/80 px-4 py-3 text-left ring-1 ring-blue-200">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                        Est. delivery
                      </p>
                      <p className="mt-1 text-base font-semibold text-slate-900">
                        {order.estimatedDelivery ?? "TBD"}
                      </p>
                    </div>
                  )}
                </div>

                {(isDelayed ||
                  isNotReceived ||
                  isTrackingUnavailable ||
                  isDelivered) && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    {isDelayed && (
                      <>
                        <div className="rounded-xl bg-white/80 px-3 py-2 ring-1 ring-amber-200">
                          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                            Original ETA
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-900">
                            {order.estimatedDelivery}
                          </p>
                        </div>
                        <div className="rounded-xl bg-white/80 px-3 py-2 ring-1 ring-amber-200">
                          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                            New ETA
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-900">
                            {order.newEstimatedDelivery ?? "Awaiting update"}
                          </p>
                        </div>
                      </>
                    )}

                    {isDelivered && (
                      <div className="rounded-xl bg-white/80 px-3 py-2 ring-1 ring-emerald-200">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                          Delivery status
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          Package delivered and verified
                        </p>
                      </div>
                    )}

                    {isNotReceived && (
                      <div className="rounded-xl bg-white/80 px-3 py-2 ring-1 ring-violet-200">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                          Status conflict
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          Delivery marked as complete, but item not received
                        </p>
                      </div>
                    )}

                    {isTrackingUnavailable && (
                      <div className="rounded-xl bg-white/80 px-3 py-2 ring-1 ring-blue-200">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                          Tracking will appear
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          once the package is shipped
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:flex-row">
                <img
                  src={order.product.image}
                  alt={order.product.name}
                  className="h-28 w-28 rounded-2xl object-cover ring-1 ring-blue-100"
                />

                <div className="flex-1">
                  <p className="text-sm font-medium uppercase tracking-[0.15em] text-slate-500">
                    Product
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900">
                    {order.product.name}
                  </h2>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                    <span>Qty: {order.product.quantity}</span>
                    <span>•</span>
                    <span>{formatPrice(order.product.price)} each</span>
                  </div>
                </div>
              </div>

              {order.trackingTimeline.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="mb-5 flex items-center justify-between">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                      Delivery timeline
                    </p>
                    <span className="text-sm font-medium text-blue-600">
                      {isDelayed
                        ? "Shipped"
                        : isNotReceived || isDelivered
                          ? "Delivered"
                          : "In transit"}
                    </span>
                  </div>

                  <div>
                    {timeline.map((step, index) => (
                      <div
                        key={step.label}
                        className="relative flex gap-4 pb-6 last:pb-0"
                      >
                        {index < timeline.length - 1 && (
                          <span
                            className={`absolute left-[7px] top-3 h-full w-px ${step.active ? "bg-blue-300" : "bg-slate-200"}`}
                            aria-hidden="true"
                          />
                        )}
                        <span
                          className={`relative z-10 mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 border-white ring-1 ${
                            step.active
                              ? "bg-blue-600 ring-blue-600"
                              : "bg-slate-200 ring-slate-300"
                          }`}
                        />
                        <div className="min-w-0">
                          <p
                            className={`text-sm font-medium ${step.active ? "text-slate-900" : "text-slate-400"}`}
                          >
                            {step.label}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {step.date}
                          </p>
                          {step.description && (
                            <p className="mt-1 text-sm text-slate-600">
                              {step.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                    Ordered
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {formatDate(order.orderDate)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                    {isNotReceived
                      ? "Delivered"
                      : isDelayed
                        ? "Updated ETA"
                        : isDelivered
                          ? "Delivered"
                          : "Estimated delivery"}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {isNotReceived
                      ? order.deliveredAt
                        ? formatDateTime(order.deliveredAt)
                        : "Not available"
                      : isDelayed
                        ? (order.newEstimatedDelivery ??
                          order.estimatedDelivery)
                        : isDelivered
                          ? order.deliveredAt
                            ? formatDateTime(order.deliveredAt)
                            : "Not available"
                          : (order.estimatedDelivery ?? "TBD")}
                  </p>
                </div>
              </div>
            </div>

            <aside className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-blue-600">
                Summary
              </p>

              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Discount</span>
                  <span>− {formatPrice(0)}</span>
                </div>

                <div className="my-4 h-px bg-blue-200" />

                <div className="flex items-center justify-between text-lg font-bold text-slate-900">
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {isDelivered && (
                  <button
                    type="button"
                    onClick={() => setIsConfirmationOpen(true)}
                    className="w-full rounded-full bg-amber-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-600"
                  >
                    Did not receive the order?
                  </button>
                )}

                {actions.map((action) => (
                  <button
                    key={action.label}
                    className={`w-full rounded-full px-4 py-3 text-sm font-semibold transition ${
                      action.primary
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "border border-blue-200 bg-white text-blue-700 hover:bg-blue-50"
                    }`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </aside>
          </div>
        </div>

        {isConfirmationOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
            <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
                Confirmation needed
              </p>
              <h3 className="mt-3 text-2xl font-bold text-slate-900">
                Did you receive this order?
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Confirming will mark this order as delivered but not received
                and update the issue state to match the report.
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsConfirmationOpen(false)}
                  className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmNotReceived}
                  className="flex-1 rounded-full bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
