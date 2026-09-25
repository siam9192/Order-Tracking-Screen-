import Link from "next/link";
import type { Order } from "../types/order.type";

const statusStyles: Record<string, string> = {
  processing: "bg-blue-100 text-blue-700 ring-blue-200",
  shipped: "bg-cyan-100 text-cyan-700 ring-cyan-200",
  out_for_delivery: "bg-indigo-100 text-indigo-700 ring-indigo-200",
  delayed: "bg-amber-100 text-amber-700 ring-amber-200",
  delivered_not_received: "bg-violet-100 text-violet-700 ring-violet-200",
  delivered: "bg-emerald-100 text-emerald-700 ring-emerald-200",
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);

export default function OrderCard({ order }: { order: Order }) {
  const statusClass =
    statusStyles[order.status] ?? "bg-slate-100 text-slate-700 ring-slate-200";

  return (
    <article className="overflow-hidden rounded-[28px] border border-blue-100 bg-white/85 shadow-[0_20px_60px_-30px_rgba(37,99,235,0.35)] backdrop-blur-sm">
      <div className="flex flex-col gap-5 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 items-center gap-4">
          <img
            src={order.product.image}
            alt={order.product.name}
            className="h-24 w-24 rounded-2xl object-cover shadow-sm ring-1 ring-blue-100"
          />

          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                {order.id}
              </span>
              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${statusClass}`}
              >
                {order.statusLabel}
              </span>
            </div>

            <h2 className="truncate text-lg font-semibold text-slate-900 sm:text-xl">
              {order.product.name}
            </h2>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
              <span>Qty: {order.product.quantity}</span>
              <span>•</span>
              <span>Ordered {formatDate(order.orderDate)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:min-w-[220px]">
          <div className="rounded-2xl bg-blue-50/80 px-4 py-3 ring-1 ring-blue-100">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-blue-600">
              Delivery
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {order.estimatedDeliveryTime
                ? `Est. ${order.estimatedDelivery} · ${order.estimatedDeliveryTime}`
                : `Est. ${order.estimatedDelivery}`}
            </p>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Total
              </p>
              <p className="text-xl font-bold text-slate-900">
                {formatPrice(order.total)}
              </p>
            </div>

            <Link href={`/${order.id}`}>
              <button className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">
                View Order
              </button>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
