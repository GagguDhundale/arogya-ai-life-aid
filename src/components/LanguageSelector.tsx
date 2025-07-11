import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Languages } from "lucide-react";
import { toast } from "sonner";

const INDIAN_LANGUAGES = [
  { code: "en", name: "English", native: "English" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "mr", name: "Marathi", native: "मराठी" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
  { code: "ur", name: "Urdu", native: "اردو" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", native: "മലയാളം" },
  { code: "or", name: "Odia", native: "ଓଡ଼ିଆ" },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "as", name: "Assamese", native: "অসমীয়া" },
  { code: "bh", name: "Bhojpuri", native: "भोजपुरी" },
  { code: "mai", name: "Maithili", native: "मैथिली" },
  { code: "mag", name: "Magahi", native: "मगही" },
  { code: "ne", name: "Nepali", native: "नेपाली" },
  { code: "si", name: "Sinhala", native: "සිංහල" },
  { code: "my", name: "Myanmar", native: "မြန်မာ" },
  { code: "ks", name: "Kashmiri", native: "कॉशुर" },
  { code: "sd", name: "Sindhi", native: "सिन्धी" },
  { code: "sa", name: "Sanskrit", native: "संस्कृत" },
  { code: "mni", name: "Manipuri", native: "মৈতৈলোন্" },
  { code: "kok", name: "Konkani", native: "कोंकणी" },
  { code: "doi", name: "Dogri", native: "डोगरी" },
  { code: "sat", name: "Santali", native: "ᱥᱟᱱᱛᱟᱲᱤ" },
  { code: "bo", name: "Tibetan", native: "བོད་ཡིག" },
  { code: "brx", name: "Bodo", native: "बर'" },
  { code: "raj", name: "Rajasthani", native: "राजस्थानी" },
  { code: "bho", name: "Bhojpuri", native: "भोजपुरी" }
];

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

const LanguageSelector = ({ currentLanguage, onLanguageChange }: LanguageSelectorProps) => {
  const handleLanguageChange = (languageCode: string) => {
    const selectedLanguage = INDIAN_LANGUAGES.find(lang => lang.code === languageCode);
    if (selectedLanguage) {
      onLanguageChange(languageCode);
      toast.success(`Language changed to ${selectedLanguage.name}`, {
        description: `Interface language updated to ${selectedLanguage.native}`,
      });
    }
  };

  const currentLang = INDIAN_LANGUAGES.find(lang => lang.code === currentLanguage) || INDIAN_LANGUAGES[0];

  return (
    <Select value={currentLanguage} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[140px]">
        <div className="flex items-center gap-2">
          <Languages className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLang.name}</span>
          <span className="sm:hidden">{currentLang.code.toUpperCase()}</span>
        </div>
      </SelectTrigger>
      <SelectContent className="max-h-64 overflow-y-auto">
        {INDIAN_LANGUAGES.map((language) => (
          <SelectItem key={language.code} value={language.code}>
            <div className="flex items-center justify-between w-full">
              <span className="font-medium">{language.name}</span>
              <span className="text-sm text-muted-foreground ml-2">{language.native}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;
