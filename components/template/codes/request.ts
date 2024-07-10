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

const convertValidate = (label: string) => {
	switch (label) {
		case "username":
		  	return "required,lowercase";
		case "email":
		  	return "required,email";
		case "int":
			return "required,numeric";
		default:
		  	return "required";
	}
}

export const requestCode = ({ project, module, columns }: Props) => {
	
const lowerModule = lowercaseFirstLetter(module);
const moduleFileName = camelToSnakeCase(module);
const router = camelToKebabCase(module);

// queryRequest.push(`${uppercase(row.label)}  ${convertType(row.type)}    \`json:"${camelToSnakeCase(row.label)}" gorm:"type:${convertTypeGorm(row.type)}"\``)

let queryRequest: string[] = [];
let queryRequestContext: string[] = [];
let queryRequestContextToParamReq: string[] = [];
let createRequest: string[] = [];
let updateRequest: string[] = [];
columns?.forEach((row) => {
	if (row.label == "id"){
		updateRequest.push(`${row.label == "id" ? "ID" : uppercase(row.label)}  ${convertType(row.type)}    \`json:"${camelToSnakeCase(row.label)}" validate:"required"\``)
	} else if (row.label != "created_at" && row.label != "updated_at" && row.label != "is_active") {
		queryRequest.push(`${uppercase(row.label)}  *${convertType(row.type)}    \`json:"${lowercaseFirstLetter(uppercase(row.label))}"\``)
		queryRequestContext.push(`${uppercase(row.label)}  string    \`json:"${lowercaseFirstLetter(uppercase(row.label))}"\``)
		createRequest.push(`${uppercase(row.label)}  ${convertType(row.type)}    \`json:"${lowercaseFirstLetter(uppercase(row.label))}" validate:"${convertValidate(row.label)}"\``)
		updateRequest.push(`${uppercase(row.label)}  ${convertType(row.type)}    \`json:"${lowercaseFirstLetter(uppercase(row.label))}" validate:"${convertValidate(row.label)}"\``)

		if (row.type == "varchar"){
			queryRequestContextToParamReq.push(
				`if ${lowercaseFirstLetter(uppercase(row.label))} := req.${uppercase(row.label)}; ${lowercaseFirstLetter(uppercase(row.label))} != "" {\n request.${uppercase(row.label)} = &${lowercaseFirstLetter(uppercase(row.label))}\n }`
			)
		} else if (row.type == "int") {
			queryRequestContextToParamReq.push(
				`if ${lowercaseFirstLetter(uppercase(row.label))}Str := req.${uppercase(row.label)}; ${lowercaseFirstLetter(uppercase(row.label))}Str != "" {\n ${lowercaseFirstLetter(uppercase(row.label))}, err := strconv.Atoi(${lowercaseFirstLetter(uppercase(row.label))}Str)\nif err == nil { request.${uppercase(row.label)} = &${lowercaseFirstLetter(uppercase(row.label))} \n}\n}`
			)
		} else if (row.type == "boolean") {
			queryRequestContextToParamReq.push(
				`if ${lowercaseFirstLetter(uppercase(row.label))}Str := req.${uppercase(row.label)}; ${lowercaseFirstLetter(uppercase(row.label))}Str != "" {\n${lowercaseFirstLetter(uppercase(row.label))}, err := strconv.ParseBool(${lowercaseFirstLetter(uppercase(row.label))}Str)\nif err == nil { request.${uppercase(row.label)} = &${lowercaseFirstLetter(uppercase(row.label))} }\n}`
			)
		}
	} else if (row.label != "created_at" && row.label != "is_active") {
		updateRequest.push(`${uppercase(row.label)}  ${convertType(row.type)}    \`json:"${camelToSnakeCase(row.label)}"\``)
	}
});

let createEntity: string[] = [];
let updateEntity: string[] = [];
columns?.forEach((row) => {
	if (row.label == "id"){
		updateEntity.push(`ID:    req.ID,`);
	} else if (row.label == "updated_at"){
		updateEntity.push(`${uppercase(row.label)}:    req.${uppercase(row.label)},`);
	} else if (row.label != "created_at" && row.label != "is_active"){
		createEntity.push(`${uppercase(row.label)}:    req.${uppercase(row.label)},`);
		updateEntity.push(`${uppercase(row.label)}:    req.${uppercase(row.label)},`);
	}
});


return (
`package request

import (
	"${project}/app/database/entity"
	"${project}/utils/paginator"
	"strconv"
	"time"
)

type ${module}Generic interface {
	ToEntity()
}

type ${module}QueryRequest struct {
	${queryRequest.join("\n	")}
	Pagination  *paginator.Pagination \`json:"pagination"\`
}


type ${module}CreateRequest struct {
	${createRequest.join("\n	")}
}

func (req ${module}CreateRequest) ToEntity() *entity.${module} {
	return &entity.${module}{
		${createEntity.join("\n		")}
	}
}

type ${module}UpdateRequest struct {
	${updateRequest.join("\n	")}
}

func (req ${module}UpdateRequest) ToEntity() *entity.${module} {
	return &entity.${module}{
		${updateEntity.join("\n		")}
	}
}
	
type ${module}QueryRequestContext struct {
	${queryRequestContext.join("\n	")}
}
	
func (req ${module}QueryRequestContext) ToParamRequest() ${module}QueryRequest {
    var request ${module}QueryRequest

	${queryRequestContextToParamReq.join("\n	")}

	return request
}`
)}