function Stats() {
  const stats = [
    { value: "6", label: "Core Services" },
    { value: "360°", label: "Project Delivery" },
    { value: "24/7", label: "Technology Focus" },
    { value: "100%", label: "Client Focus" },
  ];

  return (
    <section className="bg-navy-950 border-t border-navy-800 px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl font-bold text-gold-500">{stat.value}</p>
              <p className="mt-2 text-sm text-navy-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Stats;