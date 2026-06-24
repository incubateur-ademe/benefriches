-- Taux de reconnexion — cohorte des 6 derniers mois
--
-- Périmètre :
--   - Comptes créés il y a plus d'1 mois et moins de 6 mois (fenêtre glissante)
--   - Comptes internes exclus (table internal_users)
-- Définition "reconnecté" :
--   - Au moins un événement user.login-succeeded dont la date calendaire UTC
--     est strictement postérieure à la date de création du compte
--
-- Prérequis : la table internal_users doit exister (CREATE TABLE internal_users (email TEXT PRIMARY KEY))
-- Performance : un index sur domain_events(name) et un index GIN sur domain_events(payload)
--               améliorent significativement les temps de requête sur les grandes tables.

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
reconnected AS (
  SELECT DISTINCT c.id
  FROM cohort c
  JOIN domain_events de
    ON  de.payload->>'userId' = c.id::text
    AND de.name = 'user.login-succeeded'
    AND DATE(de.created_at) > DATE(c.created_at)
),
per_month AS (
  SELECT
    TO_CHAR(c.signup_month, 'YYYY-MM')                                          AS period,
    COUNT(DISTINCT c.id)                                                         AS total_users,
    COUNT(DISTINCT r.id)                                                         AS reconnected_users,
    ROUND(100.0 * COUNT(DISTINCT r.id) / NULLIF(COUNT(DISTINCT c.id), 0), 1)   AS reconnection_rate_pct
  FROM cohort c
  LEFT JOIN reconnected r ON r.id = c.id
  GROUP BY c.signup_month
  ORDER BY c.signup_month
),
global_total AS (
  SELECT
    'TOTAL'                                                                      AS period,
    COUNT(DISTINCT c.id)                                                         AS total_users,
    COUNT(DISTINCT r.id)                                                         AS reconnected_users,
    ROUND(100.0 * COUNT(DISTINCT r.id) / NULLIF(COUNT(DISTINCT c.id), 0), 1)   AS reconnection_rate_pct
  FROM cohort c
  LEFT JOIN reconnected r ON r.id = c.id
)
SELECT * FROM per_month
UNION ALL
SELECT * FROM global_total;
