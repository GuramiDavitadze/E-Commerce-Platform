import { Suspense } from "react";
import ProductsClientPage from "./ProductsClientPage";

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsClientPage/>
    </Suspense>

  )
}