'use strict';

import Namara from '../src/namara';

describe('namara', () => {
  let subject;
  let dataset;
  let version;
  let options;

  beforeEach(() => {
    subject = new Namara('myapikey');
    dataset = '18b854e3-66bd-4a00-afba-8eabfc54f524';
    version = 'en-2';
    options = {}
  });

  describe('getBasePath', () => {
    it('should have the proper api path', () => {
      expect(subject.getBasePath(dataset, version)).toEqual('/v0/data_sets/18b854e3-66bd-4a00-afba-8eabfc54f524/data/en-2');
    });
  });

  describe('getPath', () => {
    it('should have the proper api path', () => {
      expect(subject.getPath(dataset, version)).toEqual('/v0/data_sets/18b854e3-66bd-4a00-afba-8eabfc54f524/data/en-2?api_key=myapikey&');
    });

    it('should append select at the end of the path', () => {
      options.select = 'facility_code';
      expect(subject.getPath(dataset, version, options)).toEqual('/v0/data_sets/18b854e3-66bd-4a00-afba-8eabfc54f524/data/en-2?api_key=myapikey&select=facility_code');
    });

    it('should append where at then end of the path', () => {
      options.where = 'facility_code>1000';
      expect(subject.getPath(dataset, version, options)).toEqual('/v0/data_sets/18b854e3-66bd-4a00-afba-8eabfc54f524/data/en-2?api_key=myapikey&where=facility_code%3E1000');
    });

    it('should append sum at the end of the path', () => {
      options.operation = 'sum(facility_code)';
      expect(subject.getPath(dataset, version, options)).toEqual('/v0/data_sets/18b854e3-66bd-4a00-afba-8eabfc54f524/data/en-2/aggregation?api_key=myapikey&operation=sum(facility_code)');
    });

    it('should append select, where and operation at then end of the path', () => {
      options.select = 'facility_code';
      options.where = 'facility_code>1000';
      options.operation = 'count(*)';
      expect(subject.getPath(dataset, version, options)).toEqual('/v0/data_sets/18b854e3-66bd-4a00-afba-8eabfc54f524/data/en-2/aggregation?api_key=myapikey&select=facility_code&where=facility_code%3E1000&operation=count(*)');
    });
  });

  describe('isAggregation', () => {
    it('should return true', () => {
      options.select = 'facility_code';
      options.operation = 'sum(facility_code)';
      expect(Namara.isAggregation(options)).toBeTruthy();
    });

    it('should return false', () => {
      options.select = 'facility_code';
      expect(Namara.isAggregation()).toBeFalsy();
      expect(Namara.isAggregation(options)).toBeFalsy();
    });
  });

  describe('get', () => {
    it('should handle count properly', (done) => {
      const promise = new Promise((resolve, reject) => {
        resolve({result: 129})
      });

      spyOn(subject, 'get').and.returnValue(promise);

      subject.get()
        .then((data) => {
          expect(data.result).toEqual(129);
        })
        .then(done);
    });
  });
});
