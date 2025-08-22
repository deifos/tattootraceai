import { Star } from "lucide-react";

export function TestimonialsSection() {
  return (
    <section
      id="reviews"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-content2 border-t-4 border-divider relative z-10"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6 font-sans">
            <span className="font-cursive font-bold">Trusted by</span>{" "}
            Tattoo Artists
          </h2>
          <div className="flex items-center justify-center space-x-2 mb-8">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-warning text-warning" />
            ))}
            <span className="text-xl font-bold ml-2 text-foreground">
              4.9/5 from 25,000+ users
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-content1 p-8 border-2 border-divider rounded-2xl shadow-lg">
            <div className="flex items-center space-x-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-warning text-warning"
                />
              ))}
            </div>
            <p className="text-default-600 mb-6 font-medium">
              &quot;Game changer! I could see exactly how my sleeve would
              look before booking. Saved me from making a huge
              mistake.&quot;
            </p>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-bold">
                M
              </div>
              <div>
                <p className="font-bold text-foreground">Mike Chen</p>
                <p className="text-sm text-default-500">Tattoo Collector</p>
              </div>
            </div>
          </div>

          <div className="bg-content1 p-8 border-2 border-divider rounded-2xl shadow-lg">
            <div className="flex items-center space-x-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-warning text-warning"
                />
              ))}
            </div>
            <p className="text-default-600 mb-6 font-medium">
              &quot;As a tattoo artist, this tool helps me show clients
              exactly what their piece will look like. Essential for
              consultations.&quot;
            </p>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-bold">
                S
              </div>
              <div>
                <p className="font-bold text-foreground">Sarah Martinez</p>
                <p className="text-sm text-default-500">
                  Professional Artist
                </p>
              </div>
            </div>
          </div>

          <div className="bg-content1 p-8 border-2 border-divider rounded-2xl shadow-lg">
            <div className="flex items-center space-x-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-warning text-warning"
                />
              ))}
            </div>
            <p className="text-default-600 mb-6 font-medium">
              &quot;The realism is incredible! Tried 20+ designs and found
              the perfect one. My artist was impressed with the
              accuracy.&quot;
            </p>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-bold">
                A
              </div>
              <div>
                <p className="font-bold text-foreground">Alex Rivera</p>
                <p className="text-sm text-default-500">First Tattoo</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}