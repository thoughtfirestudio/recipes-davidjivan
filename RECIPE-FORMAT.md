# Recipe Format for recipes.davidjivan.net

Give this to any AI to generate recipes in the right format.

---

## The format

Wrap every recipe in `{ "recipe": { ... } }`. Save each recipe as `recipes/<slug>.json` and register it in `recipes/index.json`.

### Base fields (always include)

```json
{
  "recipe": {
    "name": "Recipe Name",
    "slug": "recipe-name",
    "tags": ["tag1", "tag2"],
    "yield": { "count": 24, "pan": "standard 12-cup muffin tin, two trays" },
    "ovenTempF": 350,
    "bakeTime": { "startCheckingMin": 18, "doneMin": "18-22" },
    "ingredients": {
      "dry": [
        { "item": "all-purpose flour", "amount": "1 1/2 cups" }
      ],
      "wet": [
        { "item": "eggs", "amount": "4", "optional": true, "note": "Room temp" }
      ],
      "foldIns": [
        { "item": "chocolate chips", "amount": "1/2 cup" }
      ]
    },
    "steps": [
      "Step one.",
      "Step two."
    ]
  }
}
```

### Ingredient entries

| Field | Required | Notes |
|-------|----------|-------|
| `item` | yes | Ingredient name |
| `amount` | yes | Quantity with unit |
| `optional` | no | true/false — renders "optional" badge |
| `note` | no | Appears below ingredient as italic text |

### Ingredient groups

Keys under `ingredients` are the group labels (dry, wet, foldIns, etc.). Use whatever group names make sense — they render as section headers.

### Bake time

```json
"bakeTime": { "startCheckingMin": 18, "doneMin": "18-22" }
```

`doneMin` can be a string range ("18-22") or a single number.

### Yield

```json
"yield": { "count": 24, "pan": "standard 12-cup muffin tin, two trays" }
```

`pan` is optional.

### Registering in index.json

```json
{
  "slug": "recipe-name",
  "name": "Recipe Name",
  "tags": ["tag1", "tag2"],
  "ovenTempF": 350,
  "bakeTimeMin": 22,
  "yield": 24,
  "yieldUnit": "muffins"
}
```

### Custom fields

Throw in any extra fields. The renderer handles them automatically:

- **Strings** → rendered as block notes
- **Arrays of strings** → rendered as tag chips
- **Objects with `calories`/`protein_g`/`carbs_g`/`fat_g`** → rendered as a macro table
- **Nested objects with versioned macros** → rendered as a side-by-side comparison table
- **Everything else** → rendered as labeled sections

Examples of good custom fields:

```json
"allergens": ["wheat", "milk", "egg"],
"storage": "Fridge up to 4 days; freeze 2-3 months.",
"macrosPerMuffin": {
  "wholeFoodVersion": { "calories": 140, "protein_g": 7.5, "carbs_g": 21, "fat_g": 3 },
  "proteinVersion": { "calories": 145, "protein_g": 9, "carbs_g": 20, "fat_g": 3 },
  "notes": "Estimates. Vary by brand."
},
"oatSwap": {
  "wholeFoodVersion": "Use 3 1/2 cups rolled oats total. No protein powder.",
  "proteinVersion": "Use 2 cups rolled oats + 4 scoops vanilla protein powder.",
  "rule": "Oat flour = blended oats."
}
```

---

## What the AI should do

Given a recipe (from text, a photo, a link, whatever):

1. Parse it into the JSON structure above
2. Use reasonable ingredient groups (dry, wet, foldIns, sauce, frosting, etc.)
3. Derive the slug from the name (lowercase, hyphens for spaces)
4. Add any useful custom fields that don't fit the base schema
5. Output the complete JSON ready to save as a file

Don't overcomplicate it — the schema is flexible. If a recipe has a "Frosting" section, make it an ingredient group. If it has "Notes from grandma," make it a custom field. If a field doesn't fit, make one up.