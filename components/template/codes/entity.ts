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

const convertTypeGorm = (label: string) => {
	switch (label) {
		case "string":
		  	return "varchar";
		case "int":
		  	return "int4";
		case "boolean":
			return "bool";
		default:
		  	return label;
	}
}

export const entityCode = ({ project, module, columns }: Props) => {
	
const lowerModule = lowercaseFirstLetter(module);
const moduleFileName = camelToSnakeCase(module);
const router = camelToKebabCase(module);

// queryRequest.push(`${uppercase(row.label)}  ${convertType(row.type)}    \`json:"${camelToSnakeCase(row.label)}" gorm:"type:${convertTypeGorm(row.type)}"\``)

let defaultEntity: string[] = [];
columns?.forEach((row) => {
	if (row.label == "id"){
		defaultEntity.push(`ID  ${convertType(row.type)}    \`json:"id" gorm:"primaryKey;type:int4;autoIncrement"\``)
	} else if (row.label != "created_at" && row.label != "updated_at") {
		defaultEntity.push(`${uppercase(row.label)}  ${convertType(row.type)}    \`json:"${camelToSnakeCase(row.label)}" gorm:"type:${convertTypeGorm(row.type)}"\``)
	} else {
		defaultEntity.push(`${uppercase(row.label)}  ${convertType(row.type)}    \`json:"${camelToSnakeCase(row.label)}" gorm:"default:now()"\``)
	}
});

return (
`package entity

import "time"

type ${module} struct {
	${defaultEntity.join("\n	")}
}`
)}