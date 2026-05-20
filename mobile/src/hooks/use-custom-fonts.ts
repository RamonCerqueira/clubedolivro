import { useFonts, Inter_400Regular, Inter_700Bold } from "@expo-google-fonts/inter";
import { Outfit_400Regular, Outfit_700Bold } from "@expo-google-fonts/outfit";

export function useCustomFonts() {
  const [loaded, error] = useFonts({
    Inter: Inter_400Regular,
    "Inter-Bold": Inter_700Bold,
    Outfit: Outfit_400Regular,
    "Outfit-Bold": Outfit_700Bold,
  });

  return { loaded, error };
}
