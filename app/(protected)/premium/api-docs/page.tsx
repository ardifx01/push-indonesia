// app/premium/api-docs/page.tsx
import ApiDocs from "@/components/api/ApiDocs";

export const metadata = { title: "API Docs · Premium" };

export default function PremiumApiDocsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <ApiDocs />
    </div>
  );
}
