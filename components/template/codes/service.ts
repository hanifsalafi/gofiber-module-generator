import { camelToKebabCase, camelToSnakeCase, lowercaseFirstLetter } from "@/lib/utils";

interface Props {
	project?: string;
    module?: string;
}

export const serviceCode = ({ project, module }: Props) => {

	
const lowerModule = lowercaseFirstLetter(module);
const moduleFileName = camelToSnakeCase(module);
const router = camelToKebabCase(module);

return (
`package service

import (
	"github.com/rs/zerolog"
	"${project}/app/database/entity"
	"${project}/app/module/${moduleFileName}/mapper"
	"${project}/app/module/${moduleFileName}/repository"
	"${project}/app/module/${moduleFileName}/request"
	"${project}/app/module/${moduleFileName}/response"
	"${project}/utils/paginator"
	usersRepository "${project}/app/module/users/repository"
	"time"

	utilSvc "go-humas-be/utils/service"
)

// ${module}Service
type ${lowerModule}Service struct {
	Repo        repository.${module}Repository
	UsersRepo   usersRepository.UsersRepository
	Log         zerolog.Logger
}

// ${module}Service define interface of I${module}Service
type ${module}Service interface {
	All(req request.${module}QueryRequest) (${lowerModule} []*response.${module}Response, paging paginator.Pagination, err error)
	Show(id uint) (${lowerModule} *response.${module}Response, err error)
	Save(req request.${module}CreateRequest, authToken string) (${lowerModule} *entity.${module}, err error)
	Update(id uint, req request.${module}UpdateRequest) (err error)
	Delete(id uint) error
}

// New${module}Service init ${module}Service
func New${module}Service(repo repository.${module}Repository, log zerolog.Logger, usersRepo usersRepository.UsersRepository) ${module}Service {

	return &${lowerModule}Service{
		Repo:      repo,
		Log:       log,
		UsersRepo: usersRepo,
	}
}

// All implement interface of ${module}Service
func (_i *${lowerModule}Service) All(req request.${module}QueryRequest) (${lowerModule}s []*response.${module}Response, paging paginator.Pagination, err error) {
	results, paging, err := _i.Repo.GetAll(req)
	if err != nil {
		return
	}

	for _, result := range results {
		${lowerModule}s = append(${lowerModule}s, mapper.${module}ResponseMapper(result))
	}

	return
}

func (_i *${lowerModule}Service) Show(id uint) (${lowerModule} *response.${module}Response, err error) {
	result, err := _i.Repo.FindOne(id)
	if err != nil {
		return nil, err
	}

	return mapper.${module}ResponseMapper(result), nil
}

func (_i *${lowerModule}Service) Save(req request.${module}CreateRequest, authToken string) (${lowerModule} *entity.${module}, err error) {
	_i.Log.Info().Interface("data", req).Msg("")

	newReq := req.ToEntity()

	createdBy := utilSvc.GetUserInfo(_i.Log, _i.UsersRepo, authToken)
	newReq.CreatedById = &createdBy.ID

	return _i.Repo.Create(newReq)
}

func (_i *${lowerModule}Service) Update(id uint, req request.${module}UpdateRequest) (err error) {
	_i.Log.Info().Interface("data", req).Msg("")
	return _i.Repo.Update(id, req.ToEntity())
}

func (_i *${lowerModule}Service) Delete(id uint) error {
	result, err := _i.Repo.FindOne(id)
	if err != nil {
		return err
	}

	isActive := false
	result.IsActive = &isActive
	return _i.Repo.Update(id, result)
}`
)}