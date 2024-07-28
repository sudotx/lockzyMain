"use client";

import { Form } from "@/components/ui/form";
import { PatientFormDefaultValues } from "@/constants";
import { registerUser } from "@/lib/actions/user.actions";
import { PatientFormValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import "react-phone-number-input/style.css";
import { z } from "zod";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";

const RegisterForm = ({ user }: { user: User }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      id: 0,
      privacyConsent: true,
    },
  });

  const onSubmit = (values: z.infer<typeof PatientFormValidation>) => {
    setIsLoading(true);

    try {
      const patient = {
        userId: "",
        id: 1,
        privacyConsent: values.privacyConsent,
      };

      const newPatient = registerUser(patient);

      console.log(newPatient);

      router.push(`/users/${values.id}/dashboard`);
      // if (newPatient) {
      //   router.push(`/users/${user.$id}/dashboard`);
      // }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

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

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="name"
            placeholder="User Id"
            label="Id"
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
            label="I acknowledge that I have reviewed and agree to the
            privacy policy"
          />
        </section>

        <SubmitButton isLoading={isLoading}>Submit and Continue</SubmitButton>
      </form>
    </Form>
  );
};

export default RegisterForm;
