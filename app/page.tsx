import Trpage from "@/components/Trpage";
import { SignedOut } from "@clerk/nextjs";
import React from "react";

const page = async () => {
  // const { isSignedIn, userId } = await useAuth();

  return (
    <div>
      <Trpage />
      <SignedOut />
    </div>
  );
};

export default page;
