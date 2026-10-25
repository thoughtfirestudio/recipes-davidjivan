# recipes.davidjivan.net API

Base: `https://recipes.davidjivan.net/api`

All responses are JSON. CORS is open (`Access-Control-Allow-Origin: *`).

---

## `GET /api/recipes`

List all recipes with quick info and macros.

```json
[
  {
    "slug": "pumpkin-muffins",
    "name": "Pumpkin Muffins",
    "tags": ["breakfast", "muffins", "pumpkin"],
    "ovenTempF": 350,
    "bakeTimeMin": 22,
    "yield": 24,
    "yieldUnit": "muffins",
    "macros": {
      "perMuffin": {
        "wholeFoodVersion": { "calories": 140, "protein_g": 7.5, "carbs_g": 21, "fat_g": 3 },
        "proteinVersion": { "calories": 145, "protein_g": 9, "carbs_g": 20, "fat_g": 3 },
        "notes": "Estimates. With optional syrup included. Vary by brand."
      },
      "yield": { "count": 24, "pan": "standard 12-cup muffin tin, two trays" },
      "name": "Pumpkin Muffins",
      "slug": "pumpkin-muffins"
    }
  }
]
```

The `macros` object contains any macro fields the recipe defines (`perMeatball`, `perMuffin`, `perBite`, `perServing`, etc.) plus `yield`, `name`, and `slug` for pairing.

---

## `GET /api/recipes/:slug`

Full recipe data including ingredients, steps, and all custom fields.

```
GET /api/recipes/pumpkin-muffins
```

```json
{
  "recipe": {
    "name": "Pumpkin Muffins",
    "slug": "pumpkin-muffins",
    "tags": ["breakfast", "muffins", "pumpkin", "high-protein"],
    "yield": { "count": 24, "pan": "standard 12-cup muffin tin, two trays" },
    "ovenTempF": 350,
    "bakeTime": { "startCheckingMin": 18, "doneMin": "18-22" },
    "ingredients": { "dry": [...], "wet": [...], "foldIns": [...] },
    "steps": [...],
    "macrosPerMuffin": {...},
    "allergens": ["wheat", "milk", "egg"],
    "storage": "Fridge up to 4 days..."
  }
}
```

---

## `GET /api/recipes/:slug/macros`

Macros + yield only. Designed for fitness apps that just need the numbers.

```
GET /api/recipes/pumpkin-muffins/macros
```

```json
{
  "perMuffin": {
    "wholeFoodVersion": { "calories": 140, "protein_g": 7.5, "carbs_g": 21, "fat_g": 3 },
    "proteinVersion": { "calories": 145, "protein_g": 9, "carbs_g": 20, "fat_g": 3 },
    "notes": "Estimates. With optional syrup included. Vary by brand."
  },
  "yield": { "count": 24, "pan": "standard 12-cup muffin tin, two trays" },
  "name": "Pumpkin Muffins",
  "slug": "pumpkin-muffins"
}
```

---

## Fitness app flow

1. `GET /api/recipes` — populate a dropdown with recipe names
2. User picks a recipe and a serving count (e.g. "Pumpkin Muffins, 3 muffins")
3. `GET /api/recipes/pumpkin-muffins/macros` — get the per-unit macros
4. Multiply by serving count. The `yield.count` tells you the full batch size.

Example: user picks 3 muffins:
```
calories: 140 × 3 = 420
protein:  7.5 × 3 = 22.5g
carbs:    21  × 3 = 63g
fat:      3   × 3 = 9g
```

If the recipe has multiple versions (e.g. `wholeFoodVersion` vs `proteinVersion`), let the user pick which one.

---

## Errors

```json
{ "error": "not found" }      // 404
{ "error": "failed to load..." } // 500
```