---
weight: 1500
title: SQL to Array Transformation
---

# SQL Query to Array Transformation

This guide shows how to transform SQL query results into a structured array format suitable for entity setup questions.

## Transformation Function

```javascript
/**
 * Transforms SQL query results into entitySetupQuestions array format
 * @param {Array} sqlResults - Array of SQL result objects
 * @param {Array} existingQuestions - Existing entitySetupQuestions to filter out
 * @returns {Array} Transformed array of question objects
 */
function transformSqlToQuestions(sqlResults, existingQuestions = []) {
   // Create a set of existing slug_comp values for quick lookup
   const existingSlugComps = new Set(existingQuestions.map((q) => q.slug_comp));

   // Transform and filter SQL results
   const transformedQuestions = sqlResults
      .map((row) => {
         // Calculate slug_comp from record_type_code and feature
         const slugComp = `${row.record_type_code}:${row.feature}`;

         // Skip if this slug_comp already exists in entitySetupQuestions
         if (existingSlugComps.has(slugComp)) {
            return null;
         }

         // Create base question object with mapped keys
         const question = {
            question_text: row.question_text,
            question_label: row.question_label,
            question_order: null, // Order not provided in SQL, needs manual assignment
            is_required: row.is_required,
            question_type: row.feature_type, // Maps to question_type
            record_type_slug: row.record_type_code, // Maps record_type_code to record_type_slug
            field_type_slug: row.feature, // Maps feature to field_type_slug
            slug_comp: slugComp,
         };

         // Add question_help if question_comment exists
         if (row.question_comment) {
            question.question_help = row.question_comment;
         }

         // Add role_slug if resource_type is provided
         if (row.resource_type) {
            question.role_slug = row.resource_type;
         }

         // Add options if they exist
         if (row.options) {
            question.options = row.options;
         }

         // Add default_value if value is provided
         if (row.value) {
            question.default_value = row.value;
         }

         return question;
      })
      .filter((q) => q !== null); // Remove null entries (duplicates)

   return transformedQuestions;
}
```

## Example Usage

```javascript
// Example SQL results parsed into array format
const sqlResults = [
   {
      resource_type: "Company",
      resource: "Macrolight Trading, LLC",
      feature_type: "string",
      feature_type_id: "1583",
      record_type_code: "org",
      feature: "partner_slug",
      value: "",
      question_text: "What Partner will your account be connected to?",
      question_comment: null,
      question_label: "Connected Partner Slug",
      options: null,
      is_required: "1",
      account_id: "61209462",
   },
   {
      resource_type: "Company",
      resource: "Macrolight Trading, LLC",
      feature_type: "string",
      feature_type_id: "940",
      record_type_code: "org",
      feature: "requisite_consent",
      value: "a majority",
      question_text: "Requisite Consent:",
      question_comment:
         'This should either be "a majority" or be set at a specific percentage "xx%".',
      question_label: "Requisite Consent",
      options: null,
      is_required: "1",
      account_id: "61209462",
   },
   {
      resource_type: "Company",
      resource: "Macrolight Trading, LLC",
      feature_type: "options",
      feature_type_id: "881",
      record_type_code: "org",
      feature: "account_business_type",
      value: "For-profit Company",
      question_text: "What type of business is this entity?",
      question_comment: null,
      question_label: "Business Type",
      options: "For-profit Company,Non-profit Company,Investment Vehicle,Other",
      is_required: "1",
      account_id: "61209462",
   },
   // ... more rows
];

const entitySetupQuestions = [
   {
      question_text: "Provide the full legal name of your company:",
      question_label: "Official Company Name",
      question_help:
         "The Company Name input field is formatted to facilitate document automation. Select the company suffix you prefer. If you select that you have already formed your company, enter your company name exactly as it is shown on your formation documents.",
      question_order: 1,
      is_required: 1,
      question_type: "org_name",
      suffix_options: ["LLC", ", LLC", "LP", ", LP", "Inc", ", Inc"],
      role_slug: "Company",
      record_type_slug: "org",
      field_type_slug: "name",
      slug_comp: "org:name",
   },
   {
      question_text: "Have you already formed your entity?",
      question_label: "Previously Formed",
      question_help:
         "If you've already formed your entity, we'll have you upload your documents to make sure everything is in place. These documents will also be used as a reference for other legal work.",
      question_order: 2,
      is_required: 1,
      question_type: "options",
      options: "Yes,No",
      default_value: "No",
      record_type_slug: "org",
      field_type_slug: "already_formed_entity",
      slug_comp: "org:already_formed_entity",
   },
   {
      question_text: "Select your entity type:",
      question_label: "Entity Type",
      question_order: 3,
      is_required: 1,
      question_type: "options",
      options: "LLC,LP,Corporation",
      role_slug: "Company",
      record_type_slug: "org",
      field_type_slug: "entity_type",
      slug_comp: "org:entity_type",
   },
   // ... more existing questions
];

// Transform SQL results, filtering out existing questions
const newQuestions = transformSqlToQuestions(sqlResults, entitySetupQuestions);

console.log(newQuestions);
```

## Key Mappings

The following SQL column names map to object property names:

| SQL Column         | Object Property    | Notes                                  |
| ------------------ | ------------------ | -------------------------------------- |
| `question_comment` | `question_help`    | Description/help text for the question |
| `record_type_code` | `record_type_slug` | Record type identifier                 |
| `feature`          | `field_type_slug`  | Field type identifier                  |
| `resource_type`    | `role_slug`        | Optional role identifier               |
| `feature_type`     | `question_type`    | Type of question/input                 |
| `value`            | `default_value`    | Optional default value                 |

## Output Format

The transformed questions will have this structure:

```javascript
{
  question_text: string,          // Required: The question to display
  question_label: string,         // Required: Short label for tables/lists
  question_help: string?,         // Optional: Help text
  question_order: number?,        // Needs manual assignment
  is_required: string|number,     // "1" or "0" / 1 or 0
  question_type: string,          // Type of input (e.g., "string", "options", "date")
  options: string?,               // Optional: Comma-separated options
  default_value: string?,         // Optional: Default value
  role_slug: string?,             // Optional: Role identifier
  record_type_slug: string,       // Required: Record type
  field_type_slug: string,        // Required: Field type
  slug_comp: string              // Required: Composite key (record_type:field_type)
}
```

## Notes

- The `slug_comp` field is used to identify duplicates between SQL results and existing questions
- Questions with matching `slug_comp` values are automatically filtered out
- The `question_order` field needs to be manually assigned after transformation
- Special question types (like `org_name`) may require additional fields (like `suffix_options`)
