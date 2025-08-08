import { useState } from "react";
import { useForm } from "react-hook-form";
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
  phoneNumber: z.string().min(1, "Le numéro de téléphone est requis"),
  deliveryAddress: z.string().min(1, "L'adresse de livraison est requise"),
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

export default function Order() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      fullName: "",
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
      const webhookUrl = "https://hook.eu2.make.com/oad631ehh8j4qf7ooslkciijytqe8bfa";
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

    const orderData: Order = {
      fullName: data.fullName,
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
              Place Your Order
            </h1>
            <p className="text-xl text-espresso/70 max-w-2xl mx-auto">
              Just a few details and your premium tiramisu will be on its way
            </p>
          </div>
          
          <CountdownTimer />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="bg-cream rounded-2xl p-8 shadow-xl space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <h3 className="font-playfair text-2xl font-bold text-espresso mb-4">Personal Information</h3>
                  
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-espresso">Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-warmWhite border-espresso/20 focus:border-gold" />
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
                        <FormLabel className="text-espresso">Phone Number</FormLabel>
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
                        <FormLabel className="text-espresso">Delivery Address</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={3} className="bg-warmWhite border-espresso/20 focus:border-gold resize-none" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Order Details */}
                <div className="space-y-6">
                  <h3 className="font-playfair text-2xl font-bold text-espresso mb-4">Order Details</h3>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-espresso">Select Your Tiramisu</h4>
                    
                    {/* Tiramisu Pistache */}
                    <div className="p-4 bg-warmWhite rounded-lg border border-espresso/20">
                      <h5 className="font-semibold text-espresso mb-3">Tiramisu Pistache</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <FormField
                          control={form.control}
                          name="pistacheSmall"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Small (10 DT)</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" max="10" placeholder="Qty" className="w-full" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="pistacheLarge"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Large (15 DT)</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" max="10" placeholder="Qty" className="w-full" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="pistacheBirthday"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Birthday (Custom)</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" max="10" placeholder="Qty" className="w-full" {...field} />
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
                              <FormLabel className="text-sm">Small (10 DT)</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" max="10" placeholder="Qty" className="w-full" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="speculoosLarge"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Large (15 DT)</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" max="10" placeholder="Qty" className="w-full" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="speculoosBirthday"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Birthday (Custom)</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" max="10" placeholder="Qty" className="w-full" {...field} />
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
                              <FormLabel className="text-sm">Small (10 DT)</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" max="10" placeholder="Qty" className="w-full" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="noisetteLarge"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Large (15 DT)</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" max="10" placeholder="Qty" className="w-full" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="noisetteBirthday"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Birthday (Custom)</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" max="10" placeholder="Qty" className="w-full" {...field} />
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
                                <Input type="number" min="0" max="10" placeholder="Qty" className="w-full" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Delivery Schedule */}
              <div className="grid md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="deliveryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-espresso">Delivery Date</FormLabel>
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
                      <FormLabel className="text-espresso">Preferred Time</FormLabel>
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
                    <FormLabel className="text-espresso">Special Notes (allergies, occasion, etc.)</FormLabel>
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
                    <FormLabel className="text-espresso font-semibold">Payment Method</FormLabel>
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
                            Cash on Delivery
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
                    "Submitting..."
                  ) : (
                    <>
                      <Send className="mr-2 w-5 h-5" />
                      Place Your Order
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
