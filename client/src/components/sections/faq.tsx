import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function FAQ() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: "Combien de temps se conserve le tiramisu ?",
      answer: "Notre tiramisu frais se déguste mieux dans les 3-4 jours lorsqu'il est conservé au réfrigérateur. Nous recommandons de le consommer dans les 48 heures pour une expérience gustative optimale.",
    },
    {
      question: "Utilisez-vous des œufs crus ?",
      answer: "Oui, notre recette traditionnelle inclut des œufs crus pasteurisés pour une saveur et une texture authentiques. Nous utilisons uniquement des œufs frais de la ferme de la plus haute qualité provenant de fournisseurs de confiance.",
    },
    {
      question: "Livrez-vous en dehors de la ville ?",
      answer: "Nous livrons actuellement dans un rayon de 25 km du centre-ville. Pour des occasions spéciales ou des commandes plus importantes, nous pouvons considérer des zones de livraison étendues. Veuillez nous contacter pour discuter de vos besoins spécifiques.",
    },
    {
      question: "Puis-je personnaliser les saveurs pour des événements spéciaux ?",
      answer: "Absolument ! Nous adorons créer des saveurs personnalisées pour les mariages, anniversaires et événements d'entreprise. Contactez-nous au moins 48 heures à l'avance pour discuter de vos exigences spéciales.",
    },
    {
      question: "Qu'est-ce qui est inclus dans la Boîte Fête ?",
      answer: "Notre Boîte Fête sert 8-10 personnes et est livrée avec des cuillères jetables, des serviettes et des instructions de service. Parfaite pour les rassemblements, les gâteries de bureau ou les célébrations familiales.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <section className="py-20 bg-cream">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6 text-espresso">
              Questions Fréquemment Posées
            </h2>
            <p className="text-xl text-espresso/70">
              Tout ce que vous devez savoir sur notre tiramisu
            </p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-warmWhite overflow-hidden">
                <button
                  className="w-full px-6 py-4 text-left font-semibold text-espresso hover:bg-gold/10 transition-colors duration-300 flex justify-between items-center"
                  onClick={() => toggleFAQ(index)}
                >
                  <span>{faq.question}</span>
                  <ChevronDown 
                    className={`w-5 h-5 transition-transform duration-300 ${
                      openFAQ === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFAQ === index && (
                  <div className="px-6 pb-4 animate-fade-in">
                    <p className="text-espresso/80">{faq.answer}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
