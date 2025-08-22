export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="py-20 px-4 sm:px-6 lg:px-8 border-t-4 border-divider relative z-10"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6 font-sans">
            <span className="font-cursive font-bold">Simple</span> Process
          </h2>
          <p className="text-xl text-default-600 font-medium">
            Get your tattoo preview in under 2 minutes
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-black shadow-lg">
              1
            </div>
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              Upload Photo
            </h3>
            <p className="text-default-600 font-medium">
              Take or upload a clear photo of where you want your tattoo
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-black shadow-lg">
              2
            </div>
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              Add Design
            </h3>
            <p className="text-default-600 font-medium">
              Upload your tattoo design or generate one with our AI
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-black shadow-lg">
              3
            </div>
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              See Results
            </h3>
            <p className="text-default-600 font-medium">
              AI overlays your design with photorealistic precision
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}