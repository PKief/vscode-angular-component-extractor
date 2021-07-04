import {
  anyTypeAnnotation,
  callExpression,
  ClassProperty,
  classProperty,
  decorator,
  identifier,
  typeAnnotation,
} from "@babel/types";

export interface ComponentPropertyData {
  key: string;
  decorator: string;
}
export interface ComponentPropertyBuilder {
  setKey(key: ComponentPropertyData["key"]): ComponentPropertyBuilder;
  setDecorator(
    name: ComponentPropertyData["decorator"]
  ): ComponentPropertyBuilder;
  build(): ClassProperty;
}

export function componentPropertyBuilder() {
  const propData: Partial<ComponentPropertyData> = {};
  const propBuilder: ComponentPropertyBuilder = {
    setKey(key: string): typeof propBuilder {
      propData.key = key;
      return propBuilder;
    },
    setDecorator(name: string): typeof propBuilder {
      propData.decorator = name;
      return propBuilder;
    },
    /**
     * requires that a key was set, otherwise an error is thrown
     * @returns constructed class property
     */
    build(): ClassProperty {
      if (propData.key === undefined) {
        throw new Error("Cannot construct a class property without a key");
      }

      const decorators = propData.decorator
        ? [decorator(callExpression(identifier("Input"), []))]
        : [];

      return classProperty(
        identifier(propData.key),
        undefined,
        typeAnnotation(anyTypeAnnotation()),
        decorators
      );
    },
  };
  return propBuilder;
}
