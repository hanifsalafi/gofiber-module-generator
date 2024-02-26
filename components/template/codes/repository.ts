import { camelToKebabCase, camelToSnakeCase, lowercaseFirstLetter } from "@/lib/utils";

interface Props {
    project?: string;
    module?: string;
}

export const repositoryCode = ({ project, module }: Props) => {

const lowerModule = lowercaseFirstLetter(module);
const moduleFileName = camelToSnakeCase(module);
const router = camelToKebabCase(module);

return (
`package repository

import (
	"${project}/app/database"
	"${project}/app/database/entity"
	"${project}/app/module/${moduleFileName}/request"
	"${project}/utils/paginator"
)

type ${lowerModule}Repository struct {
	DB *database.Database
}

// ${module}Repository define interface of I${module}Repository
type ${module}Repository interface {
	GetAll(req request.${module}QueryRequest) (${lowerModule}s []*entity.${module}, paging paginator.Pagination, err error)
	FindOne(id uint) (${lowerModule} *entity.${module}, err error)
	Create(${lowerModule} *entity.${module}) (err error)
	Update(id uint, ${lowerModule} *entity.${module}) (err error)
	Delete(id uint) (err error)
}

func New${module}Repository(db *database.Database) ${module}Repository {
	return &${lowerModule}Repository{
		DB: db,
	}
}

// implement interface of I${module}Repository
func (_i *${lowerModule}Repository) GetAll(req request.${module}QueryRequest) (${lowerModule}s []*entity.${module}, paging paginator.Pagination, err error) {
	var count int64

	query := _i.DB.DB.Model(&entity.${module}{})
	query.Count(&count)

	req.Pagination.Count = count
	req.Pagination = paginator.Paging(req.Pagination)

	err = query.Offset(req.Pagination.Offset).Limit(req.Pagination.Limit).Find(&${lowerModule}s).Error
	if err != nil {
		return
	}

	paging = *req.Pagination

	return
}

func (_i *${lowerModule}Repository) FindOne(id uint) (${lowerModule} *entity.${module}, err error) {
	if err := _i.DB.DB.First(&${lowerModule}, id).Error; err != nil {
		return nil, err
	}

	return ${lowerModule}, nil
}

func (_i *${lowerModule}Repository) Create(${lowerModule} *entity.${module}) (err error) {
	return _i.DB.DB.Create(${lowerModule}).Error
}

func (_i *${lowerModule}Repository) Update(id uint, ${lowerModule} *entity.${module}) (err error) {
	return _i.DB.DB.Model(&entity.${module}{}).
		Where(&entity.${module}{ID: id}).
		Updates(${lowerModule}).Error
}

func (_i *${lowerModule}Repository) Delete(id uint) error {
	return _i.DB.DB.Delete(&entity.${module}{}, id).Error
}`
)}