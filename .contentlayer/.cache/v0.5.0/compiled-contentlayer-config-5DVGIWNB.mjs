var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// lib/utils.ts
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
var init_utils = __esm({
  "lib/utils.ts"() {
    "use strict";
  }
});

// registry/components/ui/animated-list.tsx
import React2, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
function AnimatedListItem({ children }) {
  const animations = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1, originY: 0 },
    exit: { scale: 0, opacity: 0 },
    transition: { type: "spring", stiffness: 350, damping: 40 }
  };
  return /* @__PURE__ */ React2.createElement(motion.div, { ...animations, layout: true, className: "mx-auto w-full" }, children);
}
var AnimatedList;
var init_animated_list = __esm({
  "registry/components/ui/animated-list.tsx"() {
    "use strict";
    "use client";
    AnimatedList = React2.memo(
      ({ className, children, delay = 1e3 }) => {
        const [index, setIndex] = useState(0);
        const childrenArray = React2.Children.toArray(children);
        useEffect(() => {
          const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % childrenArray.length);
          }, delay);
          return () => clearInterval(interval);
        }, [childrenArray.length, delay]);
        const itemsToShow = useMemo(
          () => childrenArray.slice(0, index + 1).reverse(),
          [index, childrenArray]
        );
        return /* @__PURE__ */ React2.createElement("div", { className: `flex flex-col items-center gap-4 ${className}` }, /* @__PURE__ */ React2.createElement(AnimatePresence, null, itemsToShow.map((item) => /* @__PURE__ */ React2.createElement(AnimatedListItem, { key: item.key }, item))));
      }
    );
    AnimatedList.displayName = "AnimatedList";
  }
});

// registry/components/example/animated-list-demo.tsx
var animated_list_demo_exports = {};
__export(animated_list_demo_exports, {
  default: () => AnimatedListDemo
});
function AnimatedListDemo({
  className
}) {
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      className: cn(
        "relative flex h-[500px] w-full flex-col p-6 overflow-hidden rounded-lg border bg-background md:shadow-xl",
        className
      )
    },
    /* @__PURE__ */ React.createElement(AnimatedList, null, notifications.map((item, idx) => /* @__PURE__ */ React.createElement(Notification, { ...item, key: idx })))
  );
}
var notifications, Notification;
var init_animated_list_demo = __esm({
  "registry/components/example/animated-list-demo.tsx"() {
    "use strict";
    "use client";
    init_utils();
    init_animated_list();
    notifications = [
      {
        name: "Payment received",
        description: "Magic UI",
        time: "15m ago",
        icon: "\u{1F4B8}",
        color: "#00C9A7"
      },
      {
        name: "User signed up",
        description: "Magic UI",
        time: "10m ago",
        icon: "\u{1F464}",
        color: "#FFB800"
      },
      {
        name: "New message",
        description: "Magic UI",
        time: "5m ago",
        icon: "\u{1F4AC}",
        color: "#FF3D71"
      },
      {
        name: "New event",
        description: "Magic UI",
        time: "2m ago",
        icon: "\u{1F5DE}\uFE0F",
        color: "#1E86FF"
      }
    ];
    notifications = Array.from({ length: 10 }, () => notifications).flat();
    Notification = ({ name, description, icon, color, time }) => {
      return /* @__PURE__ */ React.createElement(
        "figure",
        {
          className: cn(
            "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4",
            // animation styles
            "transition-all duration-200 ease-in-out hover:scale-[103%]",
            // light styles
            "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
            // dark styles
            "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]"
          )
        },
        /* @__PURE__ */ React.createElement("div", { className: "flex flex-row items-center gap-3" }, /* @__PURE__ */ React.createElement(
          "div",
          {
            className: "flex size-10 items-center justify-center rounded-2xl",
            style: {
              backgroundColor: color
            }
          },
          /* @__PURE__ */ React.createElement("span", { className: "text-lg" }, icon)
        ), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col overflow-hidden" }, /* @__PURE__ */ React.createElement("figcaption", { className: "flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white " }, /* @__PURE__ */ React.createElement("span", { className: "text-sm sm:text-lg" }, name), /* @__PURE__ */ React.createElement("span", { className: "mx-1" }, "\xB7"), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-gray-500" }, time)), /* @__PURE__ */ React.createElement("p", { className: "text-sm font-normal dark:text-white/60" }, description)))
      );
    };
  }
});

// contentlayer.config.ts
import {
  defineDocumentType,
  defineNestedType,
  makeSource
} from "contentlayer2/source-files";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { visit as visit3 } from "unist-util-visit";

