import { parseTime } from "./helpers";

declare module "helpers" {
    export const parseTime: (date: Date) => string
}
