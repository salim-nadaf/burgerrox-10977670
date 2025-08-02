import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import burgerTrio from "@/assets/burger-trio.jpg";

const MenuHighlights = () => {
  const burgers = [
    {
      name: "Burger Rox Zinger",
      description: "Premium bun, signature sauce, and liquid cheese",
      price: "₹259",
      popular: true
    },
    {
      name: "Chicken Classic",
      description: "Classic burger with our signature twist",
      price: "₹89",
      popular: false
    },
    {
      name: "Veggie Blaze Crisp",
      description: "Crispy patty, fresh veggies",
      price: "₹79",
      popular: false
    },
    {
      name: "Aloo Tikki",
      description: "Crispy Aloo Tikki, soft bun, and signature sauce",
      price: "₹79",
      popular: false
    },
    {
      name: "Chicken Blaze Crisp",
      description: "Crispy chicken, fresh veggies",
      price: "₹99",
      popular: false
    }
  ];

  return (
    <section id="menu" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-bebas text-6xl md:text-7xl text-foreground tracking-wider mb-4">
            MENU FAVORITES
          </h2>
          <p className="font-allura text-2xl md:text-3xl text-primary mb-6">
            Rockin' homemade flavor
          </p>
          <p className="font-montserrat text-lg text-muted-foreground max-w-2xl mx-auto">
            We keep it simple with burgers that actually slap. No weird ingredients, 
            no pretentious names – just good food that won't break your budget.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            {burgers.map((burger, index) => (
              <Card key={index} className="border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-brand">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-bebas text-2xl text-foreground tracking-wide">
                        {burger.name}
                      </h3>
                      {burger.popular && (
                        <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-montserrat font-semibold">
                          POPULAR
                        </span>
                      )}
                    </div>
                    <span className="font-bebas text-2xl text-primary">
                      {burger.price}
                    </span>
                  </div>
                  <p className="font-montserrat text-muted-foreground leading-relaxed">
                    {burger.description}
                  </p>
                </CardContent>
              </Card>
            ))}
            
            <div className="pt-6">
              <Button 
                variant="brand" 
                size="lg" 
                className="w-full sm:w-auto"
                onClick={() => window.open('https://wa.me/919970078688', '_blank')}
              >
                Order on WhatsApp
              </Button>
            </div>
          </div>

          <div className="relative">
            <img 
              src={burgerTrio} 
              alt="Burger Rox menu favorites" 
              className="w-full rounded-2xl shadow-brand"
            />
            <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground p-4 rounded-full font-bebas text-xl tracking-wider shadow-lg">
              STARTS AT ₹79!
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenuHighlights;