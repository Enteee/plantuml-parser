# Formatters

# Graph

```plantuml
@startuml
class has << (E,#FF0000) >> {
}
class storedIn << (E,#FF0000) >> {
}
class implements << (E,#FF0000) >> {
}
class exposes << (E,#FF0000) >> {
  type
  availability
}
class consumes << (E,#FF0000) >> {
  frequency
  serviceAccount
  criticality
}

abstract class UMLElement {
  name
  description
}

abstract class Entity {
}
Entity --|> UMLElement
Entity -- Entity
(Entity, Entity) .. implements
Entity -- Attribute
(Entity, Attribute) .. has

class Class << (N,#00FF00) >> {
  isAbstract
}
Class --|> Entity

class Interface << (N,#00FF00) >> {
}
Interface --|> Entity
Interface -- Component
(Interface, Component) .. exposes
Interface -- Component
(Interface, Component) .. consumes

class Attribute << (N,#00FF00) >> {
  type
  format
}
Attribute --|> UMLElement

class File << (N,#00FF00) >> {
  path
}
File -- UMLElement
(File, UMLElement) .. storedIn

class Component << (N,#00FF00) >> {
}
Component --|> UMLElement
@enduml
```
