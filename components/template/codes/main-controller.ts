import { camelToKebabCase, camelToSnakeCase, lowercaseFirstLetter } from "@/lib/utils";

interface Props {
    project?: string;
    module?: string;
}

export const mainControllerCode = ({ project, module }: Props) => {

const lowerModule = lowercaseFirstLetter(module);
const moduleFileName = camelToSnakeCase(module);
const router = camelToKebabCase(module);

return (
`package controller

import (
    "github.com/rs/zerolog"
    "${project}/app/module/${camelToSnakeCase(module)}/service"
)

type Controller struct {
	${module} ${module}Controller
}

func NewController(${module}Service service.${module}Service, log zerolog.Logger) *Controller {
	return &Controller{
		${module}: New${module}Controller(${module}Service, log),
	}
}`
)}