import { auth } from "@/lib/auth";
import { Role } from "@/generated/prisma";
import { redirect } from "next/navigation";
import { SingInForm } from "@/app/(auth)/sing-in/_components/sing-in-form";

export default async function Page() {
  const session = await auth();

  if (session?.user?.role === Role.ADMIN) {
    redirect("/admin/foods-management/foods");
  }

  if (session?.user?.role === Role.USER) {
    redirect("/client");
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <SingInForm />
    </div>
  );
}
