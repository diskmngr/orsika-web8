import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useEffect } from "react";

/**
 * Mengisi data contoh saat aplikasi pertama kali dibuka.
 * Mutation di sisi server bersifat idempoten, jadi tidak akan
 * menimpa data yang sudah ada.
 */
export function DataSeeder() {
  const seed = useMutation(api.orsika.seedPlaceholderData);

  useEffect(() => {
    seed().catch((error) => {
      console.warn("[Orsika] Gagal menyiapkan data contoh:", error);
    });
  }, [seed]);

  return null;
}
