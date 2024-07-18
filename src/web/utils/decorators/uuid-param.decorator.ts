import { DomainError, InvalidUUID, UUID } from "@carbonteq/hexapp";
import { Param } from "@nestjs/common";
import { ApplyRefinedPipe } from "./dto-wrapper";

export const UUIDParam = <E extends DomainError>(
	name: string,
	errTransformer?: (err: InvalidUUID) => E,
) => Param(name, new ApplyRefinedPipe(UUID.create, errTransformer));
