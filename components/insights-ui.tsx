"use client";
import React from "react";

export const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-5 ${className}`}>{children}</div>
);

export const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`px-5 pb-5 ${className}`}>{children}</div>
);

export const CardTitle = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-base font-semibold text-gray-900 dark:text-gray-100 ${className}`}>{children}</h3>
);

export const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-700 px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-200">
    {children}
  </span>
);

export const Stat = ({
  icon: Icon,
  label,
  value,
  hint,
  color,
}: {
  icon: any;
  label: string;
  value: string | number;
  hint?: string;
  color: string;
}) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${color}`} />
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">{label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
          {hint && <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{hint}</p>}
        </div>
      </div>
    </CardContent>
  </Card>
);
