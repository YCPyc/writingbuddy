import { Button } from "../../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";

type MainMenuOptionProps = {
  buttonText: string;
  description: string;
  onClick: () => void;
};

export default function MainMenuOption({
  buttonText,
  description,
  onClick,
}: MainMenuOptionProps) {
  return (
    <Card className="border-lime-100 shadow-sm hover:shadow transition-all">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-lime-800">{buttonText}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter className="pt-2">
        <Button
          onClick={onClick}
          className="w-full bg-lime-600 hover:bg-lime-700 text-white"
        >
          Select
        </Button>
      </CardFooter>
    </Card>
  );
}
