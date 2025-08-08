import { Instagram, MessageCircle, Mail, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FAQ from "@/components/sections/faq";

export default function Contact() {
  return (
    <div>
      <section className="py-20 bg-warmWhite">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-6 text-espresso">
              Contactez-Nous
            </h1>
            <p className="text-xl text-espresso/70 mb-12">
              Vous avez des questions ou des demandes spéciales ? Nous aimerions avoir de vos nouvelles
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-cream shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
                    <Instagram className="text-espresso text-2xl" />
                  </div>
                  <h3 className="font-playfair text-xl font-bold mb-4 text-espresso">Suivez-Nous</h3>
                  <p className="text-espresso/70 mb-6">Restez informé de nos dernières créations et du contenu en coulisses</p>
                  <Button className="bg-gold text-espresso hover:bg-gold/90 rounded-full font-semibold" href="https://www.instagram.com/cooking_doctor/"
                    target="_blank"
                    rel="noopener noreferrer">
                    @cooking_doctor
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-cream shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
                    <Instagram className="text-espresso text-2xl" />
                  </div>
                  <h3 className="font-playfair text-xl font-bold mb-4 text-espresso">Suivez-Nous</h3>
                  <p className="text-espresso/70 mb-6">Restez informé de nos dernières créations et du contenu en coulisses</p>
                  <Button className="bg-gold text-espresso hover:bg-gold/90 rounded-full font-semibold">
                    href="https://www.instagram.com/bycookingdoctor/"
                    target="_blank"
                    rel="noopener noreferrer"
                    @bycookingdoctor
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-12 pt-8 border-t border-espresso/20">
              <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8 text-espresso/60">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>asmahannechi@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <FAQ />
    </div>
  );
}
