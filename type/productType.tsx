export default interface ProductType {
productName: string;
image: string;
price: number;
id: number;
createdAt: string;
updatedAt: string;
}

// type/productInput.ts
export type ProductInput = {
  productName: string;
  image: string;
  price: number;
};