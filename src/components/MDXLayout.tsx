import { MDXProvider } from "@mdx-js/react";
import * as React from "react";
import StaticLayout from "./StaticLayout";

const MDXLayout = ({ children: content }: { children: React.ReactNode }) => {
  return (
    <MDXProvider
      components={{
        h1: ({ children, rest }: { children: React.ReactNode; rest: any }) => (
          <h1 style={{ maxWidth: "12em" }} {...rest}>
            {children}
          </h1>
        ),
        h2: ({
          children,
          ...rest
        }: {
          children: React.ReactNode;
          rest: any;
        }) => (
          <h2 style={{ maxWidth: "15em" }} {...rest}>
            {children}
          </h2>
        ),
        p: ({ children }: { children: React.ReactNode }) => (
          <p className="w-paragraph my-4">{children}</p>
        ),
        ul: ({ children }: { children: React.ReactNode }) => (
          <ul className="my-4">{children}</ul>
        ),
        li: ({ children }: { children: React.ReactNode }) => (
          <li className="my-4">{children}</li>
        ),
        wrapper: (props: any) => {
          return (
            <StaticLayout
              {...props}
              breadcrumbItems={props._frontmatter.breadcrumb || []}
            />
          );
        }
      }}
    >
      {content}
    </MDXProvider>
  );
};

export default MDXLayout;
