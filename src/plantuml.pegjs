// PlantUML Grammer
// ===============
//

PlantUMLFile
  = (
      (!"@startuml" .)*
      "@startuml" _ DiagramId? _ NewLine
        uml:UML
      "@enduml" _ NewLine?
      (!"@startuml" .)*
      {
       return uml;
      }
    )*

DiagramId
  = "(" _ "id" _ "=" Name ")"

UML
  = elements:UMLElement*
  {
    return new (require('./uml'))(
      elements.filter(
        e => e !== undefined
      )
    );
  }

UMLElement
 = Comment
 / Relationship
 / SkinParam
 / Together
 / Group
 / Note
 / Class
 / Interface
 / Enum
 / Component
 / UseCase
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
  = _ type:GroupType " " _ name:ElementName _ Stereotype? _ Color? _ "{" _ NewLine elements:UMLElement* _ "}" EndLine
  {
    return new (require('./group'))(
      name.name,
      name.title,
      type,
      elements.filter(
        e => e !== undefined
      )
    );
  }

GroupType
  = "package"i
  / "namespace"i
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
  = _ "note " _ Direction _ of:NoteOf? ":" _ text:(!NewLine .)+ EndLine
  {
    return new (require('./note'))(
      text.map((c) => c[1]).join('').trim(),
      of
    )
  }
  / _ "note " _ Direction _ of:NoteOf? _ NewLine text:(!(_ "end note" NewLine) .)+ EndLine
  {
    return new (require('./note'))(
      text.map((c) => c[1]).join('').trim(),
      of
    )
  }
  / _ "note " _ Direction _ of:NoteOf? _ NewLine text:(!(_ "end note" NewLine) .)+ EndLine
  {
    return new (require('./note'))(
      text.map((c) => c[1]).join('').trim(),
      of
    )
  }
  / _ "note " _ text:QuotedString _ "as " Name EndLine
  {
    return new (require('./note'))(
      text,
    )
  }

NoteOf
  = "of " _ elementName:ElementReference
  {
    return elementName.name;
  }

//
// Class
//

Class
  = _ isAbstract:"abstract "? _ "class " _ name:ElementName _ Decorators? _ "{" _ NewLine members:Member* _ "}" EndLine
  {
    return new (require("./class"))(
      name.name,
      name.title,
      !!isAbstract,
      members.filter(
        (m) => m !== undefined
      )
    );
  }
  / _ isAbstract:"abstract "? _ "class " _ name:ElementName _ Decorators? EndLine
  {
    return new (require("./class"))(
      name.name,
      name.title,
      !!isAbstract
    );
  }

Member
  = SeparatorLine
  / Method
  / MemberVariable
  / (!( _ "}") EndLine) {}  // Catchall for members: Remove once all members are implemented

SeparatorLine
  = _ Separator _ (!(Separator / NewLine) .)* Separator EndLine {}
  / _ Separator EndLine {}

Separator
  = "--" "-"*
  / ".." "."*
  / "==" "="*
  / "__" "_"*

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
      name.name,
      name.title,
      members.filter(
        (m) => m !== undefined
      )
    );
  }
  / _ "interface " _ name:ElementName _ Decorators? _ EndLine
  {
    return new (require('./interface'))(
      name.name,
      name.title,
    );
  }

//
// Enum
//

Enum
  = _ "enum " _ name:ElementName _ Decorators? _ "{" _ NewLine members:Member* _ "}" EndLine
  {
    return new (require('./enum'))(
      name.name,
      name.title,
      members.filter(
        (m) => m !== undefined
      )
    );
  }
  / _ "enum " _ name:ElementName _ Decorators? _ EndLine
  {
    return new (require('./enum'))(
      name.name,
      name.title,
    );
  }

//
// Component
//

Component
  = _ "component " _ name:ElementName _ Stereotype? EndLine
  {
    return new (require('./component'))(
      name.name,
      name.title,
    );
  }
  / _ component:ShortComponent EndLine
  {
    return component;
  }

ShortComponent
  = "[" name:(!("]" / NewLine) .)+ "]"
  {
    name = name.map((c) => c[1]).join('').trim();
    return new (require('./component'))(
      name,
      name
    );
  }

//
// UseCase
//

UseCase
  = _ "usecase " _ name:ElementName EndLine
  {
    return new (require('./useCase'))(
      name.name,
      name.title,
    );
  }
  / _ useCase:ShortUseCase EndLine
  {
    return useCase;
  }

ShortUseCase
  = "(" name:(!(")" / NewLine) .)+ ")"
  {
    name = name.map((c) => c[1]).join('').trim();
    return new (require('./useCase'))(
      name,
      name
    );
  }

//
// Relationship
//

Relationship
  = _ left:ElementReference _ leftCardinality:QuotedString? _ leftArrowHead:RelationshipArrowHead? leftArrowBody:RelationshipArrowBody Direction? rightArrowBody:RelationshipArrowBody rightArrowHead:RelationshipArrowHead? _ rightCardinality:QuotedString? _ right:ElementReference _ label:(RelationshipLabel)? EndLine
  {
    return new (require('./relationship'))(
      left.name,
      right.name,
      left.type,
      right.type,
      leftArrowHead,
      rightArrowHead,
      leftArrowBody,
      rightArrowBody,
      leftCardinality,
      rightCardinality,
      label,
    );
  }
  / _ left:ElementReference _ leftCardinality:QuotedString? _ leftArrowHead:RelationshipArrowHead? arrowBody:RelationshipArrowBody rightArrowHead:RelationshipArrowHead? _ rightCardinality:QuotedString? _ right:ElementReference _ label:(RelationshipLabel)? EndLine
  {
    return new (require('./relationship'))(
      left.name,
      right.name,
      left.type,
      right.type,
      leftArrowHead,
      rightArrowHead,
      arrowBody,
      arrowBody,
      leftCardinality,
      rightCardinality,
      label,
    );
  }

RelationshipArrowHead
  = "<|"
  / "|>"
  / "*"
  / "o"
  / "<"
  / ">"
  / "#"
  / "x"
  / "}"
  / "+"
  / "^"
  / "()"
  / "("
  / ")"

RelationshipArrowBody
  = [-]+
  {
    return '-';
  }
  / [.]+
  {
    return '.';
  }


RelationshipLabel
  = ":" _ label:(!NewLine .)+
  {
    return label.map((c) => c[1]).join('').trim()
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

ElementReference
  = element:ShortComponent
  {
    return {
      name: element.name,
      type: element.constructor.name,
    }
  }
  / element:ShortUseCase
  {
    return {
      name: element.name,
      type: element.constructor.name,
    }
  }
  / name:Name
  {
    return {
      name: name,
      type: 'Unknown',
    }
  }

ElementName
  = title:QuotedString _ "as " _ name:Name
  {
    return {
      name: name,
      title: title,
    };
  }
  / name:Name _ "as " _ title:QuotedString
  {
    return {
      name: name,
      title: title,
    };
  }
  / title:Name _ "as " _ name:Name
  {
    return {
      name: name,
      title: title,
    };
  }
  / _ name:QuotedString _
  {
    return {
      name: name,
      title: name,
    };
  }
  / "(" name:(!(")" / NewLine) .)+ ")"
  {
    name = name.map((c) => c[1]).join('').trim();
    return {
      name: name,
      title: name,
    };
  }
  / "[" name:(!("]" / NewLine) .)+ "]"
  {
    name = name.map((c) => c[1]).join('').trim();
    return {
      name: name,
      title: name,
    };
  }
  / _ name:Name _
  {
    return {
      name: name,
      title: name,
    };
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
  / "top"i
  / "bottom"i

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
