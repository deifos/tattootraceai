import { PricingTable } from '../pricing-table';

export function PricingSection() {
  return (
    <section id="pricing" className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 font-sans text-foreground">
            <span className="font-cursive font-bold">Simple,</span> transparent pricing
          </h2>
          <p className="text-lg sm:text-xl text-foreground/70 font-medium">
            Get started with AI-powered tattoo designs. No subscriptions, no hidden fees.
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-lg">
          <PricingTable variant="section" />
        </div>
      </div>
    </section>
  );
}
