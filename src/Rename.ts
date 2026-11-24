export type Rename<ObjectType, FromKey extends PropertyKey, ToKey extends PropertyKey> = {
  [Key in keyof ObjectType as Key extends FromKey ? ToKey : Key]: ObjectType[Key];
};