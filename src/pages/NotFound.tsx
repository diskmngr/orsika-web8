import { BrandMark } from "@/components/site/BrandMark";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Home, Megaphone } from "lucide-react";
import { Link } from "react-router";

export default function NotFound() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background px-6 text-center"
    >
      <Link to="/" aria-label="Orsika Web — beranda">
        <BrandMark />
      </Link>

      <div>
        <p className="font-display text-6xl font-semibold text-primary">404</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">
          Halaman tidak ditemukan
        </h1>
        <p className="mx-auto mt-3 max-w-md text-base leading-7 text-muted-foreground">
          Sepertinya tautan yang kamu buka sudah berpindah atau belum tersedia.
          Mari kembali ke beranda untuk melanjutkan.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild className="rounded-full">
          <Link to="/">
            <Home className="size-4" />
            Kembali ke Beranda
          </Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full">
          <Link to="/aspirasi">
            <Megaphone className="size-4" />
            Kirim Aspirasi
          </Link>
        </Button>
      </div>
    </motion.main>
  );
}
