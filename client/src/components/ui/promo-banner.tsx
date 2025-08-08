import { Gift } from "lucide-react";

export default function PromoBanner() {
  return (
    <div className="bg-gold text-espresso py-3 text-center font-medium text-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center space-x-2">
          <Gift className="w-4 h-4" />
          <span>Pré-commande pour les Fêtes – Places Limit��es Disponibles !</span>
        </div>
      </div>
    </div>
  );
}
