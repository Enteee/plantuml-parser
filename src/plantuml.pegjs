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
 / Package
 / Note
 / Class
 / (!( _ "@enduml") EndLine) {}   // Ignore unimplemented one line elements:
                                  //   Remove when all elements are implemeneted

//
// Together
//

Together
  = _ "together " _ "{" _ NewLine elements:UMLElement* _ "}" EndLine
  {
    return elements;
  }

//
// Package
//

Package
  = _ "package " _ name:Name _ "{" _ NewLine elements:UMLElement* _ "}" EndLine
  {
    return require('./package')(name, elements);
  }
  / _ "package " _ name:Name _ NewLine elements:(!"end package" UMLElement)* _ "end package" EndLine
  {
    return require('./package')(name, elements);
  }

//
// Note
//

Note
  = _ "note " _ [^:]+ ":" EndLine
  / _ "note " _ [^:]+ NewLine (!"end note" .)* "end note" EndLine

//
// Class
//

Class
  = _ abstract:"abstract "? _ "class " _ name:Name _ Generics? _ Stereotype? _ NewLine
  {
    console.log(arguments);
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
  / _ "static " _ Member
  / (!( _ "}") EndLine)   // Catchall for members: Remove once all members are implemented

MemberVariable
  = _ accessor:Accessor? _ name:Name EndLine
  {
    return new require("../memberVariable")(
      accessor || "+",
      name
    );
  }

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
