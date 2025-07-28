import { redirect } from "next/navigation";
import { SingUpForm } from "@/app/(auth)/sing-up/_components/sing-up-form";
import { auth } from "@/lib/auth";
import { Role } from "@/generated/prisma";

export default async function Page() {
  const session = await auth();

  if (session?.user?.role === Role.ADMIN) {
    redirect("/admin/foods-management/foods");
  }

  if (session?.user?.role === Role.USER) {
    redirect("/client");
  }

  return (
    <div>
      <SingUpForm />
    </div>
  );
}
