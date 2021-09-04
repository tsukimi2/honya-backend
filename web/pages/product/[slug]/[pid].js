import { useRouter } from 'next/router'
import ProductPageComponent from '../../../components/page/ProductPageComponent'
import { useProduct, useRelatedProducts } from '../../../libs/apiUtils/product-api-utils'

const ProductPage = () => {
  const router = useRouter()
  const { pid } = router.query
  const { product, isLoading:isLoadingProduct, isError } = useProduct({ fullUrl: false, id: pid })
  const { products: relatedProducts, isLoading: isLoadingRelatedProducts } = useRelatedProducts(pid)

  return (
    <ProductPageComponent
      isLoadingProduct={isLoadingProduct}
      isLoadingRelatedProducts={isLoadingRelatedProducts}
      product={product}
      relatedProducts={relatedProducts}
    />
  )
}

export default ProductPage