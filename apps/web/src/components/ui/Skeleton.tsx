import React from "react";
import { cn } from "../../lib/cn.js";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  height?: number | string;
  width?: number | string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  height,
  width,
  style,
  ...props
}) => {
  return (
    <div
      aria-hidden="true"
      className={cn("bg-paper-100 rounded-sm", className)}
      style={{
        height,
        width,
        ...style,
      }}
      {...props}
    />
  );
};
