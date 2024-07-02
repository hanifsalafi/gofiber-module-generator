import { camelToKebabCase, camelToSnakeCase, lowercaseFirstLetter } from "@/lib/utils";

interface Props {
    project?: string;
    module?: string;
}

export const mainModuleCode = ({ project, module }: Props) => {

const lowerModule = lowercaseFirstLetter(module);
const moduleFileName = camelToSnakeCase(module);
const router = camelToKebabCase(module);

return (
`package ${moduleFileName}

import (
	"github.com/gofiber/fiber/v2"
	"${project}/app/module/${moduleFileName}/controller"
	"${project}/app/module/${moduleFileName}/repository"
	"${project}/app/module/${moduleFileName}/service"
	"go.uber.org/fx"
)

// struct of ${module}Router
type ${module}Router struct {
	App        fiber.Router
	Controller *controller.Controller
}

// register bulky of ${module} module
var New${module}Module = fx.Options(
	// register repository of ${module} module
	fx.Provide(repository.New${module}Repository),

	// register service of ${module} module
	fx.Provide(service.New${module}Service),

	// register controller of ${module} module
	fx.Provide(controller.NewController),

	// register router of ${module} module
	fx.Provide(New${module}Router),
)

// init ${module}Router
func New${module}Router(fiber *fiber.App, controller *controller.Controller) *${module}Router {
	return &${module}Router{
		App:        fiber,
		Controller: controller,
	}
}

// register routes of ${module} module
func (_i *${module}Router) Register${module}Routes() {
	// define controllers
	${lowercaseFirstLetter(module)}Controller := _i.Controller.${module}

	// define routes
	_i.App.Route("/${router}", func(router fiber.Router) {
		router.Get("/", ${lowercaseFirstLetter(module)}Controller.All)
		router.Get("/:id", ${lowercaseFirstLetter(module)}Controller.Show)
		router.Post("/", ${lowercaseFirstLetter(module)}Controller.Save)
		router.Put("/:id", ${lowercaseFirstLetter(module)}Controller.Update)
		router.Delete("/:id", ${lowercaseFirstLetter(module)}Controller.Delete)
	})
}`
)}