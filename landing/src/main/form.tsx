import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { toast } from "../hooks/use-toast";
import axios from "axios";

interface FormData {
  nom: string;
  email: string;
  telephone: string;
  message: string;
}

export function ContactForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    nom: "",
    email: "",
    telephone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://server.saphirweb.ma/api/google-sheets",
        JSON.stringify(formData),
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        toast({
          title: "Succès!",
          description: response.data.message,
        });
        setFormData({
          nom: "",
          email: "",
          telephone: "",
          message: "",
        });
      } else {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue. Veuillez réessayer.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor="nom"
        >
          Nom Complet
        </label>
        <Input
          id="nom"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          placeholder="Zakaryae Ennaciri"
          required
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <label
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor="email"
        >
          Email
        </label>
        <Input
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="example@example.com"
          required
          type="email"
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <label
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor="telephone"
        >
          Téléphone
        </label>
        <Input
          id="telephone"
          name="telephone"
          value={formData.telephone}
          onChange={handleChange}
          placeholder="+212 612345678 | 0612345678"
          required
          type="tel"
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <label
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor="message"
        >
          Message
        </label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Comment pouvons-nous vous aider ?"
          required
          className="h-24"
          disabled={isLoading}
        />
      </div>
      <Button
        className="w-full bg-[#B12B89] hover:bg-[#901d6d]"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Envoi en cours..." : "Envoyer"}
      </Button>
    </form>
  );
}
