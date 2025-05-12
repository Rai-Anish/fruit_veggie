import { Resend } from "resend";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import {
  emailVerificationTemplate,
  passwordResetOtpTemplate,
  welcomeEmailTemplate,
} from "./template/auth.template.js";
import dotenv from "dotenv";
import {
  accountApprovedTemplate,
  accountRejectedTemplate,
  accountReviewTemplate,
  approvalReminderTemplate,
} from "./template/vendor.template.js";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

///////////////////////////////// AUTH //////////////////////////////////////////////////////////

export const sendVerificationEmail = AsyncHandler(
  async function (email, name, verificationUrl) {
    const { data, error } = await resend.emails.send({
      from: "Fruits and Veggie <onboarding@resend.dev>",
      to: [email],
      subject: "Verification email",
      html: emailVerificationTemplate(name, verificationUrl),
    });

    if (error) {
      return console.error({ error });
    }

    console.log({ data });
  }
);

export const sendWelcomeEmail = AsyncHandler(async function (email, name) {
  const { data, error } = await resend.emails.send({
    from: "Fruits and Veggie <onboarding@resend.dev>",
    to: [email],
    subject: "Welcome email",
    html: welcomeEmailTemplate(name),
  });

  if (error) {
    return console.error({ error });
  }

  console.log({ data });
});

export const sendPasswordResetEmail = AsyncHandler(
  async function (email, name, otp) {
    const { data, error } = await resend.emails.send({
      from: "Fruits and Veggie <onboarding@resend.dev>",
      to: [email],
      subject: "Password reset email",
      html: passwordResetOtpTemplate(name, otp),
    });

    if (error) {
      return console.error({ error });
    }

    console.log({ data });
  }
);

/////////////////////// VENDOR //////////////////////////////////////////////////////////

export const accountReviewEmail = AsyncHandler(async function (name, email) {
  const { data, error } = await resend.emails.send({
    from: "Fruits and Veggie <onboarding@resend.dev>",
    to: [email],
    subject: "Account review",
    html: accountReviewTemplate(name),
  });

  if (error) {
    return console.error({ error });
  }

  console.log({ data });
});

export const accountApprovedEmail = AsyncHandler(async function (name, email) {
  const { data, error } = await resend.emails.send({
    from: "Fruits and Veggie <onboarding@resend.dev>",
    to: [email],
    subject: "Account approval",
    html: accountApprovedTemplate(name),
  });

  if (error) {
    return console.error({ error });
  }

  console.log({ data });
});

export const accountRejectedEmail = AsyncHandler(
  async function (name, reason, email) {
    const { data, error } = await resend.emails.send({
      from: "Fruits and Veggie <onboarding@resend.dev>",
      to: [email],
      subject: "Account rejection",
      html: accountRejectedTemplate(name, reason),
    });

    if (error) {
      return console.error({ error });
    }

    console.log({ data });
  }
);

export const approvalReminderEmail = AsyncHandler(
  async function (name, email, verificationUrl) {
    const { data, error } = await resend.emails.send({
      from: "Fruits and Veggie <onboarding@resend.dev>",
      to: [email],
      subject: "Verify your account for vendor approval",
      html: approvalReminderTemplate(name, verificationUrl),
    });

    if (error) {
      return console.error({ error });
    }

    console.log({ data });
  }
);
