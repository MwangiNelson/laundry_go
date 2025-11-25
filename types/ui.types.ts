import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { IconBaseProps } from "react-icons/lib";
import { ColumnDef } from "@tanstack/react-table";

export type TIcon =
  | React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  | React.ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >
  | ForwardRefExoticComponent<IconBaseProps & RefAttributes<SVGSVGElement>>;

// Generic ColumnID type that accepts TData and TValue parameters like table wrapper
export type ColumnID<
  TData,
  TValue,
  TColumns extends readonly ColumnDef<TData, TValue>[]
> = TColumns[number] extends infer T
  ? T extends { accessorKey: infer K }
    ? K extends string | number | symbol
      ? K
      : never
    : T extends { id: infer I }
    ? I extends string
      ? I
      : never
    : never
  : never;
