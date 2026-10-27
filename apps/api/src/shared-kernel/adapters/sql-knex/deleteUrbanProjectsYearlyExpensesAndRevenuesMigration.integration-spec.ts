import knex, { type Knex } from "knex";
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";

import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";

import { up } from "./migrations/20261027152837_delete-yearly-expenses-and-revenues-of-urban-reconversion-projects";

const SITE_ID = "11111111-1111-4111-8111-111111111111";
const USER_ID = "22222222-2222-4222-8222-222222222222";
const URBAN_PROJECT_ID = "33333333-3333-4333-8333-333333333333";
const PV_PROJECT_ID = "44444444-4444-4444-8444-444444444444";

type ExpenseRow = { id: string; purpose: string; amount: number; reconversion_project_id: string };
type RevenueRow = { id: string; source: string; amount: number; reconversion_project_id: string };

const insertSite = async (trx: Knex.Transaction): Promise<void> => {
  await trx("sites").insert({
    id: SITE_ID,
    created_by: USER_ID,
    name: "Site name",
    surface_area: 20000,
    owner_structure_type: "company",
    created_at: new Date("2026-01-01T00:00:00.000Z"),
  });
};

const insertProject = async (
  trx: Knex.Transaction,
  {
    id,
    developmentPlanId,
    developmentPlanType,
  }: {
    id: string;
    developmentPlanId: string;
    developmentPlanType: "URBAN_PROJECT" | "PHOTOVOLTAIC_POWER_PLANT";
  },
): Promise<void> => {
  await trx("reconversion_projects").insert({
    id,
    name: "Project",
    created_by: USER_ID,
    creation_mode: "custom",
    related_site_id: SITE_ID,
    created_at: new Date("2026-01-01T00:00:00.000Z"),
    buildings_resale_expected_selling_price: 140000,
    buildings_resale_expected_property_transfer_duties: 5000,
  });
  await trx("reconversion_project_development_plans").insert({
    id: developmentPlanId,
    reconversion_project_id: id,
    type: developmentPlanType,
    developer_name: "Promoteur",
    developer_structure_type: "company",
    features: {},
  });
};

const insertUrbanProject = (trx: Knex.Transaction) =>
  insertProject(trx, {
    id: URBAN_PROJECT_ID,
    developmentPlanId: "55555555-5555-4555-8555-555555555555",
    developmentPlanType: "URBAN_PROJECT",
  });

describe("migration 20261027152837 delete yearly expenses and revenues of urban reconversion projects", () => {
  let sqlConnection: Knex;

  before(() => {
    sqlConnection = knex(knexConfig);
  });

  after(async () => {
    await sqlConnection.destroy();
  });

  it("deletes the yearly expenses and yearly revenues of urban projects", async () => {
    const trx = await sqlConnection.transaction();
    try {
      await insertSite(trx);
      await insertUrbanProject(trx);
      await trx("reconversion_project_yearly_expenses").insert([
        {
          id: "a1111111-1111-4111-8111-111111111111",
          reconversion_project_id: URBAN_PROJECT_ID,
          purpose: "maintenance",
          amount: 12000,
        },
        {
          id: "a2222222-2222-4222-8222-222222222222",
          reconversion_project_id: URBAN_PROJECT_ID,
          purpose: "taxes",
          amount: 3000,
        },
      ]);
      await trx("reconversion_project_yearly_revenues").insert({
        id: "b1111111-1111-4111-8111-111111111111",
        reconversion_project_id: URBAN_PROJECT_ID,
        source: "rent",
        amount: 20000,
      });

      await up(trx);

      assert.deepStrictEqual(
        await trx("reconversion_project_yearly_expenses").where(
          "reconversion_project_id",
          URBAN_PROJECT_ID,
        ),
        [],
      );
      assert.deepStrictEqual(
        await trx("reconversion_project_yearly_revenues").where(
          "reconversion_project_id",
          URBAN_PROJECT_ID,
        ),
        [],
      );
    } finally {
      await trx.rollback();
    }
  });

  it("keeps the yearly expenses and yearly revenues of photovoltaic projects", async () => {
    const trx = await sqlConnection.transaction();
    try {
      await insertSite(trx);
      await insertUrbanProject(trx);
      await insertProject(trx, {
        id: PV_PROJECT_ID,
        developmentPlanId: "66666666-6666-4666-8666-666666666666",
        developmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
      });
      await trx("reconversion_project_yearly_expenses").insert([
        {
          id: "a1111111-1111-4111-8111-111111111111",
          reconversion_project_id: URBAN_PROJECT_ID,
          purpose: "maintenance",
          amount: 12000,
        },
        {
          id: "a3333333-3333-4333-8333-333333333333",
          reconversion_project_id: PV_PROJECT_ID,
          purpose: "rent",
          amount: 7000,
        },
        {
          id: "a4444444-4444-4444-8444-444444444444",
          reconversion_project_id: PV_PROJECT_ID,
          purpose: "maintenance",
          amount: 18000,
        },
      ]);
      await trx("reconversion_project_yearly_revenues").insert({
        id: "b2222222-2222-4222-8222-222222222222",
        reconversion_project_id: PV_PROJECT_ID,
        source: "operations",
        amount: 50000,
      });

      await up(trx);

      assert.deepStrictEqual(
        await trx("reconversion_project_yearly_expenses")
          .select("id", "purpose", "amount", "reconversion_project_id")
          .orderBy("id"),
        [
          {
            id: "a3333333-3333-4333-8333-333333333333",
            purpose: "rent",
            amount: 7000,
            reconversion_project_id: PV_PROJECT_ID,
          },
          {
            id: "a4444444-4444-4444-8444-444444444444",
            purpose: "maintenance",
            amount: 18000,
            reconversion_project_id: PV_PROJECT_ID,
          },
        ] satisfies ExpenseRow[],
      );
      assert.deepStrictEqual(
        await trx("reconversion_project_yearly_revenues")
          .select("id", "source", "amount", "reconversion_project_id")
          .orderBy("id"),
        [
          {
            id: "b2222222-2222-4222-8222-222222222222",
            source: "operations",
            amount: 50000,
            reconversion_project_id: PV_PROJECT_ID,
          },
        ] satisfies RevenueRow[],
      );
    } finally {
      await trx.rollback();
    }
  });

  it("keeps the buildings resale selling price and property transfer duties of urban projects", async () => {
    const trx = await sqlConnection.transaction();
    try {
      await insertSite(trx);
      await insertUrbanProject(trx);
      await trx("reconversion_project_yearly_expenses").insert({
        id: "a1111111-1111-4111-8111-111111111111",
        reconversion_project_id: URBAN_PROJECT_ID,
        purpose: "maintenance",
        amount: 12000,
      });
      await trx("reconversion_project_yearly_revenues").insert({
        id: "b1111111-1111-4111-8111-111111111111",
        reconversion_project_id: URBAN_PROJECT_ID,
        source: "rent",
        amount: 20000,
      });

      await up(trx);

      assert.deepStrictEqual(
        await trx("reconversion_projects").select(
          "id",
          "buildings_resale_expected_selling_price",
          "buildings_resale_expected_property_transfer_duties",
        ),
        [
          {
            id: URBAN_PROJECT_ID,
            buildings_resale_expected_selling_price: 140000,
            buildings_resale_expected_property_transfer_duties: 5000,
          },
        ],
      );
    } finally {
      await trx.rollback();
    }
  });
});
