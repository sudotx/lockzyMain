import { PatientForm } from "@/components/forms/PatientForm";

const Home = ({ searchParams }: SearchParamProps) => {
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <PatientForm />

          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              © 2024 Lockzy
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
