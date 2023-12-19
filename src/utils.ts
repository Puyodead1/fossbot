import { ObjectSchema } from "yup";

export function getKeyTypes(schema: ObjectSchema<any, any, any>): Record<string, string> {
    const keyTypes: Record<string, string> = {};

    const fields = schema.describe().fields;

    Object.keys(fields).forEach((key) => {
        const field = fields[key];
        keyTypes[key] = field.type;
    });

    return keyTypes;
}
