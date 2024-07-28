"use client";

import { Form } from "@/components/ui/form";
import { createUserProfile, getUserByEmail } from "@/lib/actions/user.actions";
import { UserFormValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import "react-phone-number-input/style.css";
import { z } from "zod";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import toast from "react-hot-toast";

export const SignInForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof UserFormValidation>) => {
    setIsLoading(true);

    const user = {
      email: values.email,
      password: values.password,
    };

    try {
      const existingUser = await getUserByEmail(user.email);

      // buggy
      if (existingUser) {
        // User already exists, redirect to dashboard
        router.push(`/users/${existingUser.email}/dashboard`);
      } else {
        try {
          const newUser = await createUserProfile(user);
          router.push(`/users/${newUser.uid}/register`);
        } catch (error: any) {
          if (error.code === "auth/email-already-in-use") {
            // Email is already in use, redirect to dashboard
            toast(error.code);
            router.push(`/users/${user.email}/dashboard`);
          } else {
            throw error; // Re-throw other errors
          }
        }
      }
    } catch (error) {
      console.error("Error during user check/creation:", error);
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        <section className="mb-12 space-y-4">
          <h1 className="text-3xl font-bold mb-6">Sign In to Lockzy 👇🏾</h1>
        </section>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="Email"
          placeholder="ccade@gmail.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
        />

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="password"
          label="Password"
          placeholder="Enter your password"
          iconSrc="/assets/icons/user.svg"
          iconAlt="password"
        />

        <SubmitButton isLoading={isLoading}>Sign In</SubmitButton>
      </form>
    </Form>
  );
};
