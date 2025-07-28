import { Users, Clock, DollarSign, Heart } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Users,
      title: "Student-First",
      description: "Built by students, for students. We get the late-night cravings and tight budgets."
    },
    {
      icon: DollarSign,
      title: "Actually Affordable",
      description: "Quality burgers that don't require selling your textbooks. Prices that make sense."
    },
    {
      icon: Clock,
      title: "Quick & Fresh",
      description: "15-minute service because you've got places to be. Made fresh, served fast."
    },
    {
      icon: Heart,
      title: "No-Fuss Vibes",
      description: "Chill atmosphere, good music, and food that just hits. Your comfort zone for comfort food."
    }
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-bebas text-6xl md:text-7xl text-foreground tracking-wider mb-4">
            WHY WE ROX
          </h2>
          <p className="font-allura text-2xl md:text-3xl text-primary mb-6">
            More than just burgers, we're your campus crew
          </p>
          <p className="font-montserrat text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Started by a group of college friends who were tired of expensive, mediocre food around campus. 
            We wanted to create a spot where you could grab an amazing burger without the stress – 
            good vibes, great food, and prices that don't hurt.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="bg-primary/10 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <feature.icon className="text-primary group-hover:text-primary-foreground" size={32} />
              </div>
              <h3 className="font-bebas text-2xl text-foreground tracking-wide mb-3">
                {feature.title}
              </h3>
              <p className="font-montserrat text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-secondary/50 rounded-2xl p-8 md:p-12 text-center">
          <h3 className="font-bebas text-4xl md:text-5xl text-foreground tracking-wider mb-4">
            JOIN THE ROX FAMILY
          </h3>
          <p className="font-allura text-xl md:text-2xl text-primary mb-6">
            Where every meal feels like hanging with friends
          </p>
          <p className="font-montserrat text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Follow us for the latest menu drops, student deals, and behind-the-scenes content. 
            We love hearing from our customers – hit us up with your burger pics and reviews!
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-card rounded-lg p-4 min-w-[120px]">
              <div className="font-bebas text-2xl text-primary">500+</div>
              <div className="font-montserrat text-sm text-muted-foreground">Happy Students</div>
            </div>
            <div className="bg-card rounded-lg p-4 min-w-[120px]">
              <div className="font-bebas text-2xl text-primary">4.8★</div>
              <div className="font-montserrat text-sm text-muted-foreground">Average Rating</div>
            </div>
            <div className="bg-card rounded-lg p-4 min-w-[120px]">
              <div className="font-bebas text-2xl text-primary">15MIN</div>
              <div className="font-montserrat text-sm text-muted-foreground">Avg Wait Time</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;