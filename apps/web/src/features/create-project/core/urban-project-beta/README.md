# State Reducer

## Architecture des Handlers

### AnswerStepHandler

Interface implémentée par chaque objet spécifique à une étape nécessitant des réponses utilisateur :

```typescript
interface AnswerStepHandler<T extends AnswerStepId> extends StepHandler {
  readonly stepId: T;
  getNextStepId(context: StepContext): UrbanProjectCustomCreationStep;
  getPreviousStepId(context: StepContext): UrbanProjectCustomCreationStep;
  getDefaultAnswers?(context: StepContext): AnswersByStep[T] | undefined;
  getStepsToInvalidate?(
    context: StepContext,
    previous: AnswersByStep[T],
    current: AnswersByStep[T],
  ): AnswerStepId[];
  getShortcut?(
    context: StepContext,
    answers: AnswersByStep[T],
    hasChanged?: boolean,
  ): ShortcutResult | undefined;
  updateAnswersMiddleware?(context: StepContext, answers: AnswersByStep[T]): AnswersByStep[T];
}
```

**Responsabilités principales :**

- **`getDefaultAnswers`** : utilisée dans l'action redux loadStep, calcule les réponses par défaut de l'étape
- **`getStepsToInvalidate`** : utilisée dans l'action redux completeStep, si la réponse est une modification
- **`getShortcut`** : utilisée dans l'action redux completeStep, par exemple pour les étapes de sélection du mode de saisie, qui peuvent permettre de sauter un écran
- **`updateAnswersMiddleware`** : peut être utilisée dans l'action redux completeStep, pour modifier le payload de réponse, par exemple dans le cas du choix de revente d'un site, on peut assigner un `futureSiteOwner` selon la réponse

### InfoStepHandler

Objet plus simple pour les étapes informatives (sans réponses) :

```typescript
export interface StepHandler {
  readonly stepId: UrbanProjectCustomCreationStep;
  getNextStepId?(context: StepContext): UrbanProjectCustomCreationStep;
  getPreviousStepId?(context: StepContext): UrbanProjectCustomCreationStep;
}

export interface InfoStepHandler extends StepHandler {
  readonly stepId: InformationalStep;
}
```

## Système d'actions Redux

### Actions principales

#### `loadStep`

```typescript
loadStep({ stepId: keyof StepAnswers })
```

- Déclenche le calcul des réponses par défaut si aucune réponse n'existe
- Appelée lors de l'affichage d'une étape

#### `completeStep`

```typescript
completeStep({ stepId, answers });
```

- Enregistre les réponses utilisateur
- Déclenche les effets de bord (invalidation d'autres étapes)
- Navigue automatiquement vers l'étape suivante

#### `navigateToPrevious` / `navigateToNext`

```typescript
navigateToPrevious({ stepId });
navigateToNext({ stepId });
```

- Gère la navigation avec la logique conditionnelle intégrée dans chaque handler

## Gestion des dépendances

### Pattern de validation automatique

Quand une réponse change, le système invalide automatiquement les étapes dépendantes :

```typescript
getStepsToInvalidate(context, previousAnswers, newAnswers) {
  // Si les bâtiments sont supprimés
  if (previousAnswers.buildings && !newAnswers.buildings) {
    // Invalider toutes les étapes liées aux bâtiments
    return BUILDINGS_STEPS;
  }
}
```

### Recalcul automatique

Les réponses système sont automatiquement recalculées quand leurs dépendances changent :

```typescript
if (ReadStateHelper.hasLastAnswerFromSystem(events, "REINSTATEMENT_EXPENSES")) {
  // Supprimer l'ancienne valeur calculée
  return ["REINSTATEMENT_EXPENSES"];
  // Elle sera recalculée au prochain load()
}
```

## ReadStateHelper : Interface avec helpers de lecture

Pour éviter d'avoir à changer les appels dans les handlers à chaque changement de format du state

La classe `ReadStateHelper` fournit une API pour interroger l'état actuel :

```typescript
ReadStateHelper.getStepAnswers(steps, stepId); // Obtenir la réponse d'une étape
ReadStateHelper.hasBuildings(steps); // Vérifier les conditions métier
ReadStateHelper.getProjectData(steps); // Construire les données finales
```

## MutateStateHelper : Interface avec helpers de mutation du state

La classe `MutateStateHelper` fournit une API pour modifier l'état actuel :

```typescript
MutateStateHelper.navigateToStep(state, stepId);
MutateStateHelper.setDefaultValues(state, stepId, answers);
MutateStateHelper.completeStep(state, stepId, answers);
MutateStateHelper.deleteStepAnswer(state, stepId);
```
