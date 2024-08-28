import * as React from "react";

import { Registry } from "./components/schema";


const ui: Registry = {
	"animated-list": {
		name: "animated-list",
		type: "components:ui",
		files: ["registry/components/ui/animated-list.tsx"],
	},
};
const example: Registry = {
	"animated-list-demo": {
		name: "animated-list-demo",
		type: "components:example",
		registryDependencies: ["animated-list"],
		files: ["registry/components/example/animated-list-demo.tsx"],
		component: React.lazy(
			() => import("../registry/components/example/animated-list-demo")
		),
	},
};
export const registry: Registry = {
  ...ui,
  ...example,
};

const resolvedExamples = Object.entries(example).map(([key, value]) => ({
  ...value,
  component: () => void 0,
}));
const updatedExample: Registry = resolvedExamples.reduce(
  (acc, curr) => ({ ...acc, [curr.name]: curr }),
  {},
);
export const downloadRegistry: Registry = { ...ui, ...updatedExample };

export type ComponentName = keyof (typeof ui & typeof example);
