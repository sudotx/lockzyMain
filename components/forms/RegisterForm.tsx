"use client";

import { Form } from "@/components/ui/form";
import { createUserProfile } from "@/lib/actions/user.actions";
import { PatientFormValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import "react-phone-number-input/style.css";
import { z } from "zod";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";

const RegisterForm = ({ user }: { user: User }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const notify = (error: string) => {
    // toast(error);
    toast("This email is already registered, try signing in instead");
  };

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      privacyConsent: true,
    },
  });

  const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
    setIsLoading(true);

    try {
      const user = {
        privacyConsent: values.privacyConsent,
        email: values.email,
        password: values.password,
      };

      // on registration, save data to firestore
      try {
        const newUser = await createUserProfile(user);
        console.log(newUser);
        router.push(`/users/${newUser.uid}/dashboard`);
      } catch (error: any) {
        notify(error.message);
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  // the door id will be auto assigned based on availability

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex-1 space-y-12"
      >
        <section className="space-y-4">
          <p className="sub-header">Let us know more about you.</p>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1"></div>

          {/* ID */}

          {/* <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="name"
            placeholder="User/Door Id"
            label="Id"
            iconSrc="/assets/icons/user.svg"
            iconAlt="id"
          /> */}
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            placeholder="email@mail.com"
            label="Email"
            iconSrc="/assets/icons/user.svg"
            iconAlt="id"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="password"
            placeholder="Password"
            label="Password"
            iconSrc="/assets/icons/user.svg"
            iconAlt="id"
          />
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1"></div>
          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="privacyConsent"
            label="I acknowledge the
            use of my biometrics"
          />
        </section>

        <Toaster />

        <SubmitButton isLoading={isLoading}>Submit and Continue</SubmitButton>
      </form>
    </Form>
  );
};

export default RegisterForm;
