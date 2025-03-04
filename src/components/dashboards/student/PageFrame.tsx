import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { ChevronLeft } from "lucide-react";

type PageFrameProps = {
  children: React.ReactNode;
  title: string;
  onBackClick: () => void;
};

export default function PageFrame({
  children,
  title,
  onBackClick,
}: PageFrameProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBackClick}
          className="hover:bg-lime-100"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-bold text-lime-800">{title}</h2>
      </div>

      <Card className="border-lime-100 shadow-sm">
        <CardContent className="p-6">{children}</CardContent>
      </Card>
    </div>
  );
}
