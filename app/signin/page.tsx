import { SignInForm } from "@/components/forms/SignInForm";
import Image from "next/image";

const SignIn = () => {
  return (
    <div className="flex h-screen max-h-screen">
      <Image
        src="/assets/images/register-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[390px]"
      />
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <SignInForm />

          <p className="copyright py-12">© 2024 Lockzy</p>
        </div>
      </section>

      <Image
        src="/assets/images/register-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[390px]"
      />
    </div>
  );
};

export default SignIn;
