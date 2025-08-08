import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InstagramGallery() {
  const images = [
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
    "https://images.unsplash.com/photo-1516684732162-798a0062be99?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
    "https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
    "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
    "https://pixabay.com/get/g9da0438f5ff3c8182fe8f6a4db428cf7c11c76943cf2ff24266468b2b158806e529e1ce0a6725d372e5927e216307b0b448a217879c62d549abb150a946d4ced_1280.jpg",
  ];

  return (
    <section className="py-20 bg-warmWhite">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6 text-espresso">
            Suivez Notre Parcours
          </h2>
          <p className="text-xl text-espresso/70 max-w-2xl mx-auto">
            Rejoignez notre famille Instagram et découvrez la magie derrière chaque création
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
          {images.map((image, index) => (
            <div 
              key={index}
              className="aspect-square overflow-hidden rounded-lg hover:scale-105 transition-transform duration-300"
            >
              <img 
                src={image}
                alt={`Publication Instagram ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button
            variant="outline"
            className="bg-gold text-espresso border-gold hover:bg-gold/90 px-8 py-4 rounded-full font-semibold"
            asChild
          >
            <a
              href="https://www.instagram.com/cooking_doctor/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="mr-3 w-5 h-5" />
              @cooking_doctor
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
