import { camelToKebabCase, camelToSnakeCase, lowercaseFirstLetter, uppercase } from "@/lib/utils";
import { useEffect, useState } from "react";

interface Props {
	project?: string;
    module?: string;
	columns?: any[];
}

export const mapperCode = ({ project, module, columns }: Props) => {
	
const lowerModule = lowercaseFirstLetter(module);
const moduleFileName = camelToSnakeCase(module);
const router = camelToKebabCase(module);

let defaultMapper: string[] = [];
columns?.forEach((row) => {
	if (row.label == "id"){
		defaultMapper.push(`ID:    ${lowerModule}Req.ID,`);
	} else {
		defaultMapper.push(`${uppercase(row.label)}:    ${lowerModule}Req.${uppercase(row.label)},`);
	}
});

return (
`package mapper

import (
	"${project}/app/database/entity"
	res "${project}/app/module/${moduleFileName}/response"
)

func ${module}ResponseMapper(${lowerModule}Req *entity.${module}) (${lowerModule}Res *res.${module}Response) {
	if ${lowerModule}Req != nil {
		${lowerModule}Res = &res.${module}Response{
			${defaultMapper?.join("\n			")}
		}
	}
	return ${lowerModule}Res
}`
)}