var mime = require('mime-types');
const {Storage} = require('@google-cloud/storage');
const { v4: uuidv4 } = require('uuid');
var express = require('express')
var multer  = require('multer')
var Config  = require('../config/config.js');

exports.create = async (req, res, next) => {
  const type = mime.lookup(req.file.originalname);


	const storage = new Storage({
		projectId: Config.google.projectId,
		keyFilename: './google.json',
	});

	const bucket = storage.bucket(config.google.bucket);
	const blob = bucket.file(`${uuid()}.${mime.extensions[type][0]}`);

	const stream = blob.createWriteStream({
		resumable: true,
		contentType: type,
		predefinedAcl: 'publicRead',
	});

	stream.on('error', err => {
		next(err);
	});

	stream.on('finish', () => {
		res.status(200).json({
			data: {
				url: `https://storage.googleapis.com/${bucket.name}/${blob.name}`,
			},
		});
	});

	stream.end(req.file.buffer);
};