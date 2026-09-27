function ServicesHero() {
  return (
    <section
      className="relative overflow-hidden bg-navy-950 bg-cover bg-center px-6 py-16 sm:py-20 lg:py-24"
      style={{ backgroundImage: "url('/images/services-hero.png')" }}
    >
      
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/45" />
      {/* Flat scrim on top so contrast holds even over the brightest part
          of the photo (the camera housing, top right) */}
      <div className="absolute inset-0 bg-navy-950/15" />

      <div className="relative mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-500">
            What We Do
          </p>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)] sm:text-5xl lg:text-6xl">
            Our Services
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-navy-100 drop-shadow-[0_1px_6px_rgba(0,0,0,0.3)]">
            Professional technology, networking, telecommunications, security
            and software solutions designed to support modern businesses.
          </p>
        </div>
      </div>
    </section>
  );
}

export default ServicesHero;