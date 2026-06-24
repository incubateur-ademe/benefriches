-- Nombre de projets de reconversion créés en mode personnalisé (6 derniers mois)
--
-- Périmètre :
--   - Projets créés dans les 6 derniers mois (fenêtre glissante)
--   - Projets en mode personnalisé : creation_mode = 'custom'
--   - Comptes internes exclus (table "internal_users")

WITH custom_projects AS (
  SELECT
    rp.id,
    rp.created_by,
    rp.created_at,
    DATE_TRUNC('month', rp.created_at) AS creation_month
  FROM reconversion_projects rp
  JOIN users u ON u.id = rp.created_by
  WHERE
    rp.created_at >= NOW() - INTERVAL '6 months'
    AND rp.creation_mode = 'custom'
    AND u.email NOT IN (SELECT email FROM "internal_users")
),
per_month AS (
  SELECT
    TO_CHAR(creation_month, 'YYYY-MM') AS period,
    COUNT(*)                            AS custom_projects_created
  FROM custom_projects
  GROUP BY creation_month
  ORDER BY creation_month
),
global_total AS (
  SELECT
    'TOTAL'  AS period,
    COUNT(*) AS custom_projects_created
  FROM custom_projects
)
SELECT * FROM per_month
UNION ALL
SELECT * FROM global_total;
