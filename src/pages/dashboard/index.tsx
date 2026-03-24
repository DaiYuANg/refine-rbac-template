'use client'

import { useTranslation } from 'react-i18next'
import { motion } from '@/components/shared/motion'
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Sector,
  Legend,
  Area,
  AreaChart,
} from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Users, Shield, Key, Activity } from 'lucide-react'
import { useDashboardStats } from '@/features/dashboard'
import {
  DASHBOARD_STAT_CARDS,
  DASHBOARD_USER_ACTIVITY,
  DASHBOARD_ROLE_DISTRIBUTION,
  DASHBOARD_PERMISSION_GROUPS,
} from '@/mocks/fixtures/dashboard'
import { PageLoadingState } from '@/components/shared/loading-indicator'

const STAT_CARD_ICONS: Record<string, typeof Users> = {
  users: Users,
  roles: Shield,
  permissions: Key,
  activeSessions: Activity,
}

export const DashboardPage = () => {
  const { t } = useTranslation()
  const { data, isLoading } = useDashboardStats()

  const statCards = data?.statCards ?? DASHBOARD_STAT_CARDS
  const userActivity = data?.userActivity ?? DASHBOARD_USER_ACTIVITY
  const roleDistribution = data?.roleDistribution ?? DASHBOARD_ROLE_DISTRIBUTION
  const permissionGroups = data?.permissionGroups ?? DASHBOARD_PERMISSION_GROUPS

  if (isLoading) {
    return <PageLoadingState title={t('loading.dashboard')} className="py-2" />
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">{t('app.title')}</h1>
        <p className="text-muted-foreground">{t('dashboard.welcome')}</p>
      </div>

      {/* 统计卡片 */}
      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: { staggerChildren: 0.06 },
          },
          hidden: {},
        }}
      >
        {statCards.map(({ key, value, labelKey }) => {
          const Icon = STAT_CARD_ICONS[key] ?? Users
          return (
            <motion.div
              key={key}
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {t(labelKey)}
                  </CardTitle>
                  <Icon className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{value}</div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* 图表区域 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 用户活跃度趋势 */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.userActivity')}</CardTitle>
            <CardDescription>{t('dashboard.userActivityDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userActivity}>
                  <defs>
                    <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--chart-1)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--chart-1)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient id="fillLogins" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--chart-2)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--chart-2)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--card)',
                      color: 'var(--card-foreground)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    name={t('dashboard.chartUsers')}
                    stroke="var(--chart-1)"
                    fill="url(#fillUsers)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="logins"
                    name={t('dashboard.chartLogins')}
                    stroke="var(--chart-2)"
                    fill="url(#fillLogins)"
                    strokeWidth={2}
                  />
                  <Legend wrapperStyle={{ color: 'var(--foreground)' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 角色分布饼图 */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.roleDistribution')}</CardTitle>
            <CardDescription>
              {t('dashboard.roleDistributionDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({
                      cx,
                      cy,
                      midAngle = 0,
                      innerRadius = 0,
                      outerRadius = 0,
                      name,
                      percent,
                    }) => {
                      const radius =
                        innerRadius + (outerRadius - innerRadius) * 0.5
                      const x =
                        cx + radius * Math.cos(-midAngle * (Math.PI / 180))
                      const y =
                        cy + radius * Math.sin(-midAngle * (Math.PI / 180))
                      return (
                        <text
                          x={x}
                          y={y}
                          fill="var(--foreground)"
                          textAnchor="middle"
                          dominantBaseline="central"
                          style={{ fontSize: 12 }}
                        >
                          {`${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                        </text>
                      )
                    }}
                    labelLine={false}
                    shape={(props) => (
                      <Sector
                        {...props}
                        fill={
                          (props.payload as { color?: string })?.color ??
                          props.fill
                        }
                      />
                    )}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--card)',
                      color: 'var(--card-foreground)',
                    }}
                    formatter={(value) => [value, t('dashboard.users')]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 权限组统计柱状图 */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.permissionGroups')}</CardTitle>
          <CardDescription>
            {t('dashboard.permissionGroupsDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={permissionGroups}
                layout="vertical"
                margin={{ left: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  className="stroke-muted"
                />
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  width={80}
                  tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--card)',
                    color: 'var(--card-foreground)',
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="var(--chart-3)"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
