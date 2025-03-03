import React from "react";

type GoBackButtonProps = {
  onClick: () => void;
};

const GoBackButton: React.FC<GoBackButtonProps> = ({ onClick }) => {
  return (
    <div className="w-full flex justify-end">
      <p
        className="text-blue-500 text-base underline cursor-pointer"
        onClick={onClick}
      >
        ← Go back
      </p>
    </div>
  );
};

export default GoBackButton;
