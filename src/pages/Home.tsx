import { ChatWidget } from "@/components/ChatWidget";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Branding Header */}
      <header className="w-full border-b border-border bg-white py-12 px-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center text-center space-y-4">
          <div className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary">
            CleanzATX
          </div>
          <h2 className="text-xl md:text-2xl font-medium text-foreground">
            Lakeway's #1 Exterior Cleaning Service
          </h2>
          <div className="flex items-center space-x-2 text-sm font-medium text-muted-foreground bg-secondary px-4 py-1.5 rounded-full">
            <span className="text-yellow-500 text-lg leading-none">★★★★★</span>
            <span>5.0 &middot; 167 Google Reviews</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto py-16 px-6">
        <div className="prose prose-gray max-w-none text-center">
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Experience the difference of premium window cleaning, pressure washing, and soft washing. We treat your home with the utmost care, delivering spotless results you can trust. 
          </p>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Window Cleaning", desc: "Crystal clear, streak-free interior and exterior window washing." },
            { title: "Pressure Washing", desc: "Deep cleaning for driveways, patios, and tough concrete surfaces." },
            { title: "Soft Washing", desc: "Gentle but effective cleaning for delicate siding and roofs." }
          ].map((service, i) => (
            <div key={i} className="bg-secondary/50 rounded-xl p-8 text-center border border-border">
              <h3 className="text-lg font-semibold text-primary mb-2">{service.title}</h3>
              <p className="text-muted-foreground text-sm">{service.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <ChatWidget />
    </div>
  );
}
