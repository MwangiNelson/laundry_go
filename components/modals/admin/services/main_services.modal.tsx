import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export const MainServicesModal = ({
  trigger,
}: {
  trigger?: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild className="cursor-pointer">
          {trigger}
        </DialogTrigger>
      ) : null}

      <DialogContent className="sm:max-w-4xl  rounded-3xl bg-background border-none overflow-hidden">
        <DialogTitle>Edit Services</DialogTitle>
        <div className="flex flex-col gap-2">
          <div className="flex gap-1 max-w-5xl">
            <span className="w-full">Service Name:</span>
            <input type="text" className="border ml-2 p-1 rounded-md w-full" />
          </div>
          <div className="flex gap-1">
            <span>Description:</span>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a description" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc1">Description 1</SelectItem>
                <SelectItem value="desc2">Description 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
