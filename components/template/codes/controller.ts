import { camelToKebabCase, camelToSnakeCase, lowercaseFirstLetter } from "@/lib/utils";

interface Props {
    project?: string;
    module?: string;
}

export const controllerCode = ({ project, module }: Props) => {

const lowerModule = lowercaseFirstLetter(module);
const moduleFileName = camelToSnakeCase(module);
const router = camelToKebabCase(module);

return (
`package controller

import (
	"github.com/gofiber/fiber/v2"
	"strconv"
	"${project}/app/module/${moduleFileName}/request"
	"${project}/app/module/${moduleFileName}/service"
	"${project}/utils/paginator"

	utilRes "${project}/utils/response"
	utilVal "${project}/utils/validator"
)

type ${lowerModule}Controller struct {
	${lowerModule}Service service.${module}Service
}

type ${module}Controller interface {
	All(c *fiber.Ctx) error
	Show(c *fiber.Ctx) error
	Save(c *fiber.Ctx) error
	Update(c *fiber.Ctx) error
	Delete(c *fiber.Ctx) error
}

func New${module}Controller(${lowerModule}Service service.${module}Service) ${module}Controller {
	return &${lowerModule}Controller{
		${lowerModule}Service: ${lowerModule}Service,
	}
}

// All get all ${module}
// @Summary      Get all ${module}
// @Description  API for getting all ${module}
// @Tags         Task
// @Security     Bearer
// @Success      200  {object}  response.Response
// @Failure      401  {object}  response.Response
// @Failure      404  {object}  response.Response
// @Failure      422  {object}  response.Response
// @Failure      500  {object}  response.Response
// @Router       /${router} [get]
func (_i *${lowerModule}Controller) All(c *fiber.Ctx) error {
	paginate, err := paginator.Paginate(c)
	if err != nil {
		return err
	}

	var req request.${module}QueryRequest
	req.Pagination = paginate

	${module}s, paging, err := _i.${lowerModule}Service.All(req)
	if err != nil {
		return err
	}

	return utilRes.Resp(c, utilRes.Response{
		Messages: utilRes.Messages{"${module} list successfully retrieved"},
		Data:     ${module}s,
		Meta:     paging,
	})
}

// Show get one ${module}
// @Summary      Get one ${module}
// @Description  API for getting one ${module}
// @Tags         Task
// @Security     Bearer
// @Param        id path int true "${module} ID"
// @Success      200  {object}  response.Response
// @Failure      401  {object}  response.Response
// @Failure      404  {object}  response.Response
// @Failure      422  {object}  response.Response
// @Failure      500  {object}  response.Response
// @Router       /${router}/:id [get]
func (_i *${lowerModule}Controller) Show(c *fiber.Ctx) error {
	id, err := strconv.ParseUint(c.Params("id"), 10, 0)
	if err != nil {
		return err
	}

	${module}s, err := _i.${lowerModule}Service.Show(uint(id))
	if err != nil {
		return err
	}

	return utilRes.Resp(c, utilRes.Response{
		Messages: utilRes.Messages{"${module} successfully retrieved"},
		Data:     articles,
	})
}

// Save create ${module}
// @Summary      Create ${module}
// @Description  API for create ${module}
// @Tags         Task
// @Security     Bearer
// @Body 	     request.${module}CreateRequest
// @Success      200  {object}  response.Response
// @Failure      401  {object}  response.Response
// @Failure      404  {object}  response.Response
// @Failure      422  {object}  response.Response
// @Failure      500  {object}  response.Response
// @Router       /${router} [post]
func (_i *${lowerModule}Controller) Save(c *fiber.Ctx) error {
	req := new(request.${module}CreateRequest)
	if err := utilVal.ParseAndValidate(c, req); err != nil {
		return err
	}

	err := _i.${lowerModule}Service.Save(*req)
	if err != nil {
		return err
	}

	return utilRes.Resp(c, utilRes.Response{
		Messages: utilRes.Messages{"${module} successfully created"},
	})
}

// Update update ${module}
// @Summary      update ${module}
// @Description  API for update ${module}
// @Tags         Task
// @Security     Bearer
// @Body 	     request.${module}UpdateRequest
// @Param        id path int true "${module} ID"
// @Success      200  {object}  response.Response
// @Failure      401  {object}  response.Response
// @Failure      404  {object}  response.Response
// @Failure      422  {object}  response.Response
// @Failure      500  {object}  response.Response
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
		Messages: utilRes.Messages{"${module} successfully updated"},
	})
}

// Delete delete ${module}
// @Summary      delete ${module}
// @Description  API for delete ${module}
// @Tags         Task
// @Security     Bearer
// @Param        id path int true "${module} ID"
// @Success      200  {object}  response.Response
// @Failure      401  {object}  response.Response
// @Failure      404  {object}  response.Response
// @Failure      422  {object}  response.Response
// @Failure      500  {object}  response.Response
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
		Messages: utilRes.Messages{"${module} successfully deleted"},
	})
}`
)}