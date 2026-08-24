declare module "*.mdx" {
  import type { ComponentType } from "react";
  import type { MDXComponents } from "mdx/types";

  const MDXContent: ComponentType<{
    readonly components?: MDXComponents;
  }>;

  export default MDXContent;
}
