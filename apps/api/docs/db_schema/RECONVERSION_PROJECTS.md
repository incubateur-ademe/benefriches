## Diagram

```mermaid
erDiagram

    reconversion_project_development_plan_costs {
        id uuid PK "not null"
        development_plan_id uuid FK "not null"
        purpose character_varying "not null"
        id uuid "not null"
        amount numeric "null"
    }

    reconversion_project_development_plans {
        id uuid PK "not null"
        reconversion_project_id uuid FK "not null"
        type character_varying "not null"
        features json "not null"
        id uuid "not null"
        developer_name character_varying "null"
        developer_structure_type character_varying "null"
        schedule_end_date timestamp_with_time_zone "null"
        schedule_start_date timestamp_with_time_zone "null"
    }

    reconversion_project_financial_assistance_revenues {
        id uuid PK "not null"
        reconversion_project_id uuid FK "not null"
        source character_varying "not null"
        id uuid "not null"
        amount numeric "null"
    }

    reconversion_project_reinstatement_costs {
        id uuid PK "not null"
        reconversion_project_id uuid FK "not null"
        purpose character_varying "not null"
        id uuid "not null"
        amount numeric "null"
    }

    reconversion_project_soils_distributions {
        id uuid PK "not null"
        reconversion_project_id uuid FK "not null"
        soil_type character_varying "not null"
        surface_area numeric "not null"
        id uuid "not null"
    }

    reconversion_project_yearly_expenses {
        id uuid PK "not null"
        reconversion_project_id uuid FK "not null"
        purpose character_varying "not null"
        amount numeric "not null"
        id uuid "not null"
    }

    reconversion_project_yearly_revenues {
        id uuid PK "not null"
        reconversion_project_id uuid FK "not null"
        source character_varying "not null"
        amount numeric "not null"
        id uuid "not null"
    }

    reconversion_projects {
        id uuid PK "not null"
        related_site_id uuid FK "not null"
        name character_varying "not null"
        created_at timestamp_with_time_zone "not null"
        id uuid "not null"
        creation_mode character_varying "null"
        future_operator_name character_varying "null"
        future_operator_structure_type character_varying "null"
        future_site_owner_name character_varying "null"
        future_site_owner_structure_type character_varying "null"
        project_phase character_varying "null"
        reinstatement_contract_owner_name character_varying "null"
        reinstatement_contract_owner_structure_type character_varying "null"
        operations_first_year integer "null"
        conversion_full_time_jobs_involved numeric "null"
        friche_decontaminated_soil_surface_area numeric "null"
        future_operations_full_time_jobs numeric "null"
        reinstatement_full_time_jobs_involved numeric "null"
        site_purchase_property_transfer_duties numeric "null"
        site_purchase_selling_price numeric "null"
        site_resale_expected_property_transfer_duties numeric "null"
        site_resale_expected_selling_price numeric "null"
        description text "null"
        reinstatement_schedule_end_date timestamp_with_time_zone "null"
        reinstatement_schedule_start_date timestamp_with_time_zone "null"
        created_by uuid "null"
    }

    reconversion_project_development_plans ||--o{ reconversion_project_development_plan_costs : "reconversion_project_development_plan_costs(development_plan_id) -> reconversion_project_development_plans(id)"
    reconversion_projects ||--o{ reconversion_project_development_plans : "reconversion_project_development_plans(reconversion_project_id) -> reconversion_projects(id)"
    reconversion_projects ||--o{ reconversion_project_financial_assistance_revenues : "reconversion_project_financial_assistance_revenues(reconversion_project_id) -> reconversion_projects(id)"
    reconversion_projects ||--o{ reconversion_project_reinstatement_costs : "reconversion_project_reinstatement_costs(reconversion_project_id) -> reconversion_projects(id)"
    reconversion_projects ||--o{ reconversion_project_soils_distributions : "reconversion_project_soils_distributions(reconversion_project_id) -> reconversion_projects(id)"
    reconversion_projects ||--o{ reconversion_project_yearly_expenses : "reconversion_project_yearly_expenses(reconversion_project_id) -> reconversion_projects(id)"
    reconversion_projects ||--o{ reconversion_project_yearly_revenues : "reconversion_project_yearly_revenues(reconversion_project_id) -> reconversion_projects(id)"
```

## Indexes

### `reconversion_project_development_plan_costs`

- `reconversion_project_development_plan_costs_id_unique`
- `reconversion_project_development_plan_costs_pkey`

### `reconversion_project_development_plans`

- `reconversion_project_development_plans_id_unique`
- `reconversion_project_development_plans_pkey`

### `reconversion_project_financial_assistance_revenues`

- `reconversion_project_financial_assistance_revenues_id_unique`
- `reconversion_project_financial_assistance_revenues_pkey`

### `reconversion_project_reinstatement_costs`

- `reconversion_project_reinstatement_costs_id_unique`
- `reconversion_project_reinstatement_costs_pkey`

### `reconversion_project_soils_distributions`

- `reconversion_project_soils_distributions_id_unique`
- `reconversion_project_soils_distributions_pkey`

### `reconversion_project_yearly_expenses`

- `reconversion_project_yearly_expenses_id_unique`
- `reconversion_project_yearly_expenses_pkey`

### `reconversion_project_yearly_revenues`

- `reconversion_project_yearly_revenues_id_unique`
- `reconversion_project_yearly_revenues_pkey`

### `reconversion_projects`

- `reconversion_projects_id_unique`
- `reconversion_projects_pkey`
