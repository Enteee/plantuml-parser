// PlantUML Grammer
// ===============
//

{

/**
 * Extract the actual text when matched using negative subexpression matching.
 * Example:
 *  text:(!NewLine .)+ EndLine
 * Input:
 *  [
 *    [
 *      [null]
 *      "f"
 *    ]
 *    [
 *      [null]
 *      "o"
 *    ]
 *    [
 *      [null]
 *      "o"
 *    ]
 *  ]
 * Output:
 *  "foo"
 */
function extractText(text: Array<Array<string>>){
  return text.map((c) => c[1]).join('').trim();
}

/**
 * Remove all undefined elements in an array
 * Input: [1, 2, undefined, 3]
 * Output: [1, 2, 3]
 */
function removeUndefined(array: Array<any>){
  return array.filter(
    e => e !== undefined
  );
}

}

PlantUMLFile
  = diagrams:Diagrams
  {
    return diagrams;
  }
  / (!"@startuml" .)*
  {
    return [];
  }

Diagrams
  = diagrams:(
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
    return new types.UML(
      removeUndefined(elements)
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
 / Stdlib_C4_Context
 / Stdlib_C4_Container_Component
 / Stdlib_C4_Boundary
 / Stdlib_C4_Dynamic_Rel
 / Stdlib_C4_Deployment
 / Stdlib_C4_Rel
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
  = _ "'" _ comment:(!NewLine .)+ EndLine
  {
    return new types.Comment(
      extractText(comment)
    );
  }
  / _ "/'" _ comment:(!"'/" .)* EndLine
  {
    return new types.Comment(
      extractText(comment)
    );
  }

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
    return removeUndefined(elements);
  }

//
// Group
//

Group
  = _ type:GroupType " " _ name:ElementName? _ Stereotypes? _ Color? _ NewLine? _ "{" _ NewLine elements:UMLElement* _ "}" EndLine
  {
    return new types.Group(
      name?.name || "",
      name?.title || "",
      type,
      removeUndefined(elements),
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
    return new types.Note(
      extractText(text),
      of
    );
  }
  / _ "note "i _ Direction _ of:NoteOf? _ NewLine text:(!(_ "end note" NewLine) .)+ EndLine
  {
    return new types.Note(
      extractText(text),
      of
    );
  }
  / _ "note "i _ Direction _ of:NoteOf? _ NewLine text:(!(_ "end note" NewLine) .)+ EndLine
  {
    return new types.Note(
      extractText(text),
      of
    );
  }
  / _ "note "i _ text:QuotedString _ "as " Name EndLine
  {
    return new types.Note(
      text,
    );
  }

NoteOf
  = "of "i _ elementName:ElementReference "::"i memberName:MemberReference
  {
    return elementName.name + "::" + memberName.name;
  }
  / "of "i _ elementName:ElementReference
  {
    return elementName.name;
  }

//
// Class
//

Class
  = _ isAbstract:"abstract "i? _ "class " _ name:ElementName _ generics:Generics? _ extends_:Extends? _ implements_:Implements? _ stereotypes:Stereotypes? _ NewLine? _ "{" _ NewLine members:Member* _ "}" EndLine
  {
    return new types.Class(
      name.name,
      name.title,
      !!isAbstract,
      removeUndefined(members),
      extends_,
      implements_,
      generics,
      stereotypes
    );
  }
  / _ isAbstract:"abstract "i? _ "class " _ name:ElementName _ generics:Generics? _ extends_:Extends? _ implements_:Implements? _ stereotypes:Stereotypes? _ EndLine
  {
    return new types.Class(
      name.name,
      name.title,
      !!isAbstract,
      [],
      extends_,
      implements_,
      generics,
      stereotypes
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
    return new types.Method(
      name,
      !!isStatic,
      accessor,
      type,
      extractText(_arguments),
    );
  }
  / _ isStatic:"static "i? _ accessor:Accessor? _ name:Name _ "(" _arguments:(!")" .)* ")" EndLine
  {
    return new types.Method(
      name,
      !!isStatic,
      accessor,
      undefined,
      extractText(_arguments),
    );
  }


MemberVariable
  = _ isStatic:"static "i? _ accessor:Accessor? _ type:Name _ name:Name EndLine
  {
    return new types.MemberVariable(
      name,
      !!isStatic,
      accessor,
      type,
    );
  }
  / _ isStatic:"static "i? _ accessor:Accessor? _ name:Name _ ":"i? _ type:Name EndLine
  {
    return new types.MemberVariable(
      name,
      !!isStatic,
      accessor,
      type,
    );
  }
  / _ isStatic:"static "i? _ accessor:Accessor? _ name:Name EndLine
  {
    return new types.MemberVariable(
      name,
      !!isStatic,
      accessor
    );
  }

//
// Interface
//

Interface
  = _ "interface "i _ name:ElementName _ generics:Generics? _ extends_:Extends? _ implements_:Implements? _ stereotypes:Stereotypes? _ NewLine? _ "{" _ NewLine members:Member* _ "}" EndLine
  {
    return new types.Interface(
      name.name,
      name.title,
      removeUndefined(members),
      extends_,
      implements_,
      generics,
      stereotypes
    );
  }
  / _ "interface "i _ name:ElementName _ generics:Generics? _ extends_:Extends? _ implements_:Implements? _ stereotypes:Stereotypes? _ EndLine
  {
    return new types.Interface(
      name.name,
      name.title,
      [],
      extends_,
      implements_,
      generics,
      stereotypes
    );
  }

//
// Enum
//

Enum
  = _ "enum "i _ name:ElementName _ generics:Generics? _ extends_:Extends? _ implements_:Implements? _ stereotypes:Stereotypes? _ NewLine? _ "{" _ NewLine members:Member* _ "}" EndLine
  {
    return new types.Enum(
      name.name,
      name.title,
      removeUndefined(members),
      extends_,
      implements_,
      generics,
      stereotypes
    );
  }
  / _ "enum "i _ name:ElementName _ generics:Generics? _ extends_:Extends? _ implements_:Implements? _ stereotypes:Stereotypes? _ EndLine
  {
    return new types.Enum(
      name.name,
      name.title,
      [],
      extends_,
      implements_,
      generics,
      stereotypes
    );
  }

//
// Component
//

Component
  = _ "component "i _ name:ElementName _ Stereotypes? EndLine
  {
    return new types.Component(
      name.name,
      name.title,
    );
  }
  / _ name:ShortComponent EndLine
  {
    return new types.Component(
      name.name,
      name.title,
    );
  }

ShortComponent
  = "[" title:(!("]" / NewLine) .)+ "]" _ "as" _ name:Name
  {
    return {
      name: name,
      title: extractText(title),
    };
  }
  / "[" name:(!("]" / NewLine) .)+ "]"
  {
    name = extractText(name);
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
    return new types.UseCase(
      name.name,
      name.title,
    );
  }
  / _ name:ShortUseCase EndLine
  {
    return new types.UseCase(
      name.name,
      name.title,
    );
  }

ShortUseCase
  = "(" title:(!(")" / NewLine) .)+ ")" _ "as" _ name:Name
  {
    return {
      name: name,
      title: extractText(title),
    };
  }
  / "(" name:(!(")" / NewLine) .)+ ")"
  {
    name = extractText(name);
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
    return new types.Relationship(
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
      !!hidden,
    );
  }
  / _ left:ElementReference _ leftCardinality:QuotedString? _ leftArrowHead:RelationshipArrowHead? arrowBody:RelationshipArrowBody rightArrowHead:RelationshipArrowHead? _ rightCardinality:QuotedString? _ right:ElementReference _ label:(RelationshipLabel)? EndLine
  {
    return new types.Relationship(
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
  / "{"
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
    return extractText(label);
  }

RelationshipHidden
  = "[hidden]"

Generics
  = generics:( Generic _ )*
  {
    return removeUndefined(
      generics.map(
        (generic:string[]) => generic[0]
      )
    );
  }

Generic
  = !"<<" "<" _ generic:(( !">" . )+) _ ">"
  {
    return extractText(generic);
  }

Stereotypes
  = stereotypes:( Stereotype _ )*
  {
    return removeUndefined(
      stereotypes.map(
        (stereotype:string[]) => stereotype[0]
      )
    );
  }

Stereotype
  = "<<" _ stereotype:(( !">>" . )+) _ ">>"
  {
    return extractText(stereotype);
  }

Extends
  = "extends "i _ parents:NameList
  {
    return parents;
  }

Implements
  = "implements "i _ parents:NameList
  {
    return parents;
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
      type: 'Component',
    };
  }
  / element:ShortUseCase
  {
    return {
      name: element.name,
      type: 'UseCase',
    };
  }
  / name:Name
  {
    return {
      name: name,
      type: 'Unknown',
    };
  }

MemberReference
  = name:Name
  {
    return {
      name: name,
      type: 'Unknown',
    };
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
    return extractText(string);
  }

Name
  = name:([A-Za-z0-9._]+)
  {
    return name.join('');
  }

NameList
  = nameListItems:NameListItem* _ lastNameListItem:Name
  {
    return removeUndefined(
      nameListItems.concat(lastNameListItem)
    );
  }

NameListItem
  = _ name:Name _ ","
  {
    return name;
  }




Accessor
  = [\-#~+]

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


//
// Stdlib C4 Context
//

Stdlib_C4_Context
  = _ type:Stdlib_C4_Context_Types _ "(" _ alias:ElementName _ "," _ label:ElementName _ ","? _ descr:ElementName? _ ","? _ sprite:ElementName? _ ","? _ tags:ElementName? _ ","? _ link:ElementName? ")" EndLine
  {
    return new types.Stdlib_C4_Context(
      { source: 'Stdlib_C4', name: type },
      alias.name,
      label.name,
      descr ? descr.name : '',
      sprite ? sprite.name : '',
      tags ? tags.name : '',
      link ? link.name : '',
    );
  }

// Order matters
Stdlib_C4_Context_Types = "Person_Ext"i
  / "SystemDb_Ext"i
  / "SystemQueue_Ext"i
  / "Person"i
  / "System_Ext"i
  / "SystemDb"i
  / "SystemQueue"i
  / "System"i

//
// Stdlib C4 Container & Components
//

Stdlib_C4_Container_Component
  = _ type:Stdlib_C4_Container_Component_Type _ "(" _ alias:ElementName _ "," _ label:ElementName _ ","? _ techn:ElementName? _ ","? _ descr:ElementName? _ ","? _ sprite:ElementName? _ ","? _ tags:ElementName? _ ","? _ link:ElementName? ")" EndLine
  {
    return new types.Stdlib_C4_Container_Component(
      { source: 'Stdlib_C4', name: type },
      alias.name,
      label.name,
      techn ? techn.name : '',
      descr ? descr.name : '',
      sprite ? sprite.name : '',
      tags ? tags.name : '',
      link ? link.name : '',
    );
  }

// Order matters
Stdlib_C4_Container_Component_Type = "ContainerQueue_Ext"i
  / "ContainerQueue"i
  / "ContainerDb_Ext"i
  / "ContainerDb"i
  / "Container_Ext"i
  / "Container"i
  / "ComponentQueue_Ext"i
  / "ComponentQueue"i
  / "ComponentDb_Ext"i
  / "ComponentDb"i
  / "Component_Ext"i
  / "Component"i

//
// Stdlib C4 Boundaries
//

Stdlib_C4_Boundary
  = _ "Boundary" _ "(" _ alias:ElementName _ "," _ label:ElementName _ ","? _ type:ElementName? _ ","? _ tags:ElementName? _ ","? _ link:ElementName? ")" _ "{" _ NewLine elements:UMLElement* _ "}" EndLine
  {
    return new types.Stdlib_C4_Boundary(
      { source: 'Stdlib_C4', name: type ? type.name : 'Boundary' },
      alias.name,
      label.name,
      tags ? tags.name : '',
      link ? link.name : '',
      removeUndefined(elements)
    );
  }
  / _ type:Stdlib_C4_Boundary_Type _ "(" _ alias:ElementName _ "," _ label:ElementName _ ","? _ tags:ElementName? _ ","? _ link:ElementName? ")" _ "{" _ NewLine elements:UMLElement* _ "}" EndLine
  {
    return new types.Stdlib_C4_Boundary(
      { source: 'Stdlib_C4', name: type },
      alias.name,
      label.name,
      tags ? tags.name : '',
      link ? link.name : '',
      removeUndefined(elements)
    );
  }

Stdlib_C4_Boundary_Type = "Enterprise_Boundary"i
  / "System_Boundary"i
  / "Container_Boundary"i

//
// Stdlib C4 Dynamic
//

Stdlib_C4_Dynamic_Rel
  = _ type:Stdlib_C4_Dynamic_Rel_Type _ "(" _ from:ElementName _ ","  _ to:ElementName _ "," _ label:ElementName ","? _ techn:ElementName? ","? _ descr:ElementName? ","? _ sprite:ElementName? ","? _ tags:ElementName? ","? _ link:ElementName? ")" EndLine
  {
    return new types.Stdlib_C4_Dynamic_Rel(
      { source: 'Stdlib_C4', name: type },
      from.name,
      to.name,
      label.name,
      techn ? techn.name : '',
      descr ? descr.name : '',
      sprite ? sprite.name : '',
      tags ? tags.name : '',
      link ? link.name : '',
    );
  }

Stdlib_C4_Dynamic_Rel_Type = "Rel_Neighbor"i
  / "Rel_Back_Neighbor"i
  / "Rel_Back"i
  / "Rel_Down"i
  / "Rel_D"i
  / "Rel_Up"i
  / "Rel_U"i
  / "Rel_Left"i
  / "Rel_L"i
  / "Rel_Right"i
  / "Rel_R"i
  / "Rel"i
  / "BiRel_Neighbor"i
  / "BiRel_Down"i
  / "BiRel_D"i
  / "BiRel_Up"i
  / "BiRel_U"i
  / "BiRel_Left"i
  / "BiRel_L"i
  / "BiRel_Right"i
  / "BiRel_R"i
  / "BiRel"i

//
// Stdlib C4 Deployment
//

Stdlib_C4_Deployment
  = _ type_:Stdlib_C4_Deployment_Type _ "(" _ alias:ElementName _ "," _ label:ElementName ","? _ type:ElementName? ","? _ descr:ElementName? ","? _ sprite:ElementName? ","? _ tags:ElementName? ","? _ link:ElementName? ")" EndLine
  {
    return new types.Stdlib_C4_Deployment(
      { source: 'Stdlib_C4', name: type_ },
      alias.name,
      label.name,
      type ? type.name : '',
      descr ? descr.name : '',
      sprite ? sprite.name : '',
      tags ? tags.name : '',
      link ? link.name : '',
    );
  }

Stdlib_C4_Deployment_Type = "Deployment_Node_L"i
  / "Deployment_Node_R"i
  / "Deployment_Node"i
  / "Node_L"
  / "Node_R"
  / "Node"

//
// Stdlib C4 Rel
//

Stdlib_C4_Rel
  = _ "Rel_" _ "(" _ alias1:ElementName _ "," _ alias2:ElementName "," _ label:ElementName "," _ direction:ElementName ")" EndLine
  {
    return new types.Stdlib_C4_Rel(
      { source: 'Stdlib_C4', name: 'Rel_' },
      alias1.name,
      alias2.name,
      label.name,
      direction.name,
      undefined,
    );
  }
  / _ "Rel_" _ "(" _ alias1:ElementName _ "," _ alias2:ElementName "," _ label:ElementName "," _ techn:ElementName "," _ direction:ElementName ")" EndLine
  {
    return new types.Stdlib_C4_Rel(
      { source: 'Stdlib_C4', name: 'Rel_' },
      alias1.name,
      alias2.name,
      label.name,
      direction.name,
      techn.name,
    );
  }
