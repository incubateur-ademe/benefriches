import { z } from "zod";

// Entity ids (site, reconversion project, site action, compatibility evaluation…) are stored in
// Postgres `uuid` columns, which reject a malformed value with an error (a 500 on the API). A route
// taking an id in its path validates it with this schema, so a malformed id gets a 400 instead.
// `z.guid()` accepts any 8-4-4-4-12 hexadecimal id, like Postgres, rather than only RFC 9562 UUIDs
// (`z.uuid()`), so no id Postgres can store is refused.
export const idPathParamSchema = z.guid().meta({ example: "8c6e3b4a-3f5d-4a8e-9b1a-2f6c7d8e9f01" });
export type IdPathParam = z.infer<typeof idPathParamSchema>;
