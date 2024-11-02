import dbConnect from "@/lib/db";
import User from "@/lib/model/userModel";
import { clerkClient } from "@clerk/nextjs/server";
import { WebhookEvent } from "@clerk/nextjs/server";

import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

export async function POST(req: Request) {
  await dbConnect();
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Do something with the payload
  // For this guide, you simply log the payload to the console
  const { id } = evt.data;
  const eventType = evt.type;

  //   created Mogodb Schema
  console.log("evt data=", evt.data);

  if (eventType === "user.created") {
    const { id, email_addresses, image_url, first_name, last_name, username } =
      evt.data;

    const user = {
      clerkId: id,
      email: email_addresses[0].email_address,
      photo: image_url,
      firstName: first_name,
      lastName: last_name,
      username: username!,
    };

    console.log(user);

    const newUser = await User.create(user);

    if (newUser) {
      await clerkClient.users.updateUserMetadata(id, {
        publicMetadata: {
          userId: newUser._id,
        },
      });
    }

    return Response.json(
      { message: "User created successfully", user: newUser },
      { status: 200 }
    );
  }

  console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  console.log("Webhook body:", body);

  return new Response("", { status: 200 });
}

// import dbConnect from "@/lib/db";
// import User from "@/lib/model/userModel";
// import { clerkClient } from "@clerk/nextjs/server";
// import { WebhookEvent } from "@clerk/nextjs/server";

// import { headers } from "next/headers";
// import { NextResponse } from "next/server";
// import { Webhook } from "svix";

// export async function POST(req: Request) {
//   try {
//     const response = await clerkClient.users.getUserList();

//     console.log("response=", response);

//     await dbConnect();

//     const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
//     if (!WEBHOOK_SECRET) {
//       console.error(
//         "WEBHOOK_SECRET is not defined in the environment variables."
//       );
//       return new Response("Webhook secret missing", { status: 500 });
//     }

//     const headerPayload = headers();
//     const svix_id = headerPayload.get("svix-id");
//     const svix_timestamp = headerPayload.get("svix-timestamp");
//     const svix_signature = headerPayload.get("svix-signature");

//     if (!svix_id || !svix_timestamp || !svix_signature) {
//       console.error("Svix headers missing");
//       return new Response("Missing Svix headers", { status: 400 });
//     }

//     const payload = await req.json();
//     const body = JSON.stringify(payload);

//     const wh = new Webhook(WEBHOOK_SECRET);
//     let evt: WebhookEvent;

//     try {
//       evt = wh.verify(body, {
//         "svix-id": svix_id,
//         "svix-timestamp": svix_timestamp,
//         "svix-signature": svix_signature,
//       }) as WebhookEvent;
//     } catch (err) {
//       console.error("Error verifying webhook:", err);
//       return new Response("Webhook verification failed", { status: 400 });
//     }

//     const eventType = evt.type;

//     console.log("eventType=", eventType);

//     console.log("eve=", evt);

//     if (eventType === "user.created") {
//       const {
//         id,
//         email_addresses,
//         image_url,
//         first_name,
//         last_name,
//         username,
//       } = evt.data;

//       const user = {
//         clerkId: id,
//         email: email_addresses[0].email_address,
//         photo: image_url,
//         firstName: first_name,
//         lastName: last_name,
//         username: username ?? "",
//       };

//       try {
//         const newUser = await User.create(user);
//         await clerkClient.users.updateUserMetadata(id, {
//           publicMetadata: {
//             userId: newUser._id,
//           },
//         });

//         return NextResponse.json(
//           { message: "User created successfully", user: newUser },
//           { status: 201 }
//         );
//       } catch (dbError) {
//         console.error("Database error:", dbError);
//         return new Response("Error saving user", { status: 500 });
//       }
//     }

//     console.log(`Unhandled webhook event type: ${eventType}`);
//     return new Response("Event type not handled", { status: 200 });
//   } catch (error) {
//     console.error("Unexpected error:", error);
//     return new Response("Internal server error", { status: 500 });
//   }
// }
