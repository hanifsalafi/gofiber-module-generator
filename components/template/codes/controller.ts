import { camelToKebabCase, camelToSnakeCase, lowercaseFirstLetter, uppercase } from "@/lib/utils";

interface Props {
    project?: string;
    module?: string;
	columns?: any[];
}

export const controllerCode = ({ project, module, columns }: Props) => {

const lowerModule = lowercaseFirstLetter(module);
const moduleFileName = camelToSnakeCase(module);
const router = camelToKebabCase(module);

let reqContext: string[] = [];
columns?.forEach((row) => {
	if (row.label != "id" && row.label != "created_at" && row.label != "updated_at" && row.label != "is_active"){
		reqContext.push(`${uppercase(row.label)}:              c.Query("${lowercaseFirstLetter(row.label)}"),`)
	}
});

return (
`package controller

import (
	"github.com/gofiber/fiber/v2"
	"github.com/rs/zerolog"
	"${project}/app/module/${moduleFileName}/request"
	"${project}/app/module/${moduleFileName}/response"
	"${project}/app/module/${moduleFileName}/service"
	"${project}/utils/paginator"
	"strconv"
	"time"

	utilRes "${project}/utils/response"
	utilVal "${project}/utils/validator"
)

type ${lowerModule}Controller struct {
	${lowerModule}Service service.${module}Service
	Log                   zerolog.Logger
}

type ${module}Controller interface {
	All(c *fiber.Ctx) error
	Show(c *fiber.Ctx) error
	Save(c *fiber.Ctx) error
	Update(c *fiber.Ctx) error
	Delete(c *fiber.Ctx) error
}

func New${module}Controller(${lowerModule}Service service.${module}Service, log zerolog.Logger) ${module}Controller {
	return &${lowerModule}Controller{
		${lowerModule}Service: ${lowerModule}Service,
		Log:                   log,
	}
}

// All get all ${module}
// @Summary      Get all ${module}
// @Description  API for getting all ${module}
// @Tags         ${module}
// @Security     Bearer
// @Param 	     req query request.${module}QueryRequest false "query parameters"
// @Param 	     req query paginator.Pagination false "pagination parameters"
// @Success      200  {object}  response.Response
// @Failure      400  {object}  response.BadRequestError
// @Failure      401  {object}  response.UnauthorizedError
// @Failure      500  {object}  response.InternalServerError
// @Router       /${router} [get]
func (_i *${lowerModule}Controller) All(c *fiber.Ctx) error {
	paginate, err := paginator.Paginate(c)
	if err != nil {
		return err
	}

	reqContext := request.${module}QueryRequestContext{
		${reqContext.join("\n	")}
	}
	req := reqContext.ToParamRequest()
	req.Pagination = paginate

	${lowerModule}Data, paging, err := _i.${lowerModule}Service.All(req)
	if err != nil {
		return err
	}

	return utilRes.Resp(c, utilRes.Response{
		Success:  true,
		Messages: utilRes.Messages{"${module} list successfully retrieved"},
		Data:     ${lowerModule}Data,
		Meta:     paging,
	})
}

// Show get one ${module}
// @Summary      Get one ${module}
// @Description  API for getting one ${module}
// @Tags         ${module}
// @Security     Bearer
// @Param        id path int true "${module} ID"
// @Success      200  {object}  response.Response
// @Failure      400  {object}  response.BadRequestError
// @Failure      401  {object}  response.UnauthorizedError
// @Failure      500  {object}  response.InternalServerError
// @Router       /${router}/:id [get]
func (_i *${lowerModule}Controller) Show(c *fiber.Ctx) error {
	id, err := strconv.ParseUint(c.Params("id"), 10, 0)
	if err != nil {
		return err
	}

	${lowerModule}Data, err := _i.${lowerModule}Service.Show(uint(id))
	if err != nil {
		return err
	}

	return utilRes.Resp(c, utilRes.Response{
		Success:  true,
		Messages: utilRes.Messages{"${module} successfully retrieved"},
		Data:     ${lowerModule}Data,
	})
}

// Save create ${module}
// @Summary      Create ${module}
// @Description  API for create ${module}
// @Tags         ${module}
// @Security     Bearer
// @Param 	     payload body request.${module}CreateRequest true "Required payload"
// @Success      200  {object}  response.Response
// @Failure      400  {object}  response.BadRequestError
// @Failure      401  {object}  response.UnauthorizedError
// @Failure      500  {object}  response.InternalServerError
// @Router       /${router} [post]
func (_i *${lowerModule}Controller) Save(c *fiber.Ctx) error {
	req := new(request.${module}CreateRequest)
	if err := utilVal.ParseAndValidate(c, req); err != nil {
		return err
	}

	authToken := c.Get("Authorization")
	dataResult, err := _i.${lowerModule}Service.Save(*req, authToken)
	if err != nil {
		return err
	}

	return utilRes.Resp(c, utilRes.Response{
		Success:  true,
		Messages: utilRes.Messages{"${module} successfully created"},
		Data:     dataResult,
	})
}

// Update update ${module}
// @Summary      update ${module}
// @Description  API for update ${module}
// @Tags         ${module}
// @Security     Bearer
// @Param 	     payload body request.${module}UpdateRequest true "Required payload"
// @Param        id path int true "${module} ID"
// @Success      200  {object}  response.Response
// @Failure      400  {object}  response.BadRequestError
// @Failure      401  {object}  response.UnauthorizedError
// @Failure      500  {object}  response.InternalServerError
// @Router       /${router}/:id [put]
func (_i *${lowerModule}Controller) Update(c *fiber.Ctx) error {
	id, err := strconv.ParseUint(c.Params("id"), 10, 0)
	if err != nil {
		return err
	}

	req := new(request.${module}UpdateRequest)
	if err := utilVal.ParseAndValidate(c, req); err != nil {
		return err
	}

	err = _i.${lowerModule}Service.Update(uint(id), *req)
	if err != nil {
		return err
	}

	return utilRes.Resp(c, utilRes.Response{
		Success:  true,
		Messages: utilRes.Messages{"${module} successfully updated"},
	})
}

// Delete delete ${module}
// @Summary      delete ${module}
// @Description  API for delete ${module}
// @Tags         ${module}
// @Security     Bearer
// @Param        id path int true "${module} ID"
// @Success      200  {object}  response.Response
// @Failure      400  {object}  response.BadRequestError
// @Failure      401  {object}  response.UnauthorizedError
// @Failure      500  {object}  response.InternalServerError
// @Router       /${router}/:id [delete]
func (_i *${lowerModule}Controller) Delete(c *fiber.Ctx) error {
	id, err := strconv.ParseUint(c.Params("id"), 10, 0)
	if err != nil {
		return err
	}

	err = _i.${lowerModule}Service.Delete(uint(id))
	if err != nil {
		return err
	}

	return utilRes.Resp(c, utilRes.Response{
		Success:  true,
		Messages: utilRes.Messages{"${module} successfully deleted"},
	})
}`
)}