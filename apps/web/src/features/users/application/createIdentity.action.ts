import { z } from "zod";

import { createAppAsyncThunk } from "@/app/application/appAsyncThunk";

export interface IdentityGateway {
  save(identity: CreateIdentityPayload): Promise<void>;
}

export type CreateIdentityProps = {
  email: string;
  firstname?: string;
  lastname?: string;
  structureType?: string;
  structureName?: string;
  personalDataStorageConsented: boolean;
  personalDataAnalyticsUseConsented: boolean;
  personalDataCommunicationUseConsented: boolean;
};
export type CreateIdentityPayload = CreateIdentityProps & {
  id: string;
};

const createIdentitySchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  structureType: z.string().optional(),
  structureName: z.string().optional(),
  personalDataStorageConsented: z.boolean(),
  personalDataAnalyticsUseConsented: z.boolean(),
  personalDataCommunicationUseConsented: z.boolean(),
});

export const createIdentity = createAppAsyncThunk<Promise<void>, CreateIdentityProps>(
  "user/createIdentity",
  async (identityProps, { extra, getState }) => {
    const { currentUser } = getState().currentUser;

    if (!currentUser) {
      throw new Error("user/createIdentity: No local id found for user");
    }

    const identity = createIdentitySchema.parse({ ...identityProps, id: currentUser.id });
    await extra.identityService.save(identity);
    await extra.userService.saveCurrentUser({ ...currentUser, identitySaved: true });
  },
);
