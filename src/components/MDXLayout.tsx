import { MDXProvider } from "@mdx-js/react";
import * as React from "react";
import StaticLayout from "./StaticLayout";

const MDXLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <MDXProvider
      components={{
        h1: ({ children }) => <h1 style={{ maxWidth: "12em" }}>{children}</h1>,
        h2: ({ children }) => <h2 style={{ maxWidth: "15em" }}>{children}</h2>,
        p: ({ children }) => <p className="w-paragraph my-4">{children}</p>,
        ul: ({ children }) => <ul className="my-4">{children}</ul>,
        li: ({ children }) => <li className="my-4">{children}</li>,
        wrapper: StaticLayout
      }}
    >
      {children};
    </MDXProvider>
  );
};

export default MDXLayout;
