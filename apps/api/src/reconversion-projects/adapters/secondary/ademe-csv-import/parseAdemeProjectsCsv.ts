import { parse } from "csv-parse";
import { isValid, parse as parseDate } from "date-fns";
import { createReadStream, existsSync } from "node:fs";
import { z } from "zod";

import { fail, success } from "src/shared-kernel/result";
import type { TResult } from "src/shared-kernel/result";

const positiveNumberSchema = z
  .string()
  .transform((val) => {
    if (!val || val.trim() === "") return 0;
    // Handle French number format: comma as decimal, space as thousands separator
    const normalized = val.trim().replace(/\s+/g, "").replace(",", ".");
    const parsed = parseFloat(normalized);
    return isNaN(parsed) ? 0 : parsed;
  })
  .pipe(z.number().nonnegative());

const surfaceAreaSchema = positiveNumberSchema.refine(
  (surfaceArea) => {
    if (!surfaceArea) return true;
    return surfaceArea > 1;
  },
  {
    message: "Surface area must be greater than 1",
  },
);

const euroAmountSchema = z
  .string()
  .transform((val) => {
    if (!val || val.trim() === "") return 0;
    // Remove Euro symbol and spaces
    const normalized = val.replace("€", "").replace(/\s+/g, "").replace(",", ".");
    const parsed = parseFloat(normalized);
    return isNaN(parsed) ? 0 : parsed;
  })
  .pipe(z.number().nonnegative());

const frenchDateSchema = z.string().refine(
  (val) => {
    if (!val || val.trim() === "") return false;
    const parsedDate = parseDate(val, "dd/MM/yyyy", new Date());
    return isValid(parsedDate);
  },
  { message: "Date must be in format dd/MM/yyyy" },
);

const departementStringSchema = z
  .string()
  .transform((val) => {
    // values look like "75 - Paris", we want to extract "75"
    const departmentCode = val.split("-")[0]?.trim();
    return departmentCode;
  })
  .pipe(z.string().nonempty());

const rawCsvProjectRowSchema = z.object({
  ["ID"]: z.string().nonempty(),
  ["Nom du projet"]: z.string().nonempty(),
  ["Nom usuel de la friche"]: z.string(),
  ["Commune"]: z.string().nonempty(),
  ["Commune (code INSEE)"]: z.string().length(5).nonempty(),
  ["Département"]: departementStringSchema,
  ["Maître d'ouvrage du projet"]: z.string().optional(),
  ["Type de maître d'ouvrage"]: z.string().optional(),
  ["Activités antérieures simplifiées"]: z.string().optional(),
  ["Surface au sol bâtie"]: surfaceAreaSchema,
  ["Autres surfaces imperméabilisées"]: surfaceAreaSchema,
  ["surfaces minérales autres"]: surfaceAreaSchema,
  ["Surfaces enherbées"]: surfaceAreaSchema,
  ["Surfaces arborées"]: surfaceAreaSchema,
  ["Surface polluée (indicateur LISA) m²"]: surfaceAreaSchema,
  // project-related
  ["Date de démarrage"]: frenchDateSchema,
  ["Surface dépolluée (cour des comptes)"]: surfaceAreaSchema,
  ["Durée estimée des travaux (en mois)"]: positiveNumberSchema,
  // Espaces publics
  ["Espaces publics en revêtement imperméable (m²)"]: surfaceAreaSchema,
  ["Espaces publics en revêtement perméable (m²)"]: surfaceAreaSchema,
  ["Espaces publics bandes végétalisées (m²)"]: surfaceAreaSchema,
  // Espaces de vie et d'activité
  ["Emprises au sol bâti = bâtiment (m²)"]: surfaceAreaSchema,
  ["Espaces en revêtement imperméable (m²)"]: surfaceAreaSchema,
  ["Espaces en revêtement perméable (m²)"]: surfaceAreaSchema,
  ["Espaces verts privés (m²)"]: surfaceAreaSchema,
  // Bâtiments
  ["dont logements (m² SDP)"]: surfaceAreaSchema,
  ["dont commerce pied d'immeuble (m² SDP)"]: surfaceAreaSchema,
  ["dont bureaux (m² SDP)"]: surfaceAreaSchema,
  ["dont services et équipements de proximité (m² SDP)"]: surfaceAreaSchema,
  ["dont locaux d'artisanat ou commerciaux (hors pied d'immeuble) (m² SDP)"]: surfaceAreaSchema,
  ["dont équipements publics (m² SDP)"]: surfaceAreaSchema,
  ["dont Lieux culturels (m² SDP)"]: surfaceAreaSchema,
  ["dont Équipements sportifs (m² SDP)"]: surfaceAreaSchema,
  ["dont locaux industriels ou logistiques (m² SDP)"]: surfaceAreaSchema,
  ["dont parking silo (m² SDP)"]: surfaceAreaSchema,
  // Espaces verts publics
  ["Espaces verts publics (m²)"]: surfaceAreaSchema,
  ["Plan d'eau"]: surfaceAreaSchema,
  // financial
  ["Montant global de remise en état (€ HT)"]: euroAmountSchema,
  ["Total des dépenses sur l’opération globale (€ HT)"]: euroAmountSchema,
  ["Total des recettes sur l’opération globale (€ HT)"]: euroAmountSchema,
  ["Cession charges foncières"]: euroAmountSchema,
  // type de projet
  ["Logements, Projets mixtes, Equipements publics, Renaturation, Activité économique productive, Zones d'activités artisanales et industrielles, Logistique, autres activité économiques"]:
    z.string().nonempty(),
});

