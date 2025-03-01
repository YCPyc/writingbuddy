import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";

type OverviewTabProps = {
  onCreateAssignment: () => void;
};

export function OverviewTab({ onCreateAssignment }: OverviewTabProps) {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your class activities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            className="w-full"
            variant="default"
            onClick={onCreateAssignment}
          >
            Create New Assignment
          </Button>
          <Button className="w-full" variant="outline">
            Create New Report
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
