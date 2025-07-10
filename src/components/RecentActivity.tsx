
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const RecentActivity = () => {
  const activities = [
    {
      title: "Symptom Check Completed",
      description: "Mild headache - Low risk",
      time: "2 hours ago",
      bgColor: "bg-blue-50"
    },
    {
      title: "Health Report Generated",
      description: "Weekly summary available",
      time: "1 day ago",
      bgColor: "bg-green-50"
    },
    {
      title: "Diet Goal Achieved",
      description: "Daily calorie target met",
      time: "Yesterday",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Health Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div key={index} className={`flex items-center justify-between p-3 ${activity.bgColor} rounded-lg`}>
              <div>
                <p className="font-medium">{activity.title}</p>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
              </div>
              <Badge variant="secondary">{activity.time}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
