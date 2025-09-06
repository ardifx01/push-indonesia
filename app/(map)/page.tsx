import GameLoadingFallback from "@/components/ui/BatikLoadingFallback";
import SmartIframe from "@/components/ui/SmartIframe";

export default async function Page() {
  return (
    <main className="min-h-dvh">
      <SmartIframe
        src="https://indonesian-cultures-lake.vercel.app/"
        title="Dashboard Indonesian Cultures"
        className="min-h-dvh w-full"
        fallback={
          <GameLoadingFallback
            title="Memuat Peta Budaya…"
            subtitle="Menyiapkan layer wilayah & ikon provinsi"
            stopAt={93}
            mode="overlay"
          />
        }
        timeoutMs={4000}
      />
    </main>
  );
}
