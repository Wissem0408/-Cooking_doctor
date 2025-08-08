import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const isComingSoon = product.badge === "Bientôt Disponible";
  
  return (
    <Card className={`bg-warmWhite shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${isComingSoon ? 'opacity-75' : ''}`}>
      <div className="relative">
        <img 
          src={product.image}
          alt={product.name}
          className={`w-full h-48 object-cover ${isComingSoon ? 'grayscale' : ''}`}
        />
        {product.badge && (
          <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${
            isComingSoon 
              ? 'bg-espresso/80 text-warmWhite' 
              : 'bg-gold text-espresso'
          }`}>
            {product.badge}
          </div>
        )}
      </div>
      <CardContent className="p-6">
        <h3 className="font-playfair text-2xl font-bold mb-3 text-espresso">{product.name}</h3>
        <p className="text-espresso/70 mb-4 font-sans">{product.description}</p>
        
        {!isComingSoon ? (
          <>
            <div className="space-y-2 mb-6">
              {product.id === "mousse" ? (
                <div className="flex justify-between items-center">
                  <span className="font-sans">Sans sucre 72% cacao</span>
                  <span className="font-semibold text-espresso">{product.pricing.small} DT</span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <span className="font-sans">Petit</span>
                    <span className="font-semibold text-espresso">{product.pricing.small} DT</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-sans">Grand</span>
                    <span className="font-semibold text-espresso">{product.pricing.medium} DT</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-sans">Anniversaire</span>
                    <span className="font-semibold text-espresso italic text-sm">Prix Sur Mesure</span>
                  </div>
                </>
              )}
            </div>
            <Link href="/order">
              <Button className="w-full bg-gold text-espresso hover:bg-gold/90 transition-colors duration-300 font-sans">
                Commander Maintenant
              </Button>
            </Link>
          </>
        ) : (
          <div className="text-center py-4">
            <Button disabled className="w-full bg-espresso/20 text-espresso/50 cursor-not-allowed font-sans">
              Bientôt Disponible
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
