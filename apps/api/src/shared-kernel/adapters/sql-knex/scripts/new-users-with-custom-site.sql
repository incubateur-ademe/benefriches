-- Nouveaux utilisateurs (cohorte 6 derniers mois) ayant créé au moins un site en mode personnalisé
--
-- Périmètre :
--   - Comptes créés il y a plus d'1 mois et moins de 6 mois (fenêtre glissante)
--   - Comptes internes exclus (table "internal_users")
--   - Site en mode personnalisé : creation_mode = 'custom'

WITH cohort AS (
  SELECT
    u.id,
    u.email,
    u.created_at,
    DATE_TRUNC('month', u.created_at) AS signup_month
  FROM users u
  WHERE
    u.created_at >= NOW() - INTERVAL '6 months'
    AND u.created_at <  NOW() - INTERVAL '1 month'
    AND u.email NOT IN (SELECT email FROM "internal_users")
),
with_custom_site AS (
  SELECT DISTINCT c.id
  FROM cohort c
  JOIN sites s
    ON  s.created_by = c.id
    AND s.creation_mode = 'custom'
),
per_month AS (
  SELECT
    TO_CHAR(c.signup_month, 'YYYY-MM')                                                        AS period,
    COUNT(DISTINCT c.id)                                                                       AS total_users,
    COUNT(DISTINCT w.id)                                                                       AS users_with_custom_site,
    ROUND(100.0 * COUNT(DISTINCT w.id) / NULLIF(COUNT(DISTINCT c.id), 0), 1)                 AS pct
  FROM cohort c
  LEFT JOIN with_custom_site w ON w.id = c.id
  GROUP BY c.signup_month
  ORDER BY c.signup_month
),
global_total AS (
  SELECT
    'TOTAL'                                                                                    AS period,
    COUNT(DISTINCT c.id)                                                                       AS total_users,
    COUNT(DISTINCT w.id)                                                                       AS users_with_custom_site,
    ROUND(100.0 * COUNT(DISTINCT w.id) / NULLIF(COUNT(DISTINCT c.id), 0), 1)                 AS pct
  FROM cohort c
  LEFT JOIN with_custom_site w ON w.id = c.id
)
SELECT * FROM per_month
UNION ALL
SELECT * FROM global_total;
