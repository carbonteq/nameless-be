import { IEntity, SerializedEntity } from "@carbonteq/hexapp"

export type SimpleSerialized<
  EntityInterface extends IEntity,
  T extends keyof EntityInterface = keyof IEntity,
> = SerializedEntity & Omit<EntityInterface, T | keyof IEntity>
