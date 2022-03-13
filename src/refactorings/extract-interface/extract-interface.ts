import { Editor, ErrorReason } from "../../editor/editor";
import { Position } from "../../editor/position";
import { Selection } from "../../editor/selection";
import * as t from "../../ast";

export function hasCodeChanged(code: any, selection: any, file: any) {

  const updatedCode = updateCode(t.parse(code), selection);

  console.log("updatedCode", updatedCode);

  if (updatedCode.hasCodeChanged) {
    return "Extract interface\n";
  }

  return;
}

export async function extractInterface(code: any, selection: any, file: any) {
    const updatedCode = updateCode(t.parse(code), selection);
  
    console.log("updatedCode", updatedCode);
  
    if (!updatedCode.hasCodeChanged) {
      console.log("No code changed");
      return;
    }
  
    var fs = require('fs');
  
    if (fs.existsSync( file )) {
      fs.writeFileSync(file, updatedCode.code, 'utf8');
    }
}

function updateCode(
  ast: t.AST,
  selection: Selection
): t.Transformed & { interfaceIdentifierPosition: Position } {
  let interfaceIdentifierPosition: Position = selection.start;

  const result = t.transformAST(
    ast,
    createVisitor(selection, (path, id, declaration) => {
      if (t.isSelectableNode(path.node)) {
        // "interface X" => 10 characters before "X"
        const interfaceIdentifierOffset = 10;

        interfaceIdentifierPosition = Position.fromAST(path.node.loc.end)
          .putAtStartOfLine()
          // New interface starts 2 lines after class declaration
          .putAtNextLine()
          .putAtNextLine()
          .addCharacters(interfaceIdentifierOffset);
      }

      if (declaration.typeParameters) {
        const typeParameters = t.tsTypeParameterInstantiation(
          declaration.typeParameters.params.map((p) =>
            t.tsTypeReference(t.identifier(p.name))
          )
        );

        path.node.implements = [
          t.tsExpressionWithTypeArguments(id, typeParameters)
        ];
      } else {
        path.node.implements = [t.classImplements(id)];
      }
      path.insertAfter(declaration);
    })
  );

  return { ...result, interfaceIdentifierPosition };
}

export function createVisitor(
  selection: Selection,
  onMatch: (
    path: t.NodePath<t.ClassDeclaration>,
    id: t.Identifier,
    declaration: t.TSInterfaceDeclaration
  ) => void
): t.Visitor {
  return {
    ClassDeclaration(path) {
      // It seems a class declaration inside a named export may have no loc.
      // Use the named export loc in that situation.
      if (
        t.isExportDeclaration(path.parent) &&
        !t.isSelectableNode(path.node)
      ) {
        path.node.loc = path.parent.loc;
      }

      const methods: t.ClassMethod[] = path.node.body.body.filter(
        (method: any): method is t.ClassMethod => t.isClassMethod(method)
      );

      const declarations = methods
        .filter(isPublic)
        .filter((method) => !isConstructor(method))
        .map((method) => {
          return t.tsMethodSignature(
            method.key,
            null,
            method.params.filter((param): param is t.Identifier =>
              t.isIdentifier(param)
            ),
            t.isTSTypeAnnotation(method.returnType) ? method.returnType : null
          );
        });

      let autoAssignedProperties: t.TSPropertySignature[] = [];
      const constructorDeclaration = methods.find(isConstructor);
      if (constructorDeclaration) {
        autoAssignedProperties = constructorDeclaration.params
          .filter((param): param is t.TSParameterProperty =>
            t.isTSParameterProperty(param)
          )
          .filter(isPublic)
          .reduce<t.TSPropertySignature[]>((memo, property) => {
            let result;

            if (t.isIdentifier(property.parameter)) {
              result = t.tsPropertySignature(property.parameter);
            } else {
              const key = property.parameter.left;
              if (!t.isExpression(key)) return memo;
              if (t.isMemberExpression(key)) return memo;

              result = t.tsPropertySignature(
                key,
                t.isTSTypeAnnotation(key.typeAnnotation)
                  ? null
                  : toTSType(property.parameter.right)
              );
            }

            // Mutates the result because of a weird bug: TS complains "Too many arguments"
            // if we pass more than 3 params even though `tsPropertySignature` takes 6 params.
            result.readonly = property.readonly;
            return memo.concat(result);
          }, []);
      }

      const classProperties = path.node.body.body
        .filter((property: any): property is t.ClassProperty =>
          t.isClassProperty(property)
        )
        .filter(isPublic)
        .map((property: t.ClassProperty) => {
          const result = t.tsPropertySignature(
            property.key,
            t.isTSTypeAnnotation(property.typeAnnotation)
              ? property.typeAnnotation
              : toTSType(property.value)
          );

          // Mutates the result because of a weird bug: TS complains "Too many arguments"
          // if we pass more than 3 params even though `tsPropertySignature` takes 6 params.
          result.readonly = property.readonly;
          return result;
        });

      const typeParameters = t.isTSTypeParameterDeclaration(
        path.node.typeParameters
      )
        ? path.node.typeParameters
        : undefined;

      const interfaceIdentifier = t.identifier("Extracted");
      const interfaceDeclaration = t.tsInterfaceDeclaration(
        interfaceIdentifier,
        typeParameters,
        undefined,
        t.tsInterfaceBody([
          ...classProperties,
          ...autoAssignedProperties,
          ...declarations
        ])
      );

      onMatch(path, interfaceIdentifier, interfaceDeclaration);
    }
  };
}

function isPublic(
  node: t.TSParameterProperty | t.ClassProperty | t.ClassMethod
): boolean {
  return node.accessibility === "public" || !node.accessibility;
}

function isConstructor(method: t.ClassMethod): boolean {
  return method.kind === "constructor";
}

function toTSType(value: t.ClassProperty["value"]): t.TSTypeAnnotation | null {
  if (t.isNumericLiteral(value)) {
    return t.tsTypeAnnotation(t.tsNumberKeyword());
  }

  if (t.isStringLiteral(value)) {
    return t.tsTypeAnnotation(t.tsStringKeyword());
  }

  if (t.isBooleanLiteral(value)) {
    return t.tsTypeAnnotation(t.tsBooleanKeyword());
  }

  return t.tsTypeAnnotation(t.tsAnyKeyword());
}