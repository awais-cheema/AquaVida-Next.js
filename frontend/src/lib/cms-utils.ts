/**
 * extractValues
 * Recursively extracts .value from Keystatic field objects.
 * This is used to flatten the complex field structures into a simple POJO
 * for the live preview stream over BroadcastChannel.
 */
export function extractValues(fields: any): any {
  if (!fields) return fields;

  // If it has a .value property, it's a Keystatic field
  if (Object.prototype.hasOwnProperty.call(fields, 'value')) {
    const val = fields.value;
    
    // If it's an array of fields
    if (Array.isArray(val)) {
      return val.map(v => extractValues(v));
    }
    
    // If it's an object of fields
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      const result: any = {};
      for (const key in val) {
        result[key] = extractValues(val[key]);
      }
      return result;
    }

    return val;
  }

  // If it's a plain object, recurse into its keys
  if (typeof fields === 'object' && fields !== null) {
    const result: any = {};
    for (const key in fields) {
      result[key] = extractValues(fields[key]);
    }
    return result;
  }

  // If it's just a value
  return fields;
}
