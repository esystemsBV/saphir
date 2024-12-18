import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { toast } from "../hooks/use-toast";
import axios from "axios";
import { t } from "i18next";

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
        "https://server.saphirweb.ma/api/google-sheets",
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
          {t("fullname")}
        </label>
        <Input
          id="nom"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          placeholder={t("enter-fullname")}
          required
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <label
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor="email"
        >
          {t("email")}
        </label>
        <Input
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder={"example@example.com"}
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
          {t("phone")}
        </label>
        <Input
          id="telephone"
          name="telephone"
          value={formData.telephone}
          onChange={handleChange}
          placeholder={t("enter-phone")}
          required
          type="text"
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <label
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor="message"
        >
          {t("message")}
        </label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder={t("enter-message")}
          required
          className="h-24"
          disabled={isLoading}
        />
      </div>
      <Button
        className="w-full bg-[#B12B89] text-white hover:bg-[#901d6d]"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? t("loading") : t("send")}
      </Button>
    </form>
  );
}
