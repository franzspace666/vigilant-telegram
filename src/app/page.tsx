import { prisma } from "@/lib/db";
import { serializeVyzva, type VyzvaFromAPI } from "@/lib/types";
import PageLayout from "@/components/PageLayout";
import StatsCards from "@/components/StatsCards";
import GrantTable from "@/components/GrantTable";
import DeadlineTimeline from "@/components/DeadlineTimeline";
import CategoryChart from "@/components/CategoryChart";
import styles from "./page.module.css";

export default async function DashboardPage(): Promise<import("react/jsx-runtime").JSX.Element> {
  const now = new Date();
  const fourteenDaysFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalActive,
    approachingDeadlines,
    distinctZdroje,
    newThisMonth,
    recentGrants,
    upcomingDeadlinesRaw,
    allActiveOblasti,
  ] = await Promise.all([
    prisma.vyzva.count({ where: { status: "otevrena" } }),
    prisma.vyzva.count({
      where: {
        status: "otevrena",
        deadline: { gte: now, lte: fourteenDaysFromNow },
      },
    }),
    prisma.vyzva.findMany({
      where: { status: "otevrena" },
      select: { zdroj: true },
      distinct: ["zdroj"],
    }),
    prisma.vyzva.count({
      where: { createdAt: { gte: startOfMonth } },
    }),
    prisma.vyzva.findMany({
      where: { status: "otevrena" },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.vyzva.findMany({
      where: {
        status: "otevrena",
        deadline: { gte: now },
      },
      orderBy: { deadline: "asc" },
      take: 5,
    }),
    prisma.vyzva.findMany({
      where: { status: "otevrena" },
      select: { oblasti: true },
    }),
  ]);

  // Oblast distribution
  const oblastCounts: Record<string, number> = {};
  for (const v of allActiveOblasti) {
    for (const o of v.oblasti) {
      oblastCounts[o] = (oblastCounts[o] || 0) + 1;
    }
  }
  const oblastDistribution = Object.entries(oblastCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([label, value]) => ({ label, value }));

  // Serialize for client components
  const serializedRecent: VyzvaFromAPI[] = recentGrants.map(serializeVyzva);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const serializedDeadlines = upcomingDeadlinesRaw.map((v: any) => {
    const deadline = v.deadline ? new Date(v.deadline) : null;
    const daysLeft = deadline
      ? Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : 999;
    const dateStr = deadline
      ? deadline.toLocaleDateString("cs-CZ", { day: "numeric", month: "numeric" })
      : "—";
    return {
      id: v.id,
      name: v.nazev,
      provider: v.zdroj,
      date: dateStr,
      daysLeft,
    };
  });

  const grantTableData = serializedRecent.map((g) => ({
    id: g.id,
    nazev: g.nazev,
    zdroj: g.zdroj,
    deadline: g.deadline,
    alokace: g.alokace,
    status: g.status,
  }));

  return (
    <PageLayout
      title="Přehled"
      subtitle={`Aktualizováno: ${new Date().toLocaleDateString("cs-CZ", { day: "numeric", month: "long", year: "numeric" })}`}
    >
      <div className={styles.container}>
        <StatsCards
          data={{
            totalActive,
            approachingDeadlines,
            distinctZdroje: distinctZdroje.length,
            newThisMonth,
          }}
        />

        <GrantTable grants={grantTableData} />

        <div className={styles.gridLayout}>
          <DeadlineTimeline deadlines={serializedDeadlines} />
          <CategoryChart categories={oblastDistribution} total={totalActive} />
        </div>
      </div>
    </PageLayout>
  );
}
