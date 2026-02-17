import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden max-w-full" aria-labelledby="hero-heading">
      {/* Background Image */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <picture>
          <source
            type="image/webp"
            srcSet="/hero-burger-mobile.webp 768w, /hero-burger.webp 1920w"
            sizes="100vw"
          />
          <img 
            src="/hero-burger.jpg"
            alt="" 
            className="w-full h-full object-cover"
            width="1920"
            height="1080"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.6))' }}></div>
      </div>

      {/* Restaurant Guru Badge */}
      <aside className="absolute top-4 right-4 md:top-8 md:right-8 z-20 max-w-[90px] md:max-w-[120px]" aria-label="Awards">
        <a 
          id="b-circledLeaves27" 
          target="_blank" 
          rel="noopener noreferrer"
          href="https://restaurant-guru.in/Burger-Rox-Pimpri-Chinchwad" 
          className="b-circledLeaves27--light b-circledLeaves27--2025 transform scale-[0.55] sm:scale-[0.65] md:scale-90 lg:scale-110 origin-top-right"
          aria-label="Burger Rox recommended by Restaurant Guru 2025"
        >
          <span className="b-circledLeaves27__title">Recommended</span>
          <span className="b-circledLeaves27__separator"></span>
          <span className="b-circledLeaves27__name">Burger Rox</span>
        </a>
      </aside>

      <div className="container mx-auto px-4 z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 id="hero-heading" className="font-bebas text-7xl md:text-9xl text-[#FFFFFF] leading-none tracking-wider font-bold" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
            CRAVE-WORTHY BURGERS
          </h1>
          
          <p className="font-allura text-3xl md:text-4xl text-[#FFFFFF] drop-shadow-md" role="doc-subtitle">
            Rockin' homemade flavor
          </p>

          <div className="pt-4 flex justify-center">
            <Button 
              variant="hero" 
              size="xl" 
              className="w-full sm:w-auto"
              onClick={() => window.location.href = '/menu'}
              aria-label="View full menu"
            >
              View Menu
            </Button>
          </div>

          <p className="font-montserrat text-xs md:text-sm text-white/90 bg-black/30 inline-block px-4 py-1.5 rounded-full mt-4 drop-shadow-md">
            🕖 Orders open daily from 7 PM to 10 PM
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
