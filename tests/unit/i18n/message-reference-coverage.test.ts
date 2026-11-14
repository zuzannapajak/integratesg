// @vitest-environment node

import { readFileSync, readdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";

import { APP_LOCALES } from "@/lib/i18n/locales";

type Messages = Record<string, unknown>;

const projectRoot = process.cwd();
const messagesRoot = resolve(projectRoot, "messages");
const sourceRoots = ["app", "components", "features", "lib", "i18n"];

function deepMerge(base: Messages, update: Messages): Messages {
  const result: Messages = { ...base };

  for (const [key, value] of Object.entries(update)) {
    const previous = result[key];
    if (
      previous !== null &&
      typeof previous === "object" &&
      !Array.isArray(previous) &&
      value !== null &&
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
      result[key] = deepMerge(previous as Messages, value as Messages);
    } else {
      result[key] = value;
    }
  }

  return result;
}

function loadMessages(locale: string): Messages {
  let result = JSON.parse(readFileSync(join(messagesRoot, `${locale}.json`), "utf8")) as Messages;

  for (const scope of readdirSync(messagesRoot, { withFileTypes: true })) {
    if (!scope.isDirectory()) continue;
    const contents = JSON.parse(
      readFileSync(join(messagesRoot, scope.name, `${locale}.json`), "utf8"),
    ) as Messages;
    result = deepMerge(result, contents);
  }

  return result;
}

function hasMessage(messages: Messages, path: string): boolean {
  let current: unknown = messages;

  for (const segment of path.split(".")) {
    if (current === null || typeof current !== "object" || Array.isArray(current)) {
      return false;
    }
    current = (current as Messages)[segment];
  }

  return typeof current === "string";
}

function findSourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name.startsWith(".") || entry.name === "node_modules") return [];
    const entryPath = join(directory, entry.name);
    if (entry.isDirectory()) return findSourceFiles(entryPath);
    return entry.isFile() && /\.tsx?$/.test(entry.name) ? [entryPath] : [];
  });
}

function readLiteral(node: ts.Node | undefined): string | null {
  if (node && (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))) {
    return node.text;
  }
  return null;
}

function translationNamespace(expression: ts.Expression): string | null {
  const unwrapped = ts.isAwaitExpression(expression) ? expression.expression : expression;
  if (!ts.isCallExpression(unwrapped) || !ts.isIdentifier(unwrapped.expression)) return null;
  if (!["useTranslations", "getTranslations"].includes(unwrapped.expression.text)) return null;

  const arg = unwrapped.arguments.at(0);
  const literalNamespace = readLiteral(arg);
  if (literalNamespace !== null) return literalNamespace;

  if (arg !== undefined && ts.isObjectLiteralExpression(arg)) {
    const property = arg.properties.find(
      (part) =>
        ts.isPropertyAssignment(part) &&
        (ts.isIdentifier(part.name) || ts.isStringLiteral(part.name)) &&
        part.name.text === "namespace",
    );
    if (property && ts.isPropertyAssignment(property)) {
      return readLiteral(property.initializer);
    }
  }

  return null;
}

type Reference = { path: string; source: string };

function collectStaticReferences(): Reference[] {
  const references: Reference[] = [];

  for (const directory of sourceRoots) {
    for (const file of findSourceFiles(resolve(projectRoot, directory))) {
      const code = readFileSync(file, "utf8");
      const source = ts.createSourceFile(
        file,
        code,
        ts.ScriptTarget.Latest,
        true,
        file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
      );
      const bindings = new Map<string, Set<string>>();

      const bind = (name: string, namespace: string) => {
        const namespaces = bindings.get(name) ?? new Set<string>();
        namespaces.add(namespace);
        bindings.set(name, namespaces);
      };

      const discoverBindings = (node: ts.Node): void => {
        if (ts.isVariableDeclaration(node) && node.initializer) {
          if (ts.isIdentifier(node.name)) {
            const namespace = translationNamespace(node.initializer);
            if (namespace !== null) bind(node.name.text, namespace);
          } else if (ts.isArrayBindingPattern(node.name)) {
            const value = ts.isAwaitExpression(node.initializer)
              ? node.initializer.expression
              : node.initializer;
            const firstArg = ts.isCallExpression(value) ? value.arguments.at(0) : undefined;
            if (
              ts.isCallExpression(value) &&
              ts.isPropertyAccessExpression(value.expression) &&
              value.expression.expression.getText(source) === "Promise" &&
              value.expression.name.text === "all" &&
              firstArg !== undefined &&
              ts.isArrayLiteralExpression(firstArg)
            ) {
              const calls = firstArg.elements;
              node.name.elements.forEach((element, index) => {
                const call = calls.at(index);
                if (
                  ts.isBindingElement(element) &&
                  ts.isIdentifier(element.name) &&
                  call !== undefined
                ) {
                  const namespace = translationNamespace(call);
                  if (namespace !== null) bind(element.name.text, namespace);
                }
              });
            }
          }
        }
        ts.forEachChild(node, discoverBindings);
      };
      discoverBindings(source);

      const inspectCalls = (node: ts.Node): void => {
        if (ts.isCallExpression(node)) {
          let translator: string | null = null;
          if (ts.isIdentifier(node.expression)) translator = node.expression.text;
          if (
            ts.isPropertyAccessExpression(node.expression) &&
            ts.isIdentifier(node.expression.expression) &&
            ["has", "rich", "raw", "markup"].includes(node.expression.name.text)
          ) {
            translator = node.expression.expression.text;
          }
          const namespaces = translator ? bindings.get(translator) : undefined;
          const key = readLiteral(node.arguments[0]);
          if (namespaces?.size === 1 && key !== null) {
            const namespace = Array.from(namespaces)[0];
            const line = source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;
            references.push({
              path: `${namespace}.${key}`,
              source: `${relative(projectRoot, file)}:${line}`,
            });
          }
        }
        ts.forEachChild(node, inspectCalls);
      };
      inspectCalls(source);
    }
  }

  return references;
}

describe("source-backed translation message references", () => {
  it("resolves every statically referenced next-intl key in all six locales", () => {
    const references = collectStaticReferences();
    expect(references.length).toBeGreaterThan(1_000);

    const missing: string[] = [];
    for (const locale of APP_LOCALES) {
      const messages = loadMessages(locale);
      for (const reference of references) {
        if (!hasMessage(messages, reference.path)) {
          missing.push(`${locale}: ${reference.path} (${reference.source})`);
        }
      }
    }
    expect(missing).toEqual([]);
  });
});
