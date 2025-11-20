type discountT = {
  type: 'percentage' | 'fixed'
  value: number
  validUntil: Date
}

type attributeT = {
  color: string
  type: string
  size: string
}

export type PopulatedReference = {
  _id: string
  name: string
}

export interface CreateProductT {
  name: string
  price: number
  description: string
  costPrice: number
  requestedOrganic: boolean
  discount?: discountT
  category: string
  attributes: attributeT
  productCatalog: string
  stock: number
  product_img_urls: string[]
}

export interface UpdateProductT {
  _id: string
  name: string
  price: number
  description: string
  costPrice: number
  requestedOrganic: boolean
  discount: discountT
  category: string
  attributes: attributeT
  productCatalog: string
  stock: number
  product_img_urls: string[]
}

export interface ProductT {
  name: string
  price: number
  description: string
  costPrice: number
  requestedOrganic: boolean
  discount: discountT
  category: PopulatedReference
  attributes: attributeT
  productCatalog: PopulatedReference
  stock: number
  finalPrice: number
}
