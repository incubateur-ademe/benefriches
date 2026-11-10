import type { Knex } from "knex";

// Same search for every admin list of users: case-insensitive match on email, names or structure.
export const whereAdminUserMatchesSearch = (
  qb: Knex.QueryBuilder,
  search: string | undefined,
): Knex.QueryBuilder => {
  if (!search) return qb;
  const pattern = `%${search}%`;
  return qb.where((builder) => {
    builder
      .whereILike("users.email", pattern)
      .orWhereILike("users.firstname", pattern)
      .orWhereILike("users.lastname", pattern)
      .orWhereILike("users.structure_name", pattern);
  });
};
