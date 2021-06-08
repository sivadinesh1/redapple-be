const slugify = require('slugify');
const { errorHandler } = require('../helpers/dbErrorHandler');
const db = require('../helpers/db');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const tagService=require('../service/tag.service')

const create =catchAsync(async (req, res) => {
	const { name } = req.body;
	const tag = await tagService.create(req.body);
  	res.status(httpStatus.CREATED).send(tag);
});

const edit = catchAsync(async (req, res) => {
	const tag = await tagService.edit(req.body);
	res.send(tag);
  });

  const list = catchAsync(async (req,res) => {

	const tags = await tagService.list(req.params.companyid);
	if (!tags ) {
	  throw new ApiError(httpStatus.NOT_FOUND, 'Tags not found');
	}
	 res.send(tags);
  });

  const read = catchAsync(async (req,res) => {
	  
	const tag = await tagService.read(req.params.slug);
	if (!tag ) {
	  throw new ApiError(httpStatus.NOT_FOUND, 'Tag not found');
	}
	 res.send(tag);
  });

const remove = catchAsync(async (req, res) => {
	const tag=await tagService.remove(req.params.slug);
	res.send(tag);
  });
  

module.exports = {
	create,
	remove,
	list,
	read,
	edit,
};
