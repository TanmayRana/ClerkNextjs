"use client";

import React from "react";
import { SignedOut, SignOutButton, useAuth, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

const Trpage = () => {
  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();
  console.log(user);
  console.log(userId);

  return (
    <div>
      This is a protected route
      <br />
      {isSignedIn ? "You are signed in" : "You are not signed in"}
      <br />
      {userId}
      <br />
      {user?.fullName}
      <br />
      {user?.emailAddresses[0].emailAddress}
      <br />
      {/* <Image
        src={`user?.externalAccounts[0].imageUrl`}
        width={100}
        height={100}
        alt="userimage"
      /> */}
      {user?.externalAccounts[0].imageUrl}
      <SignOutButton>
        <button>Sign out</button>
      </SignOutButton>
    </div>
  );
};

export default Trpage;
