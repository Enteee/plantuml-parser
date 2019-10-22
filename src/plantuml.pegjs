// PlantUML Grammer
// ===============
//

PlantUMLFile
  = diagrams:Diagrams
  {
    return diagrams;
  }
  / (!"@startuml" .)*
  {
    return []
  }

Diagrams
 = (
    (!"@startuml" .)*
    "@startuml" _ DiagramId? _ NewLine
      uml:UML
    "@enduml" _ NewLine?
    (!"@startuml" .)*
    {
     return uml;
    }
  )+

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
  = _ "skinparam "i _ name:Name _ "{" _ NewLine Param* _ "}" EndLine
  {
  }
  / _ "skinparam "i _ Param
  {
  }

Param
  = _ param:Name _ value:Color EndLine

//
// Together
//

Together
  = _ "together "i _ "{" _ NewLine elements:UMLElement* _ "}" EndLine
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
  = _ "note "i _ Direction _ of:NoteOf? ":" _ text:(!NewLine .)+ EndLine
  {
    return new (require('./note'))(
      text.map((c) => c[1]).join('').trim(),
      of
    )
  }
  / _ "note "i _ Direction _ of:NoteOf? _ NewLine text:(!(_ "end note" NewLine) .)+ EndLine
  {
    return new (require('./note'))(
      text.map((c) => c[1]).join('').trim(),
      of
    )
  }
  / _ "note "i _ Direction _ of:NoteOf? _ NewLine text:(!(_ "end note" NewLine) .)+ EndLine
  {
    return new (require('./note'))(
      text.map((c) => c[1]).join('').trim(),
      of
    )
  }
  / _ "note "i _ text:QuotedString _ "as " Name EndLine
  {
    return new (require('./note'))(
      text,
    )
  }

NoteOf
  = "of "i _ elementName:ElementReference
  {
    return elementName.name;
  }

//
// Class
//

Class
  = _ isAbstract:"abstract "i? _ "class " _ name:ElementName _ Decorators? _ "{" _ NewLine members:Member* _ "}" EndLine
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
  / _ isAbstract:"abstract "i? _ "class " _ name:ElementName _ Decorators? EndLine
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
  = _ isStatic:"static "i? _ accessor:Accessor? _ type:Name _ name:Name _ "(" _arguments:(!")" .)* ")" EndLine
  {
    return new (require('./method'))(
      name,
      isStatic,
      accessor,
      type,
      _arguments.join(''),
    );
  }
  / _ isStatic:"static "i? _ accessor:Accessor? _ name:Name _ "(" _arguments:(!")" .)* ")" EndLine
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
  = _ isStatic:"static "i? _ accessor:Accessor? _ type:Name _ name:Name EndLine
  {
    return new (require('./memberVariable'))(
      name,
      !!isStatic,
      accessor,
      type,
    );
  }
  / _ isStatic:"static "i? _ accessor:Accessor? _ name:Name EndLine
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
  = _ "interface "i _ name:ElementName _ Decorators? _ "{" _ NewLine members:Member* _ "}" EndLine
  {
    return new (require('./interface'))(
      name.name,
      name.title,
      members.filter(
        (m) => m !== undefined
      )
    );
  }
  / _ "interface "i _ name:ElementName _ Decorators? _ EndLine
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
  = _ "enum "i _ name:ElementName _ Decorators? _ "{" _ NewLine members:Member* _ "}" EndLine
  {
    return new (require('./enum'))(
      name.name,
      name.title,
      members.filter(
        (m) => m !== undefined
      )
    );
  }
  / _ "enum "i _ name:ElementName _ Decorators? _ EndLine
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
  = _ "component "i _ name:ElementName _ Stereotype? EndLine
  {
    return new (require('./component'))(
      name.name,
      name.title,
    );
  }
  / _ name:ShortComponent EndLine
  {
    return new (require('./component'))(
      name.name,
      name.title,
    );
  }

ShortComponent
  = "[" title:(!("]" / NewLine) .)+ "]" _ "as" _ name:Name
  {
    return {
      name: name,
      title: title.map((c) => c[1]).join('').trim(),
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

//
// UseCase
//

UseCase
  = _ "usecase "i _ name:ElementName EndLine
  {
    return new (require('./useCase'))(
      name.name,
      name.title,
    );
  }
  / _ name:ShortUseCase EndLine
  {
    return new (require('./useCase'))(
      name.name,
      name.title,
    );
  }

ShortUseCase
  = "(" title:(!(")" / NewLine) .)+ ")" _ "as" _ name:Name
  {
    return {
      name: name,
      title: title.map((c) => c[1]).join('').trim(),
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

//
// Relationship
//

Relationship
  = _ left:ElementReference _ leftCardinality:QuotedString? _ leftArrowHead:RelationshipArrowHead? leftArrowBody:RelationshipArrowBody hidden:RelationshipHidden? Direction? rightArrowBody:RelationshipArrowBody rightArrowHead:RelationshipArrowHead? _ rightCardinality:QuotedString? _ right:ElementReference _ label:(RelationshipLabel)? EndLine
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
      hidden,
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
      false,
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

RelationshipHidden
  = "[hidden]"

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
      type: 'Component',
    }
  }
  / element:ShortUseCase
  {
    return {
      name: element.name,
      type: 'UseCase',
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
  = title:QuotedString _ "as "i _ name:Name
  {
    return {
      name: name,
      title: title,
    };
  }
  / name:Name _ "as "i _ title:QuotedString
  {
    return {
      name: name,
      title: title,
    };
  }
  / title:Name _ "as "i _ name:Name
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
  / name:ShortUseCase
  {
    return {
      name: name.name,
      title: name.title,
    };
  }
  / name:ShortComponent
  {
    return {
      name: name.name,
      title: name.title,
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
