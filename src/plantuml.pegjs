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
 = Comment
 / Together
 / Package
 / Note
 / Class
 / Interface
 / (!(
      _ "@enduml"
      / _ "}"
      / _ "end "
    ) EndLine) {} // Ignore unimplemented one line elements:
                  //   Remove when all elements are implemeneted
                  //   IMPORTANT:
                  //    Must add all terminators here of non-terminals
                  //    which reference UMLElement.

//
// Comment
//
Comment
  = _ "'" EndLine
  / _ "/'" (!"'/" .)* EndLine

//
// Together
//

Together
  = _ "together " _ "{" _ NewLine elements:UMLElement* _ "}" EndLine
  {
    return elements.filter(
      e => e !== undefined
    );
  }

//
// Package
//

Package
  = _ "package " _ name:ElementName _ Stereotype? _ "{" _ NewLine elements:UMLElement* _ "}" EndLine
  {
    return new (require('./package'))(
      name,
      elements.filter(
        e => e !== undefined
      )
    );
  }
  / _ "package " _ name:ElementName _ Stereotype? _ NewLine elements:(!"end package" UMLElement)* _ "end package" EndLine
  {
    return new (require('./package'))(
      name,
      elements.filter(
        e => e !== undefined
      )
    );
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
  = _ isAbstract:"abstract "? _ "class " _ name:ElementName _ Generics? _ Stereotype? _ NewLine
  {
    return new (require("./class"))(
      name,
      !!isAbstract
    );
  }
  / _ isAbstract:"abstract "? _ "class " _ name:ElementName _ Generics? _ Stereotype? _ "{" _ NewLine members:Member* _ "}" EndLine
  {
    return new (require("./class"))(
      name,
      !!isAbstract,
      members
    );
  }

Member
  = Method
  / MemberVariable
  / (!( _ "}") EndLine)   // Catchall for members: Remove once all members are implemented

Method
  = _ isStatic:"static "? _ accessor:Accessor? _ type:Name _ name:Name _ "(" _arguments:(!")" .)* ")" EndLine
  {
    return new (require('./method'))(
      name,
      isStatic,
      accessor,
      type,
      _arguments.join(''),
    );
  }
  / _ isStatic:"static "? _ accessor:Accessor? _ name:Name _ "(" _arguments:(!")" .)* ")" EndLine
  {
    return new (require('./method'))(
      name,
      isStatic,
      accessor,
      undefined,
      _arguments.join(''),
    );
  }


MemberVariable
  = _ isStatic:"static "? _ accessor:Accessor? _ type:Name _ name:Name EndLine
  {
    return new (require('./memberVariable'))(
      name,
      !!isStatic,
      accessor,
      type,
    );
  }
  / _ isStatic:"static "? _ accessor:Accessor? _ name:Name EndLine
  {
    return new (require('./memberVariable'))(
      name,
      !!isStatic,
      accessor
    );
  }

//
// Interface
//

Interface
  = _ "interface " _ name:ElementName _ Generics? _ Stereotype? _ NewLine
  {
    return new (require('./interface'))(
      name,
    );
  }
  / _ "interface " _ name:ElementName _ Generics? _ Stereotype? _ "{" _ NewLine members:Member* _ "}" EndLine
  {
    return new (require('./interface'))(
      name,
      members
    );
  }

///
/// Shared
///

ElementName
  = _ QuotedString _ "as " _ name:Name _
  {
    return name;
  }
  / _ name:Name _ "as " _ QuotedString _
  {
    return name;
  }
  / _ name:QuotedString _
  {
    return name;
  }
  / _ name:Name _
  {
    return name;
  }

QuotedString
  = "\"" string:(!("\"" / NewLine) .)+ "\""
  {
    return string.join('')
  }

Name
  = name:([A-Za-z0-9._]+)
  {
    return name.join('');
  }

Generics
  = "<" _ ( !">" . )+ _ ">"

Stereotype
  = "<<" _ ( !">>" . )+ _ ">>"


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
