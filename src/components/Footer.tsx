const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div>
            <h3 className="font-bebas text-3xl tracking-wider mb-2">
              BURGER ROX
            </h3>
            <p className="font-allura text-lg text-primary">
              Rockin' homemade flavor
            </p>
          </div>

          <div className="text-center">
            <p className="font-montserrat text-sm text-background/80">
              © 2025 Burger Rox. All rights reserved.
            </p>
            <p className="font-montserrat text-xs text-background/60 mt-1">
              Made with ❤️ for students, by students
            </p>
          </div>

          <div className="text-right">
            <div className="font-montserrat text-sm text-background/80">
              <p>Urban Forest, Mamurdi</p>
              <p>9970078688</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;