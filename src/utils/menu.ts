import {
  FormConfig_allMenuYaml_edges, FormConfig_allMenuYaml_edges_node
} from "../generated/graphql/FormConfig";

type RecursiveNonNullable1<T> = { [K in keyof T]: RecursiveNonNullable<T[K]> };
type RecursiveNonNullable<T> = RecursiveNonNullable1<NonNullable<T>>;

export function replaceNodeIdMenu(
  node: RecursiveNonNullable1<FormConfig_allMenuYaml_edges>[],
  nodeId: string | undefined,
  ) : FormConfig_allMenuYaml_edges_node | null {
    return {
      ...node[0].node,
      "menu": {
        ...node[0].node.menu,
        "items": node[0].node.menu.items.map(item => {
          return {
            ...item,
            "slug": item.slug.replace(':nodeId', nodeId || '')
          }
        })
      },
    }
}
