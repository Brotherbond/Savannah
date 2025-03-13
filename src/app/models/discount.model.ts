export interface Discount {
  id: number;
  code: string;
  type: "percent" | "fixed";
  value: number;
}
