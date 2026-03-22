import LogoutButton from "@/components/auth/logout-button";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function DashboardPage({ params }: Props) {
  const { locale } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
  });

  if (!profile) {
    redirect(`/${locale}/auth/login`);
  }

  const isEducator = profile.role === "educator";
  const displayName = isEducator ? "Educator1" : "Student1";
  const avatarColor = isEducator ? "bg-[#0b9c72]" : "bg-[#ef6c23]";

  return (
    <main className="mx-auto max-w-[980px] px-6 py-10">
      <section className="flex flex-col gap-8 md:flex-row md:items-start">
        <div className="text-[56px] text-[#8d8d8d]">⚙</div>

        <div
          className={`flex h-[176px] w-[176px] items-center justify-center rounded-full ${avatarColor} text-[72px] text-white`}
        >
          ○
        </div>

        <div className="flex-1 space-y-4 pt-3">
          <div className="flex items-center gap-4 text-[46px] text-[#8d8d8d]">
            <span>✎</span>
            <span className="text-[34px] text-[#31425a]">{displayName}</span>
          </div>

          <div className="flex items-center gap-4 text-[46px] text-[#8d8d8d]">
            <span>✉</span>
            <span className="text-[34px] text-[#31425a]">{user.email ?? "mail@mail.com"}</span>
          </div>

          <div className="pt-2">
            <LogoutButton />
          </div>
        </div>
      </section>

      <div className="mock-divider mt-10" />

      {isEducator ? (
        <section className="mt-10">
          <div className="mb-12 flex items-center gap-3">
            <span className="text-[42px] text-[#0b9c72]">▼</span>
            <div className="min-w-[360px] border-b-[6px] border-[#0b9c72] pb-1 text-[30px] text-[#31425a]">
              Lorem ipsum
            </div>
          </div>

          <div className="grid gap-14 md:grid-cols-2">
            <div className="border-l-4 border-[#0b9c72] pl-6">
              <div className="space-y-11 text-[20px] text-[#31425a]">
                <div className="mock-list-underline">1. Lorem ipsum</div>
                <div className="mock-list-underline">2. Lorem ipsum</div>
                <div className="mock-list-underline">3. Lorem ipsum</div>
                <div className="mock-list-underline">4. Lorem ipsum</div>
              </div>
            </div>

            <div className="border-l-4 border-[#0b9c72] pl-6">
              <div className="space-y-11 text-[20px] text-[#31425a]">
                <div className="mock-list-underline">Work Package 1</div>
                <div className="mock-list-underline">Work Package 2</div>
                <div className="mock-list-underline">Work Package 3</div>
                <div className="mock-list-underline">Work Package 4</div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="mt-12">
          <div className="grid max-w-[520px] grid-cols-2 gap-10">
            {["Course 1", "Course 2", "Course 3", "Course 4"].map((course) => (
              <div key={course} className="mock-card-student">
                <div className="mock-card-student-inner">{course}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