// lib/rehype-component.ts
import fs from "fs";
import path from "path";
import { u } from "unist-builder";
import { visit } from "unist-util-visit";

// registry/index.tsx
import * as React3 from "react";
var ui = {
  "animated-list": {
    name: "animated-list",
    type: "components:ui",
    files: ["registry/components/ui/animated-list.tsx"]
  }
};
var example = {
  "animated-list-demo": {
    name: "animated-list-demo",
    type: "components:example",
    registryDependencies: ["animated-list"],
    files: ["registry/components/example/animated-list-demo.tsx"],
    component: React3.lazy(
      () => Promise.resolve().then(() => (init_animated_list_demo(), animated_list_demo_exports))
    )
  }
};
var registry = {
  ...ui,
  ...example
};
var resolvedExamples = Object.entries(example).map(([key, value]) => ({
  ...value,
  component: () => void 0
}));
var updatedExample = resolvedExamples.reduce(
  (acc, curr) => ({ ...acc, [curr.name]: curr }),
  {}
);
var downloadRegistry = { ...ui, ...updatedExample };

// lib/rehype-component.ts
function rehypeComponent() {
  return async (tree) => {
    visit(tree, (node) => {
      const { value: src } = getNodeAttributeByName(node, "src") || {};
      if (node.name === "ComponentSource") {
        const name = getNodeAttributeByName(node, "name")?.value;
        if (!name) {
          return null;
        }
        try {
          const component = registry[name];
          const src2 = component.files[0];
          const filePath = path.join(process.cwd(), src2);
          let source = fs.readFileSync(filePath, "utf8");
          source = source.replaceAll(`@/registry/`, "@/");
          node.children?.push(
            u("element", {
              tagName: "pre",
              properties: {
                __src__: src2
              },
              // attributes: [
              //   {
              //     name: "styleName",
              //     type: "mdxJsxAttribute",
              //     value: style.name,
              //   },
              // ],
              children: [
                u("element", {
                  tagName: "code",
                  properties: {
                    className: ["language-tsx"]
                  },
                  data: {
                    meta: `event="copy_source_code"`
                  },
                  children: [
                    {
                      type: "text",
                      value: source
                    }
                  ]
                })
              ]
            })
          );
        } catch (error) {
          console.error(error);
        }
      }
      if (node.name === "ComponentPreview" || node.name === "BlockPreview") {
        const name = getNodeAttributeByName(node, "name")?.value;
        if (!name) {
          return null;
        }
        try {
          const component = registry[name];
          const src2 = component.files[0];
          const filePath = path.join(process.cwd(), src2);
          let source = fs.readFileSync(filePath, "utf8");
          source = source.replaceAll(`@/registry/`, "@/");
          source = source.replaceAll("export default", "export");
          node.children?.push(
            u("element", {
              tagName: "pre",
              properties: {
                __src__: src2
              },
              children: [
                u("element", {
                  tagName: "code",
                  properties: {
                    className: ["language-tsx"]
                  },
                  data: {
                    meta: `event="copy_usage_code"`
                  },
                  children: [
                    {
                      type: "text",
                      value: source
                    }
                  ]
                })
              ]
            })
          );
        } catch (error) {
          console.error(error);
        }
      }
    });
  };
}
function getNodeAttributeByName(node, name) {
  return node.attributes?.find((attribute) => attribute.name === name);
}

// lib/rehype-npm-command.ts
import { visit as visit2 } from "unist-util-visit";
function rehypeNpmCommand() {
  return (tree) => {
    visit2(tree, (node) => {
      if (node.type !== "element" || node?.tagName !== "pre") {
        return;
      }
      if (node.properties?.["__rawString__"]?.startsWith("npm install")) {
        const npmCommand = node.properties?.["__rawString__"];
        node.properties["__npmCommand__"] = npmCommand;
        node.properties["__yarnCommand__"] = npmCommand.replace(
          "npm install",
          "yarn add"
        );
        node.properties["__pnpmCommand__"] = npmCommand.replace(
          "npm install",
          "pnpm add"
        );
        node.properties["__bunCommand__"] = npmCommand.replace(
          "npm install",
          "bun add"
        );
      }
      if (node.properties?.["__rawString__"]?.startsWith("npx create-")) {
        const npmCommand = node.properties?.["__rawString__"];
        node.properties["__npmCommand__"] = npmCommand;
        node.properties["__yarnCommand__"] = npmCommand.replace(
          "npx create-",
          "yarn create "
        );
        node.properties["__pnpmCommand__"] = npmCommand.replace(
          "npx create-",
          "pnpm create "
        );
        node.properties["__bunCommand__"] = npmCommand.replace(
          "npx",
          "bunx --bun"
        );
      }
      if (node.properties?.["__rawString__"]?.startsWith("npx") && !node.properties?.["__rawString__"]?.startsWith("npx create-")) {
        const npmCommand = node.properties?.["__rawString__"];
        node.properties["__npmCommand__"] = npmCommand;
        node.properties["__yarnCommand__"] = npmCommand;
        node.properties["__pnpmCommand__"] = npmCommand.replace(
          "npx",
          "pnpm dlx"
        );
        node.properties["__bunCommand__"] = npmCommand.replace(
          "npx",
          "bunx --bun"
        );
      }
    });
  };
}

