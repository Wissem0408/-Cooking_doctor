import ProductCard from "@/components/ui/product-card";
import type { Product } from "@shared/schema";

export default function Menu() {
  const products: Product[] = [
    {
      id: "pistache",
      name: "Tiramisu Pistache",
      description: "Crème de pistache riche avec mascarpone authentique, créant une expérience gustative élégante et sophistiquée.",
      image: "https://images.pexels.com/photos/1346217/pexels-photo-1346217.jpeg",
      pricing: { small: 10, medium: 15, party: 0 },
    },
    {
      id: "speculoos",
      name: "Tiramisu Spéculoos",
      description: "Biscuits Spéculoos caramlisés en couches avec crème onctueuse, apportant chaleur et réconfort à chaque bouchée.",
      image: "https://images.pexels.com/photos/1707920/pexels-photo-1707920.jpeg",
      pricing: { small: 10, medium: 15, party: 0 },
    },
    {
      id: "noisette",
      name: "Tiramisu Noisette",
      description: "Saveurs délicates de noisette combinées avec mascarpone traditionnel pour un délice aromatiqu et savoureux.",
      image: "https://images.pexels.com/photos/8784720/pexels-photo-8784720.jpeg",
      pricing: { small: 10, medium: 15, party: 0 },
    },
    {
      id: "fraise",
      name: "Tiramisu Fraise",
      description: "Couches de fraises fraîches avec crème délicate - une création printanière parfaite qui arrive bientôt sur notre menu.",
      image: "https://images.pexels.com/photos/7221358/pexels-photo-7221358.jpeg",
      pricing: { small: 0, medium: 0, party: 0 },
      badge: "Bientôt Disponible",
    },
    {
      id: "mousse",
      name: "Mousse au chocolat",
      description: "Mousse au chocolat riche sans sucre préparée avec 72% de cacao pour une expérience intense et indulgente.",
      image: "https://images.pexels.com/photos/3026810/pexels-photo-3026810.jpeg",
      pricing: { small: 10, medium: 10, party: 0 },
      badge: "Sans sucre",
    },
  ];

  return (
    <section className="py-20 bg-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-6 text-espresso">
            Nos Saveurs
          </h1>
          <p className="text-xl text-espresso/70 max-w-2xl mx-auto">
            Découvrez notre sélection soigneusement choisie de saveurs de tiramisu premium, chacune étant un chef-d'œuvre
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
