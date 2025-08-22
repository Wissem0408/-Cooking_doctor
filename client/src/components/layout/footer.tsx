import { Instagram, MessageCircle, Mail } from "lucide-react";

export default function Footer() {
  const handleEmailClick = async (e: React.MouseEvent) => {
    const email = "asmahannechi@gmail.com";

    // Try mailto first
    const mailto = `mailto:${email}`;

    try {
      window.location.href = mailto;

      // If mailto doesn't work (no default email client), copy to clipboard
      setTimeout(async () => {
        try {
          await navigator.clipboard.writeText(email);
          alert(`Email address copied to clipboard: ${email}`);
        } catch (err) {
          console.log("Could not copy email to clipboard");
          alert(`Please copy this email address: ${email}`);
        }
      }, 1000);
    } catch (err) {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(email);
        alert(`Email address copied to clipboard: ${email}`);
      } catch (clipboardErr) {
        alert(`Please copy this email address: ${email}`);
      }
    }
  };
  return (
    <footer className="bg-espresso text-warmWhite py-12">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <div className="font-playfair text-3xl font-bold mb-4">
            Tiramisu by Cooking Doctor
          </div>
          <p className="text-warmWhite/70 mb-6">
            Créer des moments de joie, un tiramisu à la fois
          </p>
          <div className="flex justify-center space-x-6 mb-8">
            <a
              href="https://www.instagram.com/cooking_doctor/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-gold rounded-full flex items-center justify-center hover:bg-opacity-90 transition-colors duration-300"
            >
              <Instagram className="w-5 h-5 text-espresso" />
            </a>
            <button
              onClick={handleEmailClick}
              className="w-12 h-12 bg-gold rounded-full flex items-center justify-center hover:bg-opacity-90 transition-colors duration-300"
            >
              <Mail className="w-5 h-5 text-espresso" />
            </button>
          </div>
          <p className="text-warmWhite/50 text-sm">
            © 2025 Tiramisu by Cooking Doctor. Fait avec ❤️ et beaucoup de mascarpone.
          </p>
        </div>
      </div>
    </footer>
  );
}
