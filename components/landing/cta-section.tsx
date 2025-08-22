import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 border-t-4 border-divider relative z-10">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-6xl font-black mb-6 font-sans">
          <span className="font-cursive font-bold">Ready to See Your</span>
          <br />
          <span className="font-sans">Perfect Tattoo?</span>
        </h2>
        <p className="text-xl text-default-600 mb-8 max-w-2xl mx-auto font-medium">
          Join thousands who&lsquo;ve found their ideal ink with AI
          technology. No commitment, instant results.
        </p>
        <Link
          href="/dashboard"
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-12 py-6 rounded-2xl font-black text-xl transition-colors flex items-center space-x-3 mx-auto shadow-xl w-fit"
        >
          <span>Try TattooTraceAI Free</span>
          <ArrowRight className="w-6 h-6" />
        </Link>
        <p className="text-sm text-default-500 mt-4 font-medium">
          Free trial • Instant preview
        </p>
      </div>
    </section>
  );
}