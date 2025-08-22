import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import CountdownTimer from "@/components/ui/countdown-timer";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { orderSchema, type Order } from "@shared/schema";
import { z } from "zod";

const orderFormSchema = z.object({
  fullName: z.string().min(1, "Le nom complet est requis"),
  email: z.string().email("L'adresse email n'est pas valide").min(1, "L'email est requis"),
  phoneNumber: z.string().min(1, "Le numéro de téléphone est requis"),
  deliveryAddress: z.string().min(1, "La ville de livraison est requise"),
  deliveryDate: z.string().min(1, "La date de livraison est requise"),
  deliveryTime: z.string().min(1, "L'heure de livraison est requise"),
  notes: z.string().optional(),
  paymentMethod: z.literal("cash"),
  // Product selections - separate fields for each size
  pistacheSmall: z.string().optional(),
  pistacheLarge: z.string().optional(),
  pistacheBirthday: z.string().optional(),
  speculoosSmall: z.string().optional(),
  speculoosLarge: z.string().optional(),
  speculoosBirthday: z.string().optional(),
  noisetteSmall: z.string().optional(),
  noisetteLarge: z.string().optional(),
  noisetteBirthday: z.string().optional(),
  mousse: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderFormSchema>;

interface OrderSummaryProps {
  control: any;
}

function OrderSummary({ control }: OrderSummaryProps) {
  const watchedValues = useWatch({ control });

  // Calculate current order total and check for birthday items
  const calculateOrderSummary = () => {
    let total = 0;
    let hasBirthday = false;

    // Tiramisu items (10 DT small, 15 DT large)
    const tiramisuItems = [
      { small: watchedValues.pistacheSmall, large: watchedValues.pistacheLarge, birthday: watchedValues.pistacheBirthday },
      { small: watchedValues.speculoosSmall, large: watchedValues.speculoosLarge, birthday: watchedValues.speculoosBirthday },
      { small: watchedValues.noisetteSmall, large: watchedValues.noisetteLarge, birthday: watchedValues.noisetteBirthday }
    ];

    tiramisuItems.forEach(item => {
      if (item.small && parseInt(item.small) > 0) total += parseInt(item.small) * 10;
      if (item.large && parseInt(item.large) > 0) total += parseInt(item.large) * 15;
      if (item.birthday && parseInt(item.birthday) > 0) hasBirthday = true;
    });

    // Mousse (10 DT)
    if (watchedValues.mousse && parseInt(watchedValues.mousse) > 0) {
      total += parseInt(watchedValues.mousse) * 10;
    }

    return { total, hasBirthday };
  };

  const { total, hasBirthday } = calculateOrderSummary();
  const meetsMinimum = hasBirthday || total >= 60;

  if (total === 0 && !hasBirthday) return null;

  return (
    <div className={`p-6 rounded-lg border-2 ${meetsMinimum ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
      <h3 className="font-playfair text-xl font-bold mb-4 text-espresso">Résumé de la Commande</h3>

      <div className="space-y-2">
        {!hasBirthday && (
          <div className="flex justify-between items-center">
            <span className="text-espresso">Total actuel:</span>
            <span className="font-semibold text-espresso">{total} DT</span>
          </div>
        )}

        {hasBirthday && (
          <div className="flex items-center text-gold">
            <span className="font-semibold">✨ Gâteau d'anniversaire inclus - Pas de minimum requis</span>
          </div>
        )}

        {!hasBirthday && total < 60 && (
          <div className="text-yellow-700 text-sm">
            <span>Minimum requis: 60 DT</span>
            <br />
            <span>Il vous reste: {60 - total} DT à ajouter</span>
          </div>
        )}

        {!hasBirthday && total >= 60 && (
          <div className="text-green-700 text-sm font-semibold">
            ✅ Minimum atteint - Prêt à commander!
          </div>
        )}
      </div>
    </div>
  );
}

export default function Order() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      deliveryAddress: "",
      deliveryDate: "",
      deliveryTime: "",
      notes: "",
      paymentMethod: "cash",
      pistacheSmall: "",
      pistacheLarge: "",
      pistacheBirthday: "",
      speculoosSmall: "",
      speculoosLarge: "",
      speculoosBirthday: "",
      noisetteSmall: "",
      noisetteLarge: "",
      noisetteBirthday: "",
      mousse: "",
    },
  });

  const submitOrderMutation = useMutation({
    mutationFn: async (data: Order) => {
      const webhookUrl = import.meta.env.VITE_MAKE_WEBHOOK_URL;
      return fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Commande Envoyée !",
        description: "Nous vous contacterons bientôt pour confirmer votre commande.",
      });
    },
    onError: (error) => {
      toast({
        title: "Échec de la Commande",
        description: "Il y a eu une erreur lors de l'envoi de votre commande. Veuillez réessayer.",
        variant: "destructive",
      });
      console.error("Order submission error:", error);
    },
  });

  const onSubmit = (data: OrderFormData) => {
    const products: Array<{ name: string; size: "small" | "large" | "birthday" | "standard"; quantity: number; price: number }> = [];
    const pricing = { small: 10, large: 15 };

    // Helper function to add product if quantity is provided
    const addProduct = (name: string, size: "small" | "large" | "birthday", quantityStr: string | undefined) => {
      if (quantityStr && quantityStr.trim() && parseInt(quantityStr) > 0) {
        const quantity = parseInt(quantityStr);
        let price = 0;
        
        if (size === "small") price = pricing.small * quantity;
        else if (size === "large") price = pricing.large * quantity;
        // Birthday cakes have custom pricing (0 indicates custom)
        
        products.push({
          name,
          size,
          quantity,
          price,
        });
      }
    };

    // Process Tiramisu Pistache
    addProduct("Tiramisu Pistache", "small", data.pistacheSmall);
    addProduct("Tiramisu Pistache", "large", data.pistacheLarge);
    addProduct("Tiramisu Pistache", "birthday", data.pistacheBirthday);

    // Process Tiramisu Spéculoos
    addProduct("Tiramisu Spéculoos", "small", data.speculoosSmall);
    addProduct("Tiramisu Spéculoos", "large", data.speculoosLarge);
    addProduct("Tiramisu Spéculoos", "birthday", data.speculoosBirthday);

    // Process Tiramisu Noisette
    addProduct("Tiramisu Noisette", "small", data.noisetteSmall);
    addProduct("Tiramisu Noisette", "large", data.noisetteLarge);
    addProduct("Tiramisu Noisette", "birthday", data.noisetteBirthday);

    // Process Mousse au chocolat
    if (data.mousse && data.mousse.trim() && parseInt(data.mousse) > 0) {
      const quantity = parseInt(data.mousse);
      products.push({
        name: "Mousse au chocolat",
        size: "standard",
        quantity,
        price: 10 * quantity,
      });
    }

    if (products.length === 0) {
      toast({
        title: "Aucun Produit Sélectionné",
        description: "Veuillez sélectionner au moins un produit tiramisu.",
        variant: "destructive",
      });
      return;
    }

    // Check if any birthday items are ordered
    const hasBirthdayItems = products.some(product => product.size === "birthday");

    // Calculate total order value (excluding birthday items which have custom pricing)
    const totalOrderValue = products
      .filter(product => product.size !== "birthday")
      .reduce((total, product) => total + product.price, 0);

    // Validate minimum order amount (60DT) unless birthday items are ordered
    if (!hasBirthdayItems && totalOrderValue < 60) {
      toast({
        title: "Commande Minimum Non Atteinte",
        description: `La commande minimum est de 60 DT. Votre commande actuelle: ${totalOrderValue} DT. Ajoutez plus d'articles ou commandez un gâteau d'anniversaire.`,
        variant: "destructive",
      });
      return;
    }

    const orderData: Order = {
      fullName: data.fullName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      deliveryAddress: data.deliveryAddress,
      products,
      deliveryDate: data.deliveryDate,
      deliveryTime: data.deliveryTime,
      notes: data.notes || "",
      paymentMethod: "cash",
    };

    submitOrderMutation.mutate(orderData);
  };

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  if (isSubmitted) {
    return (
      <section className="py-20 bg-warmWhite min-h-screen flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="bg-gold/10 border-gold shadow-xl">
              <CardContent className="p-12">
                <CheckCircle className="w-16 h-16 text-gold mx-auto mb-6" />
                <h1 className="font-playfair text-3xl font-bold text-espresso mb-4">Merci !</h1>
                <p className="text-lg text-espresso/80 mb-6">
                  Nous avons reçu votre commande et vous contacterons bientôt pour confirmer les détails.
                  Préparez-vous pour une expérience tiramisu incroyable !
                </p>
                <Button 
                  onClick={() => {
                    setIsSubmitted(false);
                    form.reset();
                  }}
                  variant="outline"
                  className="border-gold text-gold hover:bg-gold hover:text-espresso"
                >
                  Passer une Autre Commande
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-warmWhite">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-6 text-espresso">
              Passez Votre Commande
            </h1>
            <p className="text-xl text-espresso/70 max-w-2xl mx-auto">
              Juste quelques détails et votre tiramisu premium sera en route
            </p>
          </div>
          
          <CountdownTimer />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="bg-cream rounded-2xl p-8 shadow-xl space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <h3 className="font-playfair text-2xl font-bold text-espresso mb-4">Informations Personnelles</h3>
                  
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-espresso">Nom Complet</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-warmWhite border-espresso/20 focus:border-gold" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-espresso">Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} className="bg-warmWhite border-espresso/20 focus:border-gold" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-espresso">Numéro de Téléphone</FormLabel>
                        <FormControl>
                          <Input type="tel" {...field} className="bg-warmWhite border-espresso/20 focus:border-gold" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="deliveryAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-espresso">Ville de Livraison</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-warmWhite border-espresso/20 focus:border-gold">
                              <SelectValue placeholder="Sélectionnez votre ville" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Tunis">Tunis</SelectItem>
                            <SelectItem value="Manouba">Manouba</SelectItem>
                            <SelectItem value="Hammamet">Hammamet</SelectItem>
                            <SelectItem value="Sousse">Sousse</SelectItem>
                            <SelectItem value="Monastir">Monastir</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Order Details */}
                <div className="space-y-6">
                  <h3 className="font-playfair text-2xl font-bold text-espresso mb-4">Détails de la Commande</h3>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-espresso">Choisissez Votre Tiramisu</h4>
                    
                    {/* Tiramisu Pistache */}
                    <div className="p-4 bg-warmWhite rounded-lg border border-espresso/20">
                      <h5 className="font-semibold text-espresso mb-3">Tiramisu Pistache</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <FormField
                          control={form.control}
                          name="pistacheSmall"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Petit (10 DT)</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" max="10" placeholder="Qté" className="w-full" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="pistacheLarge"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Grand (15 DT)</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" max="10" placeholder="Qté" className="w-full" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="pistacheBirthday"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Anniversaire (Sur mesure)</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" max="10" placeholder="Qté" className="w-full" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Tiramisu Spéculoos */}
                    <div className="p-4 bg-warmWhite rounded-lg border border-espresso/20">
                      <h5 className="font-semibold text-espresso mb-3">Tiramisu Spéculoos</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <FormField
                          control={form.control}
                          name="speculoosSmall"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Petit (10 DT)</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" max="10" placeholder="Qté" className="w-full" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="speculoosLarge"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Grand (15 DT)</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" max="10" placeholder="Qté" className="w-full" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="speculoosBirthday"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Anniversaire (Sur mesure)</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" max="10" placeholder="Qté" className="w-full" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Tiramisu Noisette */}
                    <div className="p-4 bg-warmWhite rounded-lg border border-espresso/20">
                      <h5 className="font-semibold text-espresso mb-3">Tiramisu Noisette</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <FormField
                          control={form.control}
                          name="noisetteSmall"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Petit (10 DT)</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" max="10" placeholder="Qté" className="w-full" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="noisetteLarge"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Grand (15 DT)</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" max="10" placeholder="Qté" className="w-full" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="noisetteBirthday"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Anniversaire (Sur mesure)</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" max="10" placeholder="Qté" className="w-full" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Mousse au chocolat */}
                    <div className="p-4 bg-warmWhite rounded-lg border border-espresso/20">
                      <h5 className="font-semibold text-espresso mb-3">Mousse au chocolat</h5>
                      <div className="grid grid-cols-1 gap-3">
                        <FormField
                          control={form.control}
                          name="mousse"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Sans sucre 72% cacao (10 DT)</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" max="10" placeholder="Qté" className="w-full" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <OrderSummary control={form.control} />

              {/* Delivery Schedule */}
              <div className="grid md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="deliveryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-espresso">Date de Livraison</FormLabel>
                      <FormControl>
                        <Input type="date" min={today} {...field} className="bg-warmWhite border-espresso/20 focus:border-gold" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="deliveryTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-espresso">Heure Préférée</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} className="bg-warmWhite border-espresso/20 focus:border-gold" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Additional Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-espresso">Notes Spéciales (allergies, occasion, etc.)</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={3} className="bg-warmWhite border-espresso/20 focus:border-gold resize-none" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Payment Method */}
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-espresso font-semibold">Méthode de Paiement</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex items-center p-4 bg-warmWhite rounded-lg border border-espresso/20"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="cash" id="cash" />
                          <label htmlFor="cash" className="flex items-center font-medium">
                            <i className="fas fa-money-bill-wave mr-2 text-gold"></i>
                            Paiement à la Livraison
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Submit Button */}
              <div className="text-center">
                <Button 
                  type="submit" 
                  disabled={submitOrderMutation.isPending}
                  className="w-full md:w-auto bg-gold text-espresso px-12 py-4 rounded-full font-bold text-lg hover:bg-gold/90 transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  {submitOrderMutation.isPending ? (
                    "Envoi en cours..."
                  ) : (
                    <>
                      <Send className="mr-2 w-5 h-5" />
                      Passez Votre Commande
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
