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
 / Interface
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
    return new (require('./package'))(name, elements);
  }
  / _ "package " _ name:Name _ NewLine elements:(!"end package" UMLElement)* _ "end package" EndLine
  {
    return new (require('./package'))(name, elements);
  }

//
// Note
//

Note
  = _ "note " _ (!(":" / NewLine) .)+ _ ":" _ text:(!NewLine .)+ EndLine
  {
    return new (require('./note'))(
      text.map((c) => c[1]).join('').trim()
    )
  }
  / _ "note " _ (!(":" / NewLine) .)+ NewLine text:(!"end note" .)+ "end note" EndLine
  {
    return new (require('./note'))(
      text.map((c) => c[1]).join('').trim()
    )
  }

//
// Class
//

Class
  = _ isAbstract:"abstract "? _ "class " _ name:Name _ Generics? _ Stereotype? _ NewLine
  {
    return new (require("./class"))(
      name.join(''),
      !!isAbstract
    );
  }
  / _ isAbstract:"abstract "? _ "class " _ name:Name _ Generics? _ Stereotype? _ "{" _ NewLine members:Member* _ "}" EndLine
  {
    return new (require("./class"))(
      name.join(''),
      !!isAbstract,
      members
    );
  }

Generics
  = "<" _ ( !">" . )+ _ ">"

Stereotype
  = "<<" _ ( !">>" . )+ _ ">>"

Member
  = Method
  / MemberVariable
  / (!( _ "}") EndLine)   // Catchall for members: Remove once all members are implemented

Method
  = _ isStatic:"static "? _ accessor:Accessor? _ type:Name? _ name:Name _ "(" _arguments:(!")" .)* ")" EndLine
  {
    return new (require('./method'))(
      name.join(''),
      isStatic,
      accessor,
      type.join(''),
      _arguments.join(''),
    );
  }


MemberVariable
  = _ isStatic:"static "? _ accessor:Accessor? _ type:Name? _ name:Name EndLine
  {
    return new (require('./memberVariable'))(
      name.join(''),
      !!isStatic,
      accessor,
      type.join(''),
    );
  }

//
// Interface
//
Interface
  = _ "interface " _ name:Name _ Generics? _ Stereotype? _ NewLine
  {
    return new (require('./interface'))(
      name.join(''),
    );
  }
  / _ "interface " _ name:Name _ Generics? _ Stereotype? _ "{" _ NewLine members:Member* _ "}" EndLine
  {
    return new (require('./interface'))(
      name.join(''),
      members
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
