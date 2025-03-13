export interface Discount {
  code: string;
  type: "percent" | "fixed";
  value: number;
}
