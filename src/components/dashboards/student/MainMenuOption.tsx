import React from "react";
import { Button } from "../../ui/button";

type MainMenuOptionProps = {
  buttonText: string;
  description: string;
  onClick: () => void;
};

const MainMenuOption: React.FC<MainMenuOptionProps> = ({
  buttonText,
  description,
  onClick,
}) => {
  return (
    <div className="flex flex-col">
      <Button className="w-full text-base" onClick={onClick}>
        {buttonText}
      </Button>
      <p className="text-sm text-gray-600 mb-2">{description}</p>
    </div>
  );
};

export default MainMenuOption;
