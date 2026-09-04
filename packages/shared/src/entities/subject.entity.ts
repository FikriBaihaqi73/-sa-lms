import type { Prisma } from "#generated/client";
import { subjectSelect } from "#selects/subject.select";

export type SubjectEntity = Prisma.SubjectGetPayload<{
  select: typeof subjectSelect;
}>;

export type SubjectListEntity = SubjectEntity[];
