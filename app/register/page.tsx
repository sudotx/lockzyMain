import RegisterForm from "@/components/forms/RegisterForm";
import { getUser } from "@/lib/actions/user.actions";
import Image from "next/image";
import { redirect } from "next/navigation";

const Register = async ({ params: { userId } }: SearchParamProps) => {
  const user = await getUser(userId);

  if (user) redirect(`/users/${userId}/dashboard`);

  return (
    <div className="flex h-screen max-h-screen">
      <Image
        src="/assets/images/register-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[390px]"
      />

      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <RegisterForm user={user} />

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

export default Register;
