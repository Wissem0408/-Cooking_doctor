import { MapPin, Instagram } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Store {
  city: string;
  instagram: string;
  name: string;
}

export default function Stores() {
  const stores: Store[] = [
    {
      city: "Sousse",
      instagram: "@aftereightsousse",
      name: "After Eight Sousse",
    },
    {
      city: "Sousse",
      instagram: "@latiendabychemli",
      name: "La Tienda by Chemli",
    },
    {
      city: "Monastir",
      instagram: "@hadlet_epicerie_fine",
      name: "Hadlet Épicerie Fine",
    },
    {
      city: "Monastir",
      instagram: "@robusta_21",
      name: "Robusta 21",
    },
    {
      city: "Ariana",
      instagram: "@ayemzmentn",
      name: "Ayemz Mentn",
    },
    {
      city: "Sfax",
      instagram: "@shopadri_store",
      name: "Shop Adri Store",
    },
    {
      city: "Manouba",
      instagram: "",
      name: "Epicerie Torjméne",
    },
  ];

  const groupedStores = stores.reduce((acc, store) => {
    if (!acc[store.city]) {
      acc[store.city] = [];
    }
    acc[store.city].push(store);
    return acc;
  }, {} as Record<string, Store[]>);

  return (
    <div className="min-h-screen bg-cream">
      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-playfair text-5xl font-bold text-espresso mb-6">
            Où Nous Trouver
          </h1>
          <p className="text-xl text-espresso/80 max-w-3xl mx-auto leading-relaxed">
            Découvrez notre collection de tiramisu premium chez ces partenaires de vente au détail soigneusement sélectionnés à travers la Tunisie
          </p>
        </div>
        
        {/* Stores Grid */}
        <div className="max-w-6xl mx-auto">
          {Object.entries(groupedStores).map(([city, cityStores]) => (
            <div key={city} className="mb-12">
              <h2 className="font-playfair text-3xl font-bold text-espresso mb-6 flex items-center">
                <MapPin className="w-8 h-8 mr-3 text-gold" />
                {city}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {cityStores.map((store, index) => (
                  <Card key={index} className="bg-warmWhite shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <CardContent className="p-6">
                      <h3 className="font-playfair text-xl font-semibold text-espresso mb-3">
                        {store.name}
                      </h3>
                      {store.instagram && (
                        <div className="flex items-center text-espresso/70">
                          <Instagram className="w-5 h-5 mr-2 text-gold" />
                          <a 
                            href={`https://instagram.com/${store.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-gold transition-colors duration-300"
                          >
                            {store.instagram}
                          </a>
                        </div>
                      )}
                      {!store.instagram && (
                        <p className="text-espresso/70">Contacter directement</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 p-8 bg-warmWhite rounded-2xl shadow-lg">
          <h3 className="font-playfair text-2xl font-bold text-espresso mb-4">
            Vous Voulez Vendre Nos Produits ?
          </h3>
          <p className="text-espresso/70 mb-6">
            Intéressé à devenir partenaire de vente ? Contactez-nous pour en savoir plus sur les opportunités de vente en gros.
          </p>
          <a
            href="/contact"
            className="inline-block bg-gold text-espresso px-8 py-3 rounded-full font-semibold hover:bg-gold/90 transition-colors duration-300"
          >
            Contactez-Nous
          </a>
        </div>
      </div>
    </div>
  );
}
