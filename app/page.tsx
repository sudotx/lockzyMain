import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const Home = ({ searchParams }: SearchParamProps) => {
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
          {/* <PatientForm /> */}
          <section className="mb-12 space-y-4">
            <h1 className="header">Welcome To Lockzy 🔓</h1>
          </section>

          <div className="space-y-4">
            <Link href="/signin">
              <Button className="w-full flex rounded-md border border-dark-500 bg-dark-400">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="w-full" variant="outline">
                Get Started
              </Button>
            </Link>
          </div>

          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              © 2024 Lockzy
            </p>
          </div>
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

export default Home;
