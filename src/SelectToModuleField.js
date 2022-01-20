//Material Ui
import TextField from "@mui/material/TextField"
import Autocomplete from "@mui/material/Autocomplete"
import Box from "@mui/material/Box"

export default function SelectField({
	fields,
	label,
	fieldIndex,
	fieldData,
	setFieldMapping,
	fieldMapping,
}) {
	return (
		<Box mt={2}>
			{/* {JSON.stringify(fieldData)} */}
			{/* {JSON.stringify(
				fields.find((field) => field.api_name === fieldData?.to?.api_name)
			)} */}
			<Autocomplete
				disablePortal
				id='combo-box-demo'
				options={fields.filter((field) => {
					// console.log({ fields });
					// fieldMapping.forEach((f) => {
					//   console.log(f);
					// });
					const isSelectedForMapping = fieldMapping.find(
						(mappedField) => mappedField?.to?.api_name === field.api_name
					)

					if (isSelectedForMapping) {
						return false
					} else {
						return true
					}
				})}
				{...(fieldData?.["mandatory"]
					? { value: fields[fieldIndex] }
					: {
							value: fields.find(
								(field) => field.api_name === fieldData?.to?.api_name
							)
								? fields[
										fields.findIndex(
											(field) => field.api_name === fieldData?.to?.api_name
										)
								  ]
								: null,
					  })}
				value={
					fieldData?.["mandatory"]
						? fields[
								fields.findIndex(
									(field) => field.to.api_name === fieldData?.to?.api_name
								)
						  ]
						: fields.find((field) => field.api_name === fieldData?.to?.api_name)
						? fields[
								fields.findIndex(
									(field) => field.api_name === fieldData?.to?.api_name
								)
						  ]
						: null
				}
				// defaultValue={
				// 	fields.findIndex(
				// 		(field) => field.api_name === fieldData?.to?.api_name
				// 	) &&
				// 	fields[
				// 		fields.findIndex(
				// 			(field) => field.api_name === fieldData?.to?.api_name
				// 		)
				// 	]
				// }
				getOptionLabel={(option) =>
					fieldData?.["mandatory"]
						? option.to.display_label
						: option.display_label
				}
				disabled={fieldData?.["mandatory"]}
				disableClearable={true}
				onChange={(event, value) => {
					// set text to from fields in fieldmapping

					setFieldMapping((prev) =>
						prev.map((field) => {
							if (field.id !== fieldData.id) {
								return field
							} else {
								return {
									...field,
									to: {
										api_name: value.api_name,
										data_type: value.data_type,
										display_label: value.display_label,
									},
								}
							}
						})
					)
				}}
				renderInput={(params) => <TextField {...params} label={label} />}
			/>
		</Box>
	)
}
