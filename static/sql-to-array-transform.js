/**
 * SQL to Array Transformation Utility
 * Converts SQL query results into entitySetupQuestions array format
 */

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

/**
 * Parses SQL INSERT statement into array of objects
 * @param {string} sqlInsert - SQL INSERT statement string
 * @returns {Array} Array of objects representing the SQL data
 */
function parseSqlInsert(sqlInsert) {
   // Extract column names from INSERT statement
   const columnsMatch = sqlInsert.match(/\(`([^)]+)`\)/);
   if (!columnsMatch) {
      throw new Error("Could not parse column names from SQL");
   }

   const columns = columnsMatch[1]
      .split(",")
      .map((col) => col.trim().replace(/`/g, ""));

   // Extract VALUES section
   const valuesMatch = sqlInsert.match(/VALUES\s+([\s\S]+)/i);
   if (!valuesMatch) {
      throw new Error("Could not find VALUES in SQL");
   }

   // Parse each row
   const rows = [];
   const valueLines = valuesMatch[1].trim();

   // Simple regex to match row values - handles strings with commas
   const rowRegex = /\(([^)]+(?:\([^)]*\)[^)]*)*)\)/g;
   let rowMatch;

   while ((rowMatch = rowRegex.exec(valueLines)) !== null) {
      const rowData = rowMatch[1];
      const values = [];
      let currentValue = "";
      let inQuotes = false;
      let depth = 0;

      // Parse values handling quoted strings and nested commas
      for (let i = 0; i < rowData.length; i++) {
         const char = rowData[i];

         if (char === "'" && (i === 0 || rowData[i - 1] !== "\\")) {
            inQuotes = !inQuotes;
            currentValue += char;
         } else if (char === "(" && !inQuotes) {
            depth++;
            currentValue += char;
         } else if (char === ")" && !inQuotes) {
            depth--;
            currentValue += char;
         } else if (char === "," && !inQuotes && depth === 0) {
            values.push(currentValue.trim());
            currentValue = "";
         } else {
            currentValue += char;
         }
      }

      if (currentValue.trim()) {
         values.push(currentValue.trim());
      }

      // Create object from columns and values
      if (values.length === columns.length) {
         const rowObj = {};
         columns.forEach((col, idx) => {
            let value = values[idx].trim();
            // Remove quotes and unescape
            if (value.startsWith("'") && value.endsWith("'")) {
               value = value.slice(1, -1).replace(/\\'/g, "'");
            }
            // Convert NULL to null
            if (value === "NULL") {
               value = null;
            }
            rowObj[col] = value;
         });
         rows.push(rowObj);
      }
   }

   return rows;
}

// Example usage with the provided SQL data
const exampleSqlInsert = `INSERT INTO \`<table>\` (\`resource_type\`, \`resource\`, \`feature_type\`, \`feature_type_id\`, \`record_type_code\`, \`feature\`, \`value\`, \`question_text\`, \`question_comment\`, \`question_label\`, \`options\`, \`is_required\`, \`account_id\`)
VALUES
	('Company', 'Macrolight Trading, LLC', 'string', '1583', 'org', 'partner_slug', '', 'What Partner will your account be connected to?', NULL, 'Connected Partner Slug', NULL, '1', '61209462'),
	('Company', 'Macrolight Trading, LLC', 'string', '940', 'org', 'requisite_consent', 'a majority', 'Requisite Consent:', 'This should either be "a majority" or be set at a specific percentage "xx%".', 'Requisite Consent', NULL, '1', '61209462'),
	('Company', 'Macrolight Trading, LLC', 'options', '881', 'org', 'account_business_type', 'For-profit Company', 'What type of business is this entity?', NULL, 'Business Type', 'For-profit Company,Non-profit Company,Investment Vehicle,Other', '1', '61209462')`;

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
   {
      question_text: "What type of LLC is this?",
      question_label: "LLC Type",
      question_order: 4,
      is_required: 1,
      required_slug_comp: "org:entity_type",
      required_question_value: "LLC",
      question_type: "options",
      options: "Operating Business,Fund Manager (GP) or Management Company",
      default_value: "Fund Manager (GP) or Management Company",
      role_slug: "Company",
      record_type_slug: "org",
      field_type_slug: "llc_type",
      slug_comp: "org:llc_type",
   },
   {
      question_text: "LP Type:",
      question_label: "LP Type",
      question_order: 5,
      is_required: 1,
      required_slug_comp: "org:entity_type",
      required_question_value: "LP",
      question_type: "options",
      options: "Multi-Asset Fund,Single-Asset Fund",
      role_slug: "Company",
      record_type_slug: "org",
      field_type_slug: "lp_type",
      slug_comp: "org:lp_type",
   },
   {
      question_text:
         "Please provide your entity's state of incorporation/formation:",
      question_label: "Domestic State",
      question_help:
         "Note: Your incorporation state may differ from your operating state(s). For example, many entities file in Delaware without having operations there.",
      question_order: 6,
      is_required: 1,
      question_type: "state",
      default_value: "Delaware",
      role_slug: "Company",
      record_type_slug: "org",
      field_type_slug: "filing_state",
      slug_comp: "org:filing_state",
   },
];

// Example: Parse and transform
if (typeof module !== "undefined" && module.exports) {
   module.exports = {
      transformSqlToQuestions,
      parseSqlInsert,
   };
}

// Example usage in browser console or Node.js
if (typeof window !== "undefined" || typeof process !== "undefined") {
   console.log("SQL to Array Transformation Utility loaded");
   console.log("Use: transformSqlToQuestions(sqlResults, existingQuestions)");
   console.log("Or: parseSqlInsert(sqlInsertString)");
}
