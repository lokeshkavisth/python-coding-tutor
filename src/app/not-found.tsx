import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 w-full">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        404
      </h1>
      <p>Looks like you&apos;ve ventured into the unknown digital realm.</p>

      <Link
        className={buttonVariants({ variant: "default" })}
        href="/"
        prefetch={false}
      >
        Return to website
      </Link>
    </section>
  );
}
