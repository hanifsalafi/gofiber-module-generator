import { camelToKebabCase, camelToSnakeCase, lowercaseFirstLetter, uppercase } from "@/lib/utils";
import { useEffect, useState } from "react";

interface Props {
	project?: string;
    module?: string;
	columns?: any[];
}

const convertType = (type: string) => {
	switch (type) {
		case "varchar":
		  	return "string";
		case "serial":
		  	return "uint";
		case "boolean":
			return "bool";
		case "timestamp":
			return "time.Time";
		default:
		  	return type;
	}
}

export const responseCode = ({ project, module, columns }: Props) => {
	
const lowerModule = lowercaseFirstLetter(module);
const moduleFileName = camelToSnakeCase(module);
const router = camelToKebabCase(module);

let defaultResponse: string[] = [];
columns?.forEach((row) => {
	if (row.label == "id"){
		defaultResponse.push(`${row.label == "id" ? "ID" : uppercase(row.label)}  ${convertType(row.type)}    \`json:"${camelToSnakeCase(row.label)}"\``)
	} else {
		defaultResponse.push(`${uppercase(row.label)}  ${convertType(row.type)}    \`json:"${camelToSnakeCase(row.label)}"\``)
	}
});

return (
`package response

import "time"

type ${module}Response struct {
	${defaultResponse?.join("\n	")}
}`
)}