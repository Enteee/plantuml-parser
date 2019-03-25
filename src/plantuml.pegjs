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
 / SkinParam
 / Together
 / Group
 / Note
 / Class
 / Interface
 / Enum
 / Relationship
 / NotImplementedBlock
 / (!(
      _ "@enduml"
      / _ "}"
      / _ "end note"
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
// SkinParam
//

SkinParam
  = _ "skinparam " _ name:Name _ "{" _ NewLine Param* _ "}" EndLine
  {
  }
  / _ "skinparam " _ Param
  {
  }

Param
  = _ param:Name _ value:Color EndLine

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
// Group
//

Group
  = _ type:GroupType " " _ name:ElementName _ Stereotype? _ "{" _ NewLine elements:UMLElement* _ "}" EndLine
  {
    return new (require('./group'))(
      name,
      type,
      elements.filter(
        e => e !== undefined
      )
    );
  }

GroupType
  = "package"i
  / "node"i
  / "folder"i
  / "frame"i
  / "cloud"i
  / "database"i
  / "rectangle"i

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
  = _ isAbstract:"abstract "? _ "class " _ name:ElementName _ Decorators? _ "{" _ NewLine members:Member* _ "}" EndLine
  {
    return new (require("./class"))(
      name,
      !!isAbstract,
      members
    );
  }
  / _ isAbstract:"abstract "? _ "class " _ name:ElementName _ Decorators? EndLine
  {
    return new (require("./class"))(
      name,
      !!isAbstract
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
  = _ "interface " _ name:ElementName _ Decorators? _ "{" _ NewLine members:Member* _ "}" EndLine
  {
    return new (require('./interface'))(
      name,
      members
    );
  }
  / _ "interface " _ name:ElementName _ Decorators? _ EndLine
  {
    return new (require('./interface'))(
      name,
    );
  }

//
// Enum
//

Enum
  = _ "enum " _ name:ElementName _ Decorators? _ "{" _ NewLine members:Member* _ "}" EndLine
  {
    return new (require('./enum'))(
      name,
      members
    );
  }
  / _ "enum " _ name:ElementName _ Decorators? _ EndLine
  {
    return new (require('./enum'))(
      name,
    );
  }

//
// Relationship
//

Relationship
  = _ left:ElementName _ leftCardinality:QuotedString? _ leftType:RelationshipType? leftArrowBody:RelationshipArrowBody Direction? rightArrowBody:RelationshipArrowBody rightType:RelationshipType? _ rightCardinality:QuotedString? _ right:ElementName _ name:(RelationshipName)? EndLine
  {
    return new (require('./relationship'))(
      left,
      right,
      leftType,
      rightType,
      leftArrowBody,
      rightArrowBody,
      leftCardinality,
      rightCardinality,
      name,
    );
  }

RelationshipArrowBody
  = [-]+
  {
    return '-';
  }
  / [.]+
  {
    return '.';
  }

RelationshipType
  = "<|" { return "Generalization" }
  / "|>" { return "Generalization" }
  / "*" { return "Composition" }
  / "o" { return "Aggregation" }
  / "#"
  / "x"
  / "}"
  / "+"
  / "^"

RelationshipName
  = ":" _ name:(!NewLine .)+
  {
    return name.map((c) => c[1]).join('').trim()
  }

//
// NotImplementedBlock
//

NotImplementedBlock
  = _ NotImplementedBlockType " " _ name:ElementName _ "{" _ NewLine (!( NewLine _ "}" NewLine) .)* NewLine _ "}" EndLine
  {
  }

NotImplementedBlockType
  = "digraph"i
  / "state"i

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
    return string.map((c) => c[1]).join('').trim();
  }

Name
  = name:([A-Za-z0-9._]+)
  {
    return name.join('');
  }

Decorators
  = Generics _ Stereotype
  / Stereotype
  / Generics

Generics
  = "<" _ ( !">" . )+ _ ">"

Stereotype
  = "<<" _ ( !">>" . )+ _ ">>"


Accessor
  = [+\-#]

Color
  = color:([#A-Za-z0-9]+)
  {
    return color.join('');
  }

Direction
  = "left"i
  / "right"i
  / "up"i
  / "down"i

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
