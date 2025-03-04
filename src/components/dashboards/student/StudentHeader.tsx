import React from "react";
import { Separator } from "../../ui/separator";

type StudentHeaderProps = {
  children?: React.ReactNode;
};

export function StudentHeader({ children }: StudentHeaderProps) {
  return (
    <div className="header flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-lime-800">Writing Buddy</h1>
      {children}
    </div>
  );
}
