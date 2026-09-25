import OrderCard from "../components/OrderCard";
import orders from "../orders";
import { Order } from "../types/order.type";

export default function Home() {
  return (
    <main className="min-h-screen px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">
              Tracking
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
              My Orders
            </h1>
          </div>
          <button className="hidden rounded-full border border-blue-200 bg-white/90 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 sm:inline-flex">
            View all
          </button>
        </div>

        <div className="space-y-5">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order as Order} />
          ))}
        </div>
      </div>
    </main>
  );
}
