// PlantUML Grammer
// ===============
//

PlantUMLFile
  = (
      (!"@startuml" .)*
      "@startuml" _ NewLine
        uml:UML
      "@enduml" _ NewLine?
      (!"@startuml" .)*
      {
       return uml;
      }
    )*

UML
  = elements:UMLElement*
  {
    return elements.filter(
      e => e !== undefined
    );
  }

UMLElement
 = Together
 / Note
 / (!"@enduml" EndLine) {}  // Ignore unimplemented one line elements:
                            //   Remove when all elements are implemeneted

//
// Elements
//

Together
  = _ "together " _ "{" _ NewLine elements:UMLElement* _ "}" EndLine
  {
    return elements;
  }

//
// Note
//

Note
  = _ "note " _ [^:]+ ":" EndLine
  / _ "note " _ [^:]+ NewLine (!"end note" .)* "end note" EndLine

//
// Package
//

Package
  = _ "package " _ Name _ "{" _ NewLine elements:UMLElement* _ "}" EndLine
  {
    return elements;
  }
  / _ "package " _ Name _ NewLine (!"end package" element:UMLElement)* _ "end package" EndLine
  {
    return elements;
  }

//
// Class & Interface
//

Class
  = _ abstract:"abstract "? _ "class " _ name:Name _ Generics? _ Stereotype? EndLine
  {
    return new require("./class")(
      name,
      !!abstract
    );
  }
  / _ abstract:"abstract "? _ "class " _ name:Name _ Generics? _ Stereotype? _ "{" _ NewLine members:Member* _ "}" EndLine
  {
    return new require("./class")(
      name,
      !!abstract,
      members
    );
  }

Generics
  = "<" _ ( !">" . )+ _ ">"

Stereotype
  = "<<" _ ( !">>" . )+ _ ">>"

Member
  = MemberVariable
  / Method
  / _ "static " _ Member

MemberVariable
  = _ accessor:Accessor? _ name:Name EndLine
  {
    return new require("./memberVariable")(
      accessor || "+",
      name
    );
  }


Method
  = _ field:fielddeclaration "(" parameters:methodparameter* ")" noise
  { 
    return new require("./method")(
      field.getAccessType(),
      field.getReturnType(),
      field.getName(),
      parameters
    );
  }

MethodParameter
  = noise item:returntype membername:([ ] membername)? [,]?
  {
    return new require("./parameter")(
      item,
      membername ? membername[1] : null
    );
  }

returntype
  = items:[^ ,\n\r\t(){}]+ { return items.join("") }

///
/// Shared
///

Name
  = [A-Za-z0-9._]+
  / "\"" name:([^"]) "\""
  {
    return name;
  }

Accessor
  = [+\-#]

//
// Meta
//
_
  = [ \t]*

NewLine
  = "\n"
  / "\r\n"

EndLine
  = (!NewLine .)* NewLine
