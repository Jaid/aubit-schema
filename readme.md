# aubit-schema

An **artifact** is the set of findings an agent produces. A **report** is the same set of findings with optional review fields that a human or another agent can edit. Every artifact is valid as a report.

Review fields belong directly on an entry. Each is optional: `state` accepts `open`, `resolved` or `rejected`; `visible` is a boolean; `comment` is a string. Omitting one leaves it unset.

```yaml
entries:
  readme_typo:
    title: Fix the installation heading
    category: language.spelling
    state: resolved
    visible: false
    comment: Fixed in the latest revision.
```

A **document** has its own report `entries` and a `collection` of reports keyed by Aubit ID. Both maps are required and either can be empty. Each collected report has its own `entries`.

Import `artifactSchema`, `reportSchema` or `documentSchema` from `aubit-schema` for Zod validation. `artifactJsonSchema`, `reportJsonSchema` and `documentJsonSchema` are their JSON Schema equivalents. The default export and `jsonSchema` refer to the artifact format.
