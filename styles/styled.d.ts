import { ThemeType } from "./theme";
import {} from "styled-components";
declare module "styled-components" {
  export interface DefaultTheme extends ThemeType {} // extends the global DefaultTheme with our ThemeType.
}
