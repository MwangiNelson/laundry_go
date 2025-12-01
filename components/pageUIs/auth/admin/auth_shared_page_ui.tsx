import { Card } from "@/components/ui/card";
import Image from "next/image";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const AuthSharedPageUI = (props: Props) => {
  return (
    <div className="w-screen h-screen relative flex justify-center items-center">
      <Image
        src={`/auth/bg.png`}
        alt="Background Image"
        fill
        className="object-cover absolute top-0 left-0 -z-1"
      />
      <Card className="w-[90vw] max-w-[600px] rounded-3xl bg-background px-6 py-6 pb-8 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.3),0px_2px_6px_2px_rgba(0,0,0,0.15)]">
        {props.children}
      </Card>
    </div>
  );
};

export default AuthSharedPageUI;
