"use client";

import { DropdownMenuItem } from "&/components/ui/dropdown-menu";
import { useEffect, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "&/components/ui/select";
import { useRouter } from "next/navigation";

export const DropdownMenuItemCancel = ({
  deployId,
  action,
}: {
  deployId: string;
  action: (deployid: string) => void;
}) => {
  return (
    <DropdownMenuItem
      className="text-red-500"
      onClick={async () => {
        console.log(await action(deployId));
      }}
    >
      Cancel
    </DropdownMenuItem>
  );
};

export const RevalidateEffect = ({ action }: { action: () => void }) => {
  const ref = useRef(false);
  useEffect(() => {
    if (ref.current) return;

    setInterval(() => {
      action();
    }, 15000);
  }, []);

  return <></>;
};

export const SelectState = ({ defaultValue }: { defaultValue: string }) => {
  const { push } = useRouter();

  return (
    <Select
      defaultValue={defaultValue}
      key={defaultValue}
      onValueChange={(newState) => {
        push(`/${newState}`);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="BUILDING,QUEUED">Building and queue</SelectItem>
          <SelectItem value="BUILDING">Building</SelectItem>
          <SelectItem value="QUEUED">Queue</SelectItem>
          <SelectItem value="ERROR">Error</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