// contentlayer.config.ts
var computedFields = {
  url: {
    type: "string",
    resolve: (post) => `/${post._raw.flattenedPath}`
  },
  image: {
    type: "string",
    resolve: (post) => `${process.env.NEXT_PUBLIC_APP_URL}/api/og?title=${encodeURI(
      post.title
    )}`
  },
  slug: {
    type: "string",
    resolve: (doc) => `/${doc._raw.flattenedPath}`
  },
  slugAsParams: {
    type: "string",
    resolve: (doc) => doc._raw.flattenedPath.split("/").slice(1).join("/")
  },
  structuredData: {
    type: "json",
    resolve: (doc) => ({
      "@context": "https://schema.org",
      "@type": `BlogPosting`,
      headline: doc.title,
      datePublished: doc.date,
      dateModified: doc.date,
      description: doc.summary,
      image: doc.image,
      url: `https://nxtrepo/${doc._raw.flattenedPath}`,
      author: {
        "@type": "Person",
        name: doc.author,
        url: `https://twitter.com/${doc.author}`
      }
    })
  }
};
var LinksProperties = defineNestedType(() => ({
  name: "LinksProperties",
  fields: {
    doc: {
      type: "string"
    },
    api: {
      type: "string"
    }
  }
}));
var Doc = defineDocumentType(() => ({
  name: "Doc",
  filePathPattern: `docs/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      required: true
    },
    description: {
      type: "string",
      required: true
    },
    date: { type: "date", required: false },
    published: {
      type: "boolean",
      default: true
    },
    links: {
      type: "nested",
      of: LinksProperties
    },
    featured: {
      type: "boolean",
      default: false,
      required: false
    },
    toc: { type: "boolean", default: true, required: false },
    author: { type: "string", required: false },
    video: { type: "string", required: false }
  },
  // @ts-ignore
  computedFields
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "./content",
  documentTypes: [Doc],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      rehypeComponent,
      () => (tree) => {
        visit3(tree, (node) => {
          if (node?.type === "element" && node?.tagName === "pre") {
            const [codeEl] = node.children;
            if (codeEl.tagName !== "code") {
              return;
            }
            if (codeEl.data?.meta) {
              const regex = /event="([^"]*)"/;
              const match = codeEl.data?.meta.match(regex);
              if (match) {
                node.__event__ = match ? match[1] : null;
                codeEl.data.meta = codeEl.data.meta.replace(regex, "");
              }
            }
            node.__rawString__ = codeEl.children?.[0].value;
            node.__src__ = node.properties?.__src__;
            node.__style__ = node.properties?.__style__;
          }
        });
      },
      [
        rehypePrettyCode,
        {
          theme: "github-dark",
          onVisitLine(node) {
            if (node.children.length === 0) {
              node.children = [{ type: "text", value: " " }];
            }
          },
          onVisitHighlightedLine(node) {
            node.properties.className ? node.properties.className.push("line--highlighted") : null;
          },
          onVisitHighlightedWord(node) {
            node.properties.className = ["word--highlighted"];
          }
        }
      ],
      () => (tree) => {
        visit3(tree, (node) => {
          if (node?.type === "element" && node?.tagName === "div") {
            if (!("data-rehype-pretty-code-fragment" in node.properties)) {
              return;
            }
            const preElement = node.children.at(-1);
            if (preElement.tagName !== "pre") {
              return;
            }
            preElement.properties["__withMeta__"] = node.children.at(0).tagName === "div";
            preElement.properties["__rawString__"] = node.__rawString__;
            if (node.__src__) {
              preElement.properties["__src__"] = node.__src__;
            }
            if (node.__event__) {
              preElement.properties["__event__"] = node.__event__;
            }
            if (node.__style__) {
              preElement.properties["__style__"] = node.__style__;
            }
          }
        });
      },
      rehypeNpmCommand,
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ["anchor"],
            ariaLabel: "Link to section"
          }
        }
      ]
    ]
  }
});
export {
  Doc,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-5DVGIWNB.mjs.map
