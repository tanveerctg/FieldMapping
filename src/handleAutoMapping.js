//UUID
import { v4 as uuidv4 } from "uuid";

const handleAutoMapping = ({
  toModuleFields,
  fromModuleFields,
  fieldMapping,
}) => {
  //formatting fromModuleFields based on display_label
  const from_module_fields_based_on_display_level = {};
  fromModuleFields.forEach((field) => {
    from_module_fields_based_on_display_level[field.display_label] = field;
  });

  // extract fields based on display label from toModuleFields and fromModuleFields
  const commonFields = toModuleFields.flatMap((toModuleField) => {
    const mappedFields = from_module_fields_based_on_display_level;

    return mappedFields[toModuleField.display_label]
      ? [
          {
            toModuleField,
            fromModuleField: mappedFields[toModuleField.display_label],
          },
        ]
      : [];
  });
  // console.log({ commonFields });

  //formatting fieldMapping fields based api_name or id
  const fieldMappingBasedOnApiName = {};
  fieldMapping.forEach((field) => {
    fieldMappingBasedOnApiName[field.to?.api_name || field.id] = field;
    fieldMappingBasedOnApiName[field.to?.api_name || field.id].counted = false;
  });

  //find those fieldmapping fields whose to property is not null but from property is null
  const fields = commonFields.flatMap((field) => {
    //if a field of commonFields is found in fieldmapping and to property of that field is not empty and from property of that field is empty
    const isEmptyFromFieldOfFieldMapping =
      fieldMappingBasedOnApiName[field.toModuleField.api_name] &&
      fieldMappingBasedOnApiName[field.toModuleField.api_name].to !== null &&
      !fieldMappingBasedOnApiName[field.toModuleField.api_name].from;

    console.log(
      fieldMappingBasedOnApiName[field.toModuleField.api_name],
      isEmptyFromFieldOfFieldMapping
    );

    //if a field of commonFields is mandatory
    const isMandatoryField =
      fieldMappingBasedOnApiName[field.toModuleField.api_name]?.mandatory &&
      fieldMappingBasedOnApiName[field.toModuleField.api_name];

    //this is because of keep tracking fields of fieldMapping which is included in the commonFields
    if (fieldMappingBasedOnApiName[field.toModuleField?.api_name]) {
      fieldMappingBasedOnApiName[field.toModuleField?.api_name].counted = true;
    }

    if (isMandatoryField) {
      console.log("ASHCHE", isMandatoryField);
      return [
        {
          ...isMandatoryField,
          from:
            fieldMappingBasedOnApiName[field.toModuleField.api_name].from ||
            "$" + "{" + field.fromModuleField.api_name + "}",
        },
      ];
    } else if (isEmptyFromFieldOfFieldMapping) {
      console.log("isEmptyFromField", isEmptyFromFieldOfFieldMapping);
      return [fieldMappingBasedOnApiName[field.toModuleField.api_name]];
    } else {
      console.log("ELSE");
      return [
        {
          id:
            fieldMappingBasedOnApiName[field.toModuleField.api_name]?.id ||
            uuidv4(),
          to: fieldMappingBasedOnApiName[field.toModuleField.api_name]?.to || {
            api_name: field.fromModuleField.api_name,
            data_type: field.fromModuleField.data_type,
            display_label: field.fromModuleField.display_label,
          },
          from:
            fieldMappingBasedOnApiName[field.toModuleField.api_name]?.from ||
            "$" + "{" + field.fromModuleField.api_name + "}",
          mandatory: false,
        },
      ];
    }
  });

  console.log({ fields });
  // extract those fields from fieldMapping which are not included in the common fields
  const fieldsNotIncludedInCommonFields = Object.values(
    fieldMappingBasedOnApiName
  ).filter((field) => !field.counted);

  console.log({ fieldsNotIncludedInCommonFields });

  const allFields = [...fields, ...fieldsNotIncludedInCommonFields].sort(
    (a, b) => (a.mandatory === b.mandatory ? 0 : a ? -1 : 1)
  );

  console.log(
    "FILTERED LIST",
    fields,
    fieldMappingBasedOnApiName,
    fieldsNotIncludedInCommonFields
  );

  return allFields;
};

export default handleAutoMapping;
