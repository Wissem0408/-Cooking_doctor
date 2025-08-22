import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="sticky top-12 left-0 right-0 bg-warmWhite/95 backdrop-blur-sm shadow-sm z-40 transition-all duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/">
            <div className="font-playfair text-2xl font-bold text-espresso cursor-pointer hover:text-gold transition-colors">
              Tiramisu by Cooking Doctor
            </div>
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link href="/" className={`hover:text-gold transition-colors duration-300 ${isActive("/") ? "text-gold" : "text-espresso"}`}>
              Accueil
            </Link>
            <Link href="/menu" className={`hover:text-gold transition-colors duration-300 ${isActive("/menu") ? "text-gold" : "text-espresso"}`}>
              Menu
            </Link>
            <Link href="/order" className={`hover:text-gold transition-colors duration-300 ${isActive("/order") ? "text-gold" : "text-espresso"}`}>
              Commander
            </Link>
            <Link href="/stores" className={`hover:text-gold transition-colors duration-300 ${isActive("/stores") ? "text-gold" : "text-espresso"}`}>
              Magasins
            </Link>
            <Link href="/contact" className={`hover:text-gold transition-colors duration-300 ${isActive("/contact") ? "text-gold" : "text-espresso"}`}>
              Contact
            </Link>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-espresso"
            onClick={toggleMenu}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
        
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3 animate-fade-in">
            <Link
              href="/"
              className={`block hover:text-gold transition-colors duration-300 ${isActive("/") ? "text-gold" : "text-espresso"}`}
              onClick={toggleMenu}
            >
              Accueil
            </Link>
            <Link 
              href="/menu"
              className={`block hover:text-gold transition-colors duration-300 ${isActive("/menu") ? "text-gold" : "text-espresso"}`}
              onClick={toggleMenu}
            >
              Menu
            </Link>
            <Link
              href="/order"
              className={`block hover:text-gold transition-colors duration-300 ${isActive("/order") ? "text-gold" : "text-espresso"}`}
              onClick={toggleMenu}
            >
              Commander
            </Link>
            <Link
              href="/stores"
              className={`block hover:text-gold transition-colors duration-300 ${isActive("/stores") ? "text-gold" : "text-espresso"}`}
              onClick={toggleMenu}
            >
              Magasins
            </Link>
            <Link 
              href="/contact"
              className={`block hover:text-gold transition-colors duration-300 ${isActive("/contact") ? "text-gold" : "text-espresso"}`}
              onClick={toggleMenu}
            >
              Contact
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
