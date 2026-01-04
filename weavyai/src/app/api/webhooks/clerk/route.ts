import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  // Get the Svix headers for verification
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Get the webhook secret
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Please add WEBHOOK_SECRET from Clerk Dashboard to .env.local");
  }

  // Create a new Svix instance with your secret
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
    return new Response("Error occurred", {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    try {
      await connectDB();

      const email = email_addresses[0]?.email_address;

      if (!email) {
        return new Response("Error: No email address", {
          status: 400,
        });
      }

      // Upsert user (create or update)
      await User.findOneAndUpdate(
        { clerkId: id },
        {
          clerkId: id,
          email,
          firstName: first_name,
          lastName: last_name,
          imageUrl: image_url,
        },
        { upsert: true, new: true }
      );

      return new Response("User synced successfully", { status: 200 });
    } catch (error) {
      console.error("Error syncing user:", error);
      return new Response("Error syncing user", {
        status: 500,
      });
    }
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;

    try {
      await connectDB();
      await User.findOneAndDelete({ clerkId: id });

      return new Response("User deleted successfully", { status: 200 });
    } catch (error) {
      console.error("Error deleting user:", error);
      return new Response("Error deleting user", {
        status: 500,
      });
    }
  }

  return new Response("Webhook received", { status: 200 });
}

