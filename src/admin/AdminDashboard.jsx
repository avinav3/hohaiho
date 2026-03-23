import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  CarFront,
  CreditCard,
  BadgeDollarSign,
  Activity,
  FileBarChart2,
  TrendingUp,
  Layers3,
  WalletCards,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import Sidebar from "./Sidebar";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Line,
  Legend,
} from "recharts";
import AdminAuth from "./AdminAuth";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config/apiConfig";

const toTitleCase = (str = "") =>
  String(str)
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const parseDecimal = (value) => {
  if (value && typeof value === "object" && "$numberDecimal" in value) {
    return Number(value.$numberDecimal);
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const parseDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatAmount = (value) => {
  const number = parseDecimal(value);
  return number.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

const formatCompactAmount = (value) => {
  const number = parseDecimal(value);
  return new Intl.NumberFormat(undefined, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(number);
};

const formatDate = (value) => {
  const date = parseDate(value);
  if (!date) return "—";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStatusTone = (status = "") => {
  const normalized = String(status).toLowerCase();

  if (
    ["active", "available", "approved", "confirmed", "completed", "paid"].some(
      (word) => normalized.includes(word),
    )
  ) {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  if (
    ["pending", "processing", "review"].some((word) =>
      normalized.includes(word),
    )
  ) {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  if (
    ["cancelled", "canceled", "failed", "rejected", "inactive"].some((word) =>
      normalized.includes(word),
    )
  ) {
    return "bg-rose-50 text-rose-700 border-rose-200";
  }

  return "bg-slate-100 text-slate-700 border-slate-200";
};

function AdminDashboard() {
  const [listings, setListings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [revenueWindow, setRevenueWindow] = useState(6);
  const [revenueMetric, setRevenueMetric] = useState("total");
  const navigate = useNavigate();

  const fetchDashboardData = useCallback(async ({ silent = false } = {}) => {
    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const [listingsResponse, transactionsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/listings/listings`),
        fetch(`${API_BASE_URL}/payments`),
      ]);

      if (!listingsResponse.ok || !transactionsResponse.ok) {
        throw new Error("Failed to load dashboard data.");
      }

      const [listingsData, transactionsData] = await Promise.all([
        listingsResponse.json(),
        transactionsResponse.json(),
      ]);

      const normalizedListings = Array.isArray(listingsData)
        ? listingsData.map((listing) => ({
            ...listing,
            price: parseDecimal(listing.price),
          }))
        : [];

      const normalizedTransactions = Array.isArray(transactionsData)
        ? transactionsData.map((transaction) => ({
            ...transaction,
            amount: parseDecimal(transaction.amount),
          }))
        : [];

      setListings(normalizedListings);
      setTransactions(normalizedTransactions);
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Something went wrong while loading the dashboard.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const filteredListings = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return listings;

    return listings.filter((listing) =>
      [
        listing.make,
        listing.model,
        listing.carType,
        listing.listing_status,
        listing._id,
        listing.id,
      ]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(keyword)),
    );
  }, [listings, search]);

  const filteredTransactions = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return transactions;

    return transactions.filter((transaction) =>
      [
        transaction.transaction_id,
        transaction.user_id,
        transaction.payment_method,
        transaction.status,
        transaction._id,
        transaction.id,
      ]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(keyword)),
    );
  }, [transactions, search]);

  const dashboardStats = useMemo(() => {
    const totalListings = listings.length;

    const activeListings = listings.filter((listing) => {
      const status = String(listing.listing_status || "").toLowerCase();
      return ["active", "available", "approved"].some((word) =>
        status.includes(word),
      );
    }).length;

    const totalTransactions = transactions.length;

    const totalTransactionVolume = transactions.reduce(
      (sum, transaction) => sum + parseDecimal(transaction.amount),
      0,
    );

    const averageListingPrice = totalListings
      ? listings.reduce(
          (sum, listing) => sum + parseDecimal(listing.price),
          0,
        ) / totalListings
      : 0;

    return {
      totalListings,
      activeListings,
      totalTransactions,
      totalTransactionVolume,
      averageListingPrice,
    };
  }, [listings, transactions]);

  const monthlyRevenueData = useMemo(() => {
    const now = new Date();

    const monthTemplate = Array.from({ length: revenueWindow }, (_, index) => {
      const offset = revenueWindow - 1 - index;
      const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);

      return {
        key: `${date.getFullYear()}-${date.getMonth()}`,
        date,
        name: date.toLocaleDateString(undefined, {
          month: "short",
          year: revenueWindow > 6 ? "2-digit" : undefined,
        }),
        total: 0,
        count: 0,
      };
    });

    const monthMap = monthTemplate.reduce((acc, month) => {
      acc[month.key] = month;
      return acc;
    }, {});

    filteredTransactions.forEach((transaction) => {
      const date = parseDate(transaction.date_of_payment);
      if (!date) return;

      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (!monthMap[key]) return;

      monthMap[key].total += parseDecimal(transaction.amount);
      monthMap[key].count += 1;
    });

    let cumulative = 0;

    return monthTemplate.map((month) => {
      cumulative += month.total;

      return {
        ...month,
        average: month.count ? month.total / month.count : 0,
        cumulative,
      };
    });
  }, [filteredTransactions, revenueWindow]);

  const revenueSummary = useMemo(() => {
    if (!monthlyRevenueData.length) {
      return {
        total: 0,
        transactionCount: 0,
        averagePerMonth: 0,
        averagePerTransaction: 0,
        peakMonth: null,
        growth: null,
      };
    }

    const total = monthlyRevenueData.reduce((sum, item) => sum + item.total, 0);
    const transactionCount = monthlyRevenueData.reduce(
      (sum, item) => sum + item.count,
      0,
    );
    const averagePerMonth = total / monthlyRevenueData.length;
    const averagePerTransaction = transactionCount
      ? total / transactionCount
      : 0;

    const peakMonth = monthlyRevenueData.reduce((max, item) =>
      item.total > max.total ? item : max,
    );

    const latest = monthlyRevenueData[monthlyRevenueData.length - 1];
    const previous = monthlyRevenueData[monthlyRevenueData.length - 2];

    let growth = null;
    if (latest && previous && previous.total > 0) {
      growth = ((latest.total - previous.total) / previous.total) * 100;
    }

    return {
      total,
      transactionCount,
      averagePerMonth,
      averagePerTransaction,
      peakMonth,
      growth,
    };
  }, [monthlyRevenueData]);

  const listingTypeData = useMemo(() => {
    const grouped = filteredListings.reduce((acc, listing) => {
      const key = listing.carType ? toTitleCase(listing.carType) : "Unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const total = Object.values(grouped).reduce((sum, value) => sum + value, 0);

    return Object.entries(grouped)
      .map(([name, value]) => ({
        name,
        value,
        share: total ? (value / total) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [filteredListings]);

  const paymentMethodData = useMemo(() => {
    const grouped = filteredTransactions.reduce((acc, transaction) => {
      const key = transaction.payment_method
        ? toTitleCase(transaction.payment_method)
        : "Unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const total = Object.values(grouped).reduce((sum, value) => sum + value, 0);

    return Object.entries(grouped)
      .map(([name, value]) => ({
        name,
        value,
        share: total ? (value / total) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [filteredTransactions]);

  const recentListings = useMemo(() => {
    return [...filteredListings]
      .sort((a, b) => {
        const first = parseDate(a.createdAt)?.getTime() || 0;
        const second = parseDate(b.createdAt)?.getTime() || 0;
        return second - first;
      })
      .slice(0, 6);
  }, [filteredListings]);

  const recentTransactions = useMemo(() => {
    return [...filteredTransactions]
      .sort((a, b) => {
        const first = parseDate(a.date_of_payment)?.getTime() || 0;
        const second = parseDate(b.date_of_payment)?.getTime() || 0;
        return second - first;
      })
      .slice(0, 6);
  }, [filteredTransactions]);

  const chartPalette = ["#0f172a", "#334155", "#64748b", "#94a3b8", "#cbd5e1"];

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-6 lg:p-8">
          <div className="mb-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 p-6 text-white shadow-xl">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm text-slate-300">Admin Overview</p>
                <h1 className="mt-1 text-3xl font-bold tracking-tight">
                  Dashboard
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-300">
                  The charts are now based on richer real-data aggregation:
                  monthly totals, cumulative revenue, transaction counts,
                  payment mix, and listing composition.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative min-w-[260px]">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search listings or transactions"
                    className="w-full rounded-2xl border border-white/10 bg-white/10 py-3 pl-11 pr-4 text-sm text-white placeholder:text-slate-300 outline-none backdrop-blur focus:border-white/30"
                  />
                </div>

                <button
                  onClick={() => fetchDashboardData({ silent: true })}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/15"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                  />
                  Refresh
                </button>

                <button
                  onClick={() => navigate("/ReportDesign")}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  <FileBarChart2 className="h-4 w-4" />
                  Generate Report
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm">
              {error}
            </div>
          )}

          <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Listings"
              value={dashboardStats.totalListings}
              icon={CarFront}
              subtitle="Live count from listings API"
            />
            <StatCard
              title="Active Listings"
              value={dashboardStats.activeListings}
              icon={Activity}
              subtitle="Based on listing status"
            />
            <StatCard
              title="Transactions"
              value={dashboardStats.totalTransactions}
              icon={CreditCard}
              subtitle="Live count from payments API"
            />
            <StatCard
              title="Transaction Volume"
              value={formatAmount(dashboardStats.totalTransactionVolume)}
              icon={BadgeDollarSign}
              subtitle="Sum of recorded amounts"
            />
          </div>

          <div className="mb-6 grid gap-6 xl:grid-cols-3">
            <Panel
              title="Revenue Intelligence"
              subtitle="Monthly totals, cumulative trend, and transaction volume from real payments"
              className="xl:col-span-2"
            >
              <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 xl:gap-4">
                  <MiniInsightCard
                    label="Window revenue"
                    value={formatCompactAmount(revenueSummary.total)}
                    icon={TrendingUp}
                  />
                  <MiniInsightCard
                    label="Peak month"
                    value={revenueSummary.peakMonth?.name || "—"}
                    helper={
                      revenueSummary.peakMonth
                        ? formatCompactAmount(revenueSummary.peakMonth.total)
                        : "No data"
                    }
                    icon={ArrowUpRight}
                  />
                  <MiniInsightCard
                    label="Avg / month"
                    value={formatCompactAmount(revenueSummary.averagePerMonth)}
                    icon={Layers3}
                  />
                  <MiniInsightCard
                    label="Avg / txn"
                    value={formatCompactAmount(
                      revenueSummary.averagePerTransaction,
                    )}
                    icon={WalletCards}
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="inline-flex rounded-2xl bg-slate-100 p-1">
                    {[6, 12].map((value) => (
                      <button
                        key={value}
                        onClick={() => setRevenueWindow(value)}
                        className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                          revenueWindow === value
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        {value}M
                      </button>
                    ))}
                  </div>

                  <div className="inline-flex rounded-2xl bg-slate-100 p-1">
                    {[
                      { key: "total", label: "Revenue" },
                      { key: "cumulative", label: "Cumulative" },
                    ].map((option) => (
                      <button
                        key={option.key}
                        onClick={() => setRevenueMetric(option.key)}
                        className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                          revenueMetric === option.key
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {monthlyRevenueData.length ? (
                <div className="h-[360px] rounded-3xl bg-slate-50 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={monthlyRevenueData}>
                      <defs>
                        <linearGradient
                          id="revenueFill"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#0f172a"
                            stopOpacity={0.22}
                          />
                          <stop
                            offset="95%"
                            stopColor="#0f172a"
                            stopOpacity={0.03}
                          />
                        </linearGradient>
                      </defs>

                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#e2e8f0"
                      />

                      <XAxis dataKey="name" tickLine={false} axisLine={false} />

                      <YAxis
                        yAxisId="left"
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={formatCompactAmount}
                      />

                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                      />

                      <Tooltip
                        contentStyle={{
                          borderRadius: 16,
                          border: "1px solid #e2e8f0",
                          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
                        }}
                        formatter={(value, name) => {
                          if (
                            ["total", "cumulative", "average"].includes(name)
                          ) {
                            return [
                              formatAmount(value),
                              name === "total"
                                ? "Revenue"
                                : name === "cumulative"
                                  ? "Cumulative"
                                  : "Avg per txn",
                            ];
                          }

                          return [value, "Transactions"];
                        }}
                      />

                      <Legend />

                      <Bar
                        yAxisId="right"
                        dataKey="count"
                        name="Transactions"
                        radius={[10, 10, 0, 0]}
                        fill="#cbd5e1"
                        barSize={26}
                      />

                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey={revenueMetric}
                        name={
                          revenueMetric === "total" ? "Revenue" : "Cumulative"
                        }
                        stroke="#0f172a"
                        fill="url(#revenueFill)"
                        strokeWidth={3}
                      />

                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="average"
                        name="Avg per txn"
                        stroke="#64748b"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <EmptyState message="No payment dates available to build the revenue chart." />
              )}

              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <InlineMetric
                  label="Transactions in window"
                  value={revenueSummary.transactionCount}
                />
                <InlineMetric
                  label="Month-over-month"
                  value={
                    revenueSummary.growth === null
                      ? "—"
                      : `${revenueSummary.growth >= 0 ? "+" : ""}${revenueSummary.growth.toFixed(1)}%`
                  }
                  positive={
                    revenueSummary.growth !== null
                      ? revenueSummary.growth >= 0
                      : undefined
                  }
                />
              </div>
            </Panel>

            <Panel
              title="Payment Methods"
              subtitle="Distribution and share from real transactions"
            >
              {paymentMethodData.length ? (
                <>
                  <div className="relative h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={paymentMethodData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={62}
                          outerRadius={88}
                          paddingAngle={4}
                        >
                          {paymentMethodData.map((entry, index) => (
                            <Cell
                              key={entry.name}
                              fill={chartPalette[index % chartPalette.length]}
                            />
                          ))}
                        </Pie>

                        <Tooltip
                          formatter={(value, name, item) => [
                            `${value} (${item.payload.share.toFixed(1)}%)`,
                            name,
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>

                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-xs uppercase tracking-wide text-slate-400">
                          Methods
                        </p>
                        <p className="text-3xl font-bold text-slate-900">
                          {paymentMethodData.length}
                        </p>
                        <p className="text-xs text-slate-500">categories</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {paymentMethodData.map((item, index) => (
                      <div
                        key={item.name}
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{
                                backgroundColor:
                                  chartPalette[index % chartPalette.length],
                              }}
                            />
                            <span className="text-sm font-medium text-slate-700">
                              {item.name}
                            </span>
                          </div>

                          <span className="text-sm font-semibold text-slate-900">
                            {item.value}
                          </span>
                        </div>

                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${item.share}%`,
                              backgroundColor:
                                chartPalette[index % chartPalette.length],
                            }}
                          />
                        </div>

                        <p className="mt-2 text-xs text-slate-500">
                          {item.share.toFixed(1)}% of visible transactions
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <EmptyState message="No payment method data available yet." />
              )}
            </Panel>
          </div>

          <div className="mb-6 grid gap-6 xl:grid-cols-3">
            <Panel
              title="Listing Types"
              subtitle="Ranked by real listing count and share"
              className="xl:col-span-2"
            >
              {listingTypeData.length ? (
                <>
                  <div className="h-[320px] rounded-3xl bg-slate-50 p-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={listingTypeData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#e2e8f0"
                        />

                        <XAxis
                          dataKey="name"
                          tickLine={false}
                          axisLine={false}
                        />

                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          allowDecimals={false}
                        />

                        <Tooltip
                          formatter={(value, name, item) => [
                            name === "value"
                              ? `${value} listings`
                              : `${item.payload.share.toFixed(1)}%`,
                            name === "value" ? "Count" : "Share",
                          ]}
                        />

                        <Bar
                          dataKey="value"
                          name="value"
                          radius={[12, 12, 0, 0]}
                          fill="#0f172a"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {listingTypeData.map((item) => (
                      <div
                        key={item.name}
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-medium text-slate-700">
                            {item.name}
                          </span>
                          <span className="text-sm font-semibold text-slate-900">
                            {item.value}
                          </span>
                        </div>

                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-slate-900"
                            style={{ width: `${item.share}%` }}
                          />
                        </div>

                        <p className="mt-2 text-xs text-slate-500">
                          {item.share.toFixed(1)}% of visible listings
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <EmptyState message="No listing type data available yet." />
              )}
            </Panel>

            <Panel
              title="Average Listing Price"
              subtitle="Computed from all visible listing prices"
            >
              <div className="flex h-full min-h-[220px] flex-col justify-center rounded-3xl bg-slate-50 p-6">
                <p className="text-sm text-slate-500">Current average</p>
                <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
                  {formatAmount(dashboardStats.averageListingPrice)}
                </p>
                <p className="mt-3 text-sm text-slate-500">
                  This value is calculated from all fetched listing prices, with
                  Decimal128 values converted safely before aggregation.
                </p>
              </div>
            </Panel>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <Panel
              title="Recent Listings"
              subtitle="Newest available listing records"
            >
              {loading ? (
                <LoadingRows rows={6} />
              ) : recentListings.length ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                        <th className="pb-3 pr-4 font-semibold">Vehicle</th>
                        <th className="pb-3 pr-4 font-semibold">Type</th>
                        <th className="pb-3 pr-4 font-semibold">Status</th>
                        <th className="pb-3 pr-4 font-semibold">Price</th>
                      </tr>
                    </thead>

                    <tbody>
                      {recentListings.map((listing, index) => (
                        <tr
                          key={listing._id || listing.id || index}
                          className="border-b border-slate-100 last:border-b-0"
                        >
                          <td className="py-4 pr-4 font-semibold text-slate-900">
                            {toTitleCase(
                              `${listing.make || "Unknown"} ${listing.model || ""}`.trim(),
                            )}
                          </td>

                          <td className="py-4 pr-4 text-slate-600">
                            {listing.carType
                              ? toTitleCase(listing.carType)
                              : "—"}
                          </td>

                          <td className="py-4 pr-4">
                            <span
                              className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusTone(
                                listing.listing_status,
                              )}`}
                            >
                              {listing.listing_status
                                ? toTitleCase(listing.listing_status)
                                : "Unknown"}
                            </span>
                          </td>

                          <td className="py-4 pr-4 text-slate-600">
                            {formatAmount(listing.price)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState message="No listings matched your current search." />
              )}
            </Panel>

            <Panel
              title="Recent Transactions"
              subtitle="Latest payment records"
            >
              {loading ? (
                <LoadingRows rows={6} />
              ) : recentTransactions.length ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                        <th className="pb-3 pr-4 font-semibold">Transaction</th>
                        <th className="pb-3 pr-4 font-semibold">User</th>
                        <th className="pb-3 pr-4 font-semibold">Method</th>
                        <th className="pb-3 pr-4 font-semibold">Amount</th>
                        <th className="pb-3 pr-4 font-semibold">Date</th>
                      </tr>
                    </thead>

                    <tbody>
                      {recentTransactions.map((transaction, index) => (
                        <tr
                          key={
                            transaction._id ||
                            transaction.id ||
                            transaction.transaction_id ||
                            index
                          }
                          className="border-b border-slate-100 last:border-b-0"
                        >
                          <td className="py-4 pr-4 font-medium text-slate-900">
                            {transaction.transaction_id ||
                              transaction._id ||
                              "—"}
                          </td>

                          <td className="py-4 pr-4 text-slate-600">
                            {transaction.user_id || "—"}
                          </td>

                          <td className="py-4 pr-4 text-slate-600">
                            {transaction.payment_method
                              ? toTitleCase(transaction.payment_method)
                              : "—"}
                          </td>

                          <td className="py-4 pr-4 text-slate-600">
                            {formatAmount(transaction.amount)}
                          </td>

                          <td className="py-4 pr-4 text-slate-600">
                            {formatDate(transaction.date_of_payment)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState message="No transactions matched your current search." />
              )}
            </Panel>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon: Icon }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </h2>
          <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
        </div>

        <div className="rounded-2xl bg-slate-100 p-3">
          <Icon className="h-5 w-5 text-slate-700" />
        </div>
      </div>
    </div>
  );
}

function Panel({ title, subtitle, className = "", children }) {
  return (
    <section
      className={`rounded-3xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}
    >
      <div className="mb-5">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

function MiniInsightCard({ label, value, helper, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <Icon className="h-4 w-4 text-slate-500" />
      </div>
      <p className="text-lg font-bold text-slate-900">{value}</p>
      {helper ? <p className="mt-1 text-xs text-slate-500">{helper}</p> : null}
    </div>
  );
}

function InlineMetric({ label, value, positive }) {
  const tone =
    typeof positive === "boolean"
      ? positive
        ? "bg-emerald-50 text-emerald-700"
        : "bg-rose-50 text-rose-700"
      : "bg-slate-100 text-slate-700";

  const Icon =
    typeof positive === "boolean"
      ? positive
        ? ArrowUpRight
        : ArrowDownRight
      : null;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-3 py-2 ${tone}`}
    >
      {Icon ? <Icon className="h-4 w-4" /> : null}
      <span className="text-xs uppercase tracking-wide">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
      {message}
    </div>
  );
}

function LoadingRows({ rows = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="h-14 animate-pulse rounded-2xl bg-slate-100"
        />
      ))}
    </div>
  );
}

export default AdminAuth(AdminDashboard);
