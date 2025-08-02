import { Button } from "@/components/ui/button";
import { Menu, Phone, MapPin } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-background border-b border-border shadow-warm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="font-bebas text-4xl text-foreground tracking-wider">
              BURGER ROX
            </h1>
            <nav className="hidden md:flex space-x-6">
              <a href="#menu" className="font-montserrat font-medium text-foreground hover:text-primary transition-colors">
                Menu
              </a>
              <a href="#about" className="font-montserrat font-medium text-foreground hover:text-primary transition-colors">
                About
              </a>
              <a href="#contact" className="font-montserrat font-medium text-foreground hover:text-primary transition-colors">
                Contact
              </a>
            </nav>
          </div>
          
          <div className="hidden lg:flex items-center space-x-4 text-sm font-montserrat">
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Phone size={16} />
              <span>9970078688</span>
            </div>
            <div className="flex items-center space-x-1 text-muted-foreground">
              <MapPin size={16} />
              <span>Urban Forest, Mamurdi</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button 
              variant="brand" 
              size="lg" 
              className="hidden md:flex"
              onClick={() => window.open('https://wa.me/919970078688', '_blank')}
            >
              Order Now
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu size={20} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;