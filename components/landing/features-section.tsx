import { Upload, Zap, Eye, Check } from "lucide-react";

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-content2 border-t-4 border-divider relative z-10"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6 font-sans">
            <span className="font-cursive font-bold">Powered by</span> AI
            Technology
          </h2>
          <p className="text-xl text-default-600 max-w-3xl mx-auto font-medium">
            Professional-grade tattoo visualization that artists and clients
            trust
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-content1 p-8 border-2 border-divider rounded-2xl hover:bg-content2 transition-colors shadow-lg">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-6">
              <Upload className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              Smart Upload
            </h3>
            <p className="text-default-600 mb-6 font-medium min-h-[72px]">
              Upload any body part photo. Our AI detects skin tone, curves,
              and optimal placement zones automatically.
            </p>
            <ul className="space-y-2 text-sm text-default-500">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-primary" />
                <span>Auto skin detection</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-primary" />
                <span>Perfect positioning</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-primary" />
                <span>Size optimization</span>
              </li>
            </ul>
          </div>

          <div className="bg-content1 p-8 border-2 border-divider rounded-2xl hover:bg-content2 transition-colors shadow-lg">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-6">
              <Zap className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              Design Generator
            </h3>
            <p className="text-default-600 mb-6 font-medium min-h-[72px]">
              Upload your design or generate new ones. AI creates tattoos
              that fit your body&lsquo;s natural contours.
            </p>
            <ul className="space-y-2 text-sm text-default-500">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-primary" />
                <span>Custom generation</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-primary" />
                <span>Style matching</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-primary" />
                <span>Perfect scaling</span>
              </li>
            </ul>
          </div>

          <div className="bg-content1 p-8 border-2 border-divider rounded-2xl hover:bg-content2 transition-colors shadow-lg">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-6">
              <Eye className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              Realistic Preview
            </h3>
            <p className="text-default-600 mb-6 font-medium min-h-[72px]">
              See exactly how your tattoo will look with realistic shadows,
              skin integration, and lighting.
            </p>
            <ul className="space-y-2 text-sm text-default-500">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-primary" />
                <span>Real-time rendering</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-primary" />
                <span>Skin tone matching</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-primary" />
                <span>HD quality output</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}