const slugify = require('slugify');
const { errorHandler } = require('../helpers/dbErrorHandler');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const companyService=require('../service/company.service')

const create =catchAsync(async (req, res) => {
	const company = await companyService.create(req.body);
  	res.status(httpStatus.CREATED).send(company);
});

const edit = catchAsync(async (req, res) => {
	const company = await companyService.edit(req.body);
	res.send(company);
  });

  const list = catchAsync(async (req,res) => {

	const companys = await companyService.list();
	if (!companys ) {
	  throw new ApiError(httpStatus.NOT_FOUND, 'companys not found');
	}
	 res.send(companys);
  });

  const read = catchAsync(async (req,res) => {
	  
    const company = await companyService.read(req.params.id);
    console.log("test company ----->",company)
	if (!company ) {
	  throw new ApiError(httpStatus.NOT_FOUND, 'company not found');
	}
	 res.send(company);
  });

const remove = catchAsync(async (req, res) => {
	const company=await companyService.remove(req.params.id);
	res.send(company);
  });
  

module.exports = {
	create,
	remove,
	list,
	read,
	edit,
};
