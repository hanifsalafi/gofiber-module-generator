import { camelToKebabCase, camelToSnakeCase, lowercaseFirstLetter, uppercase } from "@/lib/utils";

interface Props {
    project?: string;
    module?: string;
	columns?: any[];
}

export const repositoryCode = ({ project, module, columns }: Props) => {

const lowerModule = lowercaseFirstLetter(module);
const moduleFileName = camelToSnakeCase(module);
const router = camelToKebabCase(module);

let queries: string[] = [];
columns?.forEach((row) => {
	if (row.label != "id" && row.label != "created_at" || row.label != "updated_at"){
		if (row.type == "varchar"){
			queries.push(
				`if req.${uppercase(row.label)} != nil && *req.${uppercase(row.label)} != "" {\n${lowercaseFirstLetter(uppercase(row.label))} := strings.ToLower(*req.${uppercase(row.label)})\nquery = query.Where("LOWER(${camelToSnakeCase(row.label)}) LIKE ?", "%"+strings.ToLower(${lowercaseFirstLetter(uppercase(row.label))})+"%")\n}`
			)
		} else if (row.type == "int") {
			queries.push(
				`if req.${uppercase(row.label)} != nil {\nquery = query.Where("${camelToSnakeCase(row.label)} = ?", req.${uppercase(row.label)})\n}`
			)
		}
	}
});

return (
`package repository

import (
	"${project}/app/database"
	"${project}/app/database/entity"
	"${project}/app/module/${moduleFileName}/request"
	"${project}/utils/paginator"
	"github.com/rs/zerolog"
	"strings"
	"time"
	"fmt"
)

type ${lowerModule}Repository struct {
	DB *database.Database
	Log zerolog.Logger
}

// ${module}Repository define interface of I${module}Repository
type ${module}Repository interface {
	GetAll(req request.${module}QueryRequest) (${lowerModule}s []*entity.${module}, paging paginator.Pagination, err error)
	FindOne(id uint) (${lowerModule} *entity.${module}, err error)
	Create(${lowerModule} *entity.${module}) (${lowerModule}Return *entity.${module},  err error)
	Update(id uint, ${lowerModule} *entity.${module}) (err error)
	Delete(id uint) (err error)
}

func New${module}Repository(db *database.Database, logger zerolog.Logger) ${module}Repository {
	return &${lowerModule}Repository{
		DB: db,
		Log: logger,
	}
}

// implement interface of I${module}Repository
func (_i *${lowerModule}Repository) GetAll(req request.${module}QueryRequest) (${lowerModule}s []*entity.${module}, paging paginator.Pagination, err error) {
	var count int64

	query := _i.DB.DB.Model(&entity.${module}{})
	query = query.Where("is_active = ?", true)

	${queries.join("\n	")}
	query.Count(&count)

	if req.Pagination.SortBy != "" {
		direction := "ASC"
		if req.Pagination.Sort == "desc" {
			direction = "DESC"
		}
		query.Order(fmt.Sprintf("%s %s", req.Pagination.SortBy, direction))
	}

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

func (_i *${lowerModule}Repository) Create(${lowerModule} *entity.${module}) (${lowerModule}Return *entity.${module}, err error) {
	result := _i.DB.DB.Create(${lowerModule})
	return ${lowerModule}, result.Error
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