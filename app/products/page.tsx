import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { ProductsExplorer } from "@/components/products/products-explorer";
import { products } from "@/lib/mock-data";
import { getProductsForDashboard } from "@/lib/supabase/products";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const realProducts = await getProductsForDashboard();
  const productList = realProducts.length > 0 ? realProducts : products;

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          description="Scan researched products, compare market signals, and open the strongest opportunities for deeper review."
          eyebrow="Product research"
          title="Product Scanner"
        />

        <ProductsExplorer products={productList} />
      </div>
    </AppShell>
  );
}
