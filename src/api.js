import { Router } from 'express';
import mongoose from 'mongoose';
import Promise from 'bluebird';
import _ from 'lodash';

import HttpError from './util/HttpError';

const Crossword = mongoose.model('Crossword');
import { fields } from './mongo/crossword.model';

const router = Router();
export default router;

router.get('/crossword/:number', (req, res, next) => {
  const number = req.params.number;
  Crossword
    .findOne({ number })
    .then(crossword => {
      if (!crossword) {
        throw new HttpError(`Crossword ${number} not found`, 404);
      }
      res.send(crossword.toApiObject());
    })
    .catch(next);
});

router.post('/crossword/:number', (req, res, next) => {
  const number = req.params.number;
  const safeBody = _.omit(req.body || {}, ['number']);
  return Promise
    .resolve()
    .then(() => {
      if (_.isEmpty(safeBody)) {
        throw new HttpError('Missing body');
      }
      const crossword = new Crossword(safeBody);
      crossword.number = number;
      return crossword.save();
    })
    .then(crossword => res.send({
      message: `Created crossword ${number} successfully`,
      crossword: crossword.toApiObject()
    }))
    .catch(err => {
      if (err.code === 11000) {
        err = new HttpError(`Crossword ${number} already exists`);
      } else if (err.name === 'ValidationError') {
        err = new HttpError(err.message);
      }
      next(err);
    });
});

router.put('/crossword/:number', (req, res, next) => {
  const number = req.params.number;
  const safeBody = _.omit(req.body || {}, ['number']);
  return Promise
    .resolve()
    .then(() => {
      if (_.isEmpty(safeBody)) {
        throw new HttpError('Missing body');
      }
      return Crossword.findOne({number});
    })
    .then(crossword => {
      if (!crossword) {
        throw new HttpError('Crossword not found', 204);
      }
      _.keys(fields).forEach(key => {
        if (key in safeBody) {
          crossword[key] = safeBody[key];
        }
      });
      return crossword.save()
    })
    .then(crossword => res.send({
      message: `Updated crossword ${number} successfully`,
      crossword: crossword.toApiObject()
    }))
    .catch(err => {
      if (err.name === 'ValidationError') {
        err = new HttpError(err.message);
      }
      next(err);
    });
});
