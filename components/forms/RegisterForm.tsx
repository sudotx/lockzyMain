"use client";

import { Form } from "@/components/ui/form";
import {
  changeDoorStatus,
  createUserProfile,
} from "@/lib/actions/user.actions";
import { PatientFormValidation } from "@/lib/validation";
import { Button } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import "react-phone-number-input/style.css";
import { z } from "zod";
import CustomFormField, { FormFieldType } from "../CustomFormField";

const RegisterForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenDoorClickEnrollMode = async () => {
    await changeDoorStatus(0, 0); // enroll mode
    toast("Enrollment mode activated. Register Finger With Device");
  };

  const notify = (error: string) => {
    // toast(error);
    toast("This email is already registered, try signing in instead");
  };

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      privacyConsent: false,
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
          <p className="sub-header text-white">Let us know more about you.</p>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1"></div>

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
            label="I confirm I am physically present in front of the device"
          />
        </section>

        <Toaster />
        <section className="button-section flex space-x-4">
          <Button
            type="submit"
            className="shad-primary-btn w-full"
            onClick={handleOpenDoorClickEnrollMode}
          >
            Open Door
          </Button>
          <Toaster />
        </section>
        <p className="copyright py-12">© 2024 Lockzy</p>
      </form>
    </Form>
  );
};

export default RegisterForm;
