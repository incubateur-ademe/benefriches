# Event Sourcing Reducer

Ce système modélise le formulaire de création de projet urbain en utilisant le pattern **Event Sourcing**.

Au lieu de stocker directement l'état des réponses, le système maintient un historique d'événements qui permettent de reconstruire l'état actuel du formulaire.

## Architecture Event Sourcing

### Types d'événements

Le système utilise deux types d'événements principaux :

```typescript
type FormEvent =
  | SerializedAnswerSetEvent<keyof StepAnswers>
  | SerializedAnswerDeletionEvent<keyof StepAnswers>;
```

#### ANSWER_SET

- **Usage** : Ajouter ou mettre à jour une réponse pour une étape
- **Source** : `"user"` (saisie utilisateur) ou `"system"` (valeur par défaut calculée)
- **Payload** : Les données de la réponse selon le type de l'étape

#### ANSWER_DELETED

- **Usage** : Invalider une réponse devenue incohérente suite à un changement
- **Déclenchement** : Automatique lors de la détection de dépendances brisées
- **Effet** : La réponse de l'étape devient `undefined`

### Résolution d'état

La réponse actuelle d'une étape est déterminée par **le dernier événement chronologique** :

- Si c'est un `ANSWER_SET` → la réponse est le payload de cet événement
- Si c'est un `ANSWER_DELETED` → aucune réponse (`undefined`)

## Architecture des Handlers

### BaseAnswerStepHandler

Classe abstraite pour les étapes nécessitant des réponses utilisateur :

```typescript
abstract class BaseAnswerStepHandler<T extends keyof StepAnswers> {
  // Méthodes abstraites à implémenter
  abstract setDefaultAnswers(context: StepContext): void;
  abstract handleUpdateSideEffects(context: StepContext, previous: T, new: T): void;

  // Méthodes communes
  load(context: StepContext): void;
  complete(context: StepContext, answers: T): void;
  getAnswers(context: StepContext): T | undefined;
}
```

**Responsabilités principales :**

- **`setDefaultAnswers`** : Calcule et applique les réponses par défaut lors du premier chargement
- **`handleUpdateSideEffects`** : Gère les effets de bord quand une réponse change (invalidation d'autres étapes)
- **`complete`** : Valide et enregistre les réponses, puis navigue vers l'étape suivante

### BaseStepHandler

Classe abstraite pour les étapes informatives (sans réponses) :

```typescript
abstract class BaseStepHandler {
  abstract previous(context: StepContext): void;
  abstract next(context: StepContext): void;
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
handleUpdateSideEffects(context, previousAnswers, newAnswers) {
  // Si les bâtiments sont supprimés
  if (previousAnswers.buildings && !newAnswers.buildings) {
    // Invalider toutes les étapes liées aux bâtiments
    BUILDINGS_STEPS.forEach(stepId => {
      BaseAnswerStepHandler.addAnswerDeletionEvent(context, stepId);
    });
  }
}
```

### Recalcul automatique

Les réponses système sont automatiquement recalculées quand leurs dépendances changent :

```typescript
if (FormState.hasLastAnswerFromSystem(events, "REINSTATEMENT_EXPENSES")) {
  // Supprimer l'ancienne valeur calculée
  BaseAnswerStepHandler.addAnswerDeletionEvent(context, "REINSTATEMENT_EXPENSES");
  // Elle sera recalculée au prochain load()
}
```

## FormState : Interface de lecture

La classe `FormState` fournit une API pour interroger l'état actuel :

```typescript
FormState.getStepAnswers(events, stepId); // Obtenir la réponse d'une étape
FormState.hasBuildings(events); // Vérifier les conditions métier
FormState.getProjectData(events); // Construire les données finales
```
