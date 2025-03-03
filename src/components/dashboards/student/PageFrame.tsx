import React from "react";

import GoBackButton from "./GoBackButton";
import { Separator } from "../../ui/separator";
type PageFrameProps = {
  onBackClick: () => void;
  title: string;
  children: React.ReactNode;
};

const PageFrame: React.FC<PageFrameProps> = ({
  onBackClick,
  title,
  children,
}) => {
  return (
    <div className="page-frame flex flex-wrap gap-4 p-4">
      <GoBackButton onClick={onBackClick} />
      <h2 className="font-bold text-xl">{title}</h2>
      <Separator />
      <div className="content flex flex-wrap gap-4">{children}</div>
    </div>
  );
};

export default PageFrame;
