import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props) => <h1 data-publication-heading="1" {...props} />,
    h2: (props) => <h2 data-publication-heading="2" {...props} />,
    h3: (props) => <h3 data-publication-heading="3" {...props} />,
    a: (props) => <a data-publication-link {...props} />,
    table: (props) => <table data-publication-table {...props} />,
    thead: (props) => <thead {...props} />,
    tbody: (props) => <tbody {...props} />,
    tr: (props) => <tr {...props} />,
    th: (props) => <th {...props} scope={props.scope ?? "col"} />,
    td: (props) => <td {...props} />,
    blockquote: (props) => <blockquote data-publication-quote {...props} />,
    ul: (props) => <ul data-publication-list="unordered" {...props} />,
    ol: (props) => <ol data-publication-list="ordered" {...props} />,
    li: (props) => <li {...props} />,
    pre: (props) => <pre data-publication-code {...props} />,
    code: (props) => <code {...props} />,
    ...components,
  };
}
