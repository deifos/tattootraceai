import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@heroui/button";

export function HeroSection() {
  return (
    <section className="pt-16 pb-16 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight font-sans">
            <span className="font-cursive font-bold text-5xl md:text-7xl">
              See Your Tattoo
            </span>
            <br />
            <span className="font-sans">Before You Ink</span>
          </h1>
          <p className="text-xl md:text-2xl text-default-500 mb-8 max-w-3xl mx-auto font-medium">
            Upload your body part photo and tattoo design. Our AI shows you
            exactly how it&lsquo;ll look in real life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button color="primary" variant="shadow" size="lg" as={Link} href="/dashboard" className="flex items-center gap-2">
              <span>Start Now - Free</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}