
import HealthStats from "@/components/HealthStats";
import QuickActions from "@/components/QuickActions";
import RecentActivity from "@/components/RecentActivity";

interface DashboardProps {
  onActionClick: (tabId: string) => void;
}

const Dashboard = ({ onActionClick }: DashboardProps) => {
  return (
    <div className="space-y-6">
      {/* Health Overview */}
      <HealthStats />

      {/* Quick Actions */}
      <QuickActions onActionClick={onActionClick} />

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
};

export default Dashboard;