export type RawCsvProjectRow = z.infer<typeof rawCsvProjectRowSchema>;

type ParseAdemeProjectsCsvResult = TResult<
  RawCsvProjectRow[],
  "CSV_FILE_DOES_NOT_EXIST" | "CSV_PARSING_ERROR" | "CSV_VALIDATION_ERROR" | "PARSER_ERROR",
  unknown
>;

export type RowValidationError = {
  msg: string;
  rowId: string;
  errors: Record<string, string[]>;
};

export function parseAdemeProjectsCsv(filePath: string): Promise<ParseAdemeProjectsCsvResult> {
  return new Promise((resolve) => {
    if (!existsSync(filePath)) {
      resolve(fail("CSV_FILE_DOES_NOT_EXIST", [`File does not exist: ${filePath}`]));
      return;
    }
    const rows: RawCsvProjectRow[] = [];
    const rowValidationErrors: RowValidationError[] = [];

    const stream = createReadStream(filePath);
    const parser = parse({
      delimiter: ";",
      columns: true,
      skip_empty_lines: true,
      ltrim: true,
      trim: true,
      bom: true,
    });

    parser.on("readable", function () {
      let record;
      // oxlint-disable-next-line typescript/no-unsafe-assignment
      while ((record = parser.read()) !== null) {
        // skip PV projects
        if (
          record[
            "Logements, Projets mixtes, Equipements publics, Renaturation, Activité économique productive, Zones d'activités artisanales et industrielles, Logistique, autres activité économiques"
          ] === "Photovoltaïque"
        ) {
          continue;
        }

        const parseResult = rawCsvProjectRowSchema.safeParse(record);
        if (parseResult.success) {
          rows.push(parseResult.data);
        } else {
          const recordId = (record["ID"] as string) ?? "unknown";
          rowValidationErrors.push({
            msg: "Row validation failed for ID " + recordId,
            rowId: recordId,
            errors: z.flattenError(parseResult.error).fieldErrors,
          });
        }
      }
    });

    parser.on("error", (err) => {
      resolve(fail("PARSER_ERROR", err));
    });

    parser.on("end", () => {
      if (rowValidationErrors.length > 0) {
        resolve(fail("CSV_VALIDATION_ERROR", rowValidationErrors));
      } else {
        resolve(success(rows));
      }
    });

    stream.pipe(parser);
  });
}
