import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";

export function ReportsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Class Reports</CardTitle>
        <CardDescription>View and manage student reports</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">No reports available</p>
      </CardContent>
    </Card>
  );
}
