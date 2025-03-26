const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const axios = require('axios');
const { getWeatherDataCtrl } = require('../Controller/Weather/WeatherData');

const { expect } = chai;
chai.use(chaiHttp);

describe('Weather API Controller', function () {
    let req, res, sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        req = { query: {} };
        res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis(),
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should return weather data for a valid city', async function () {
        req.query.city = 'London';

        // Mock API response
        const mockResponse = { data: { name: 'London', main: { temp: 22.5 } } };
        sandbox.stub(axios, 'get').resolves(mockResponse);

        await getWeatherDataCtrl(req, res);

        expect(res.json.calledWith(mockResponse.data)).to.be.true;
    });

    it('should return weather data for valid latitude and longitude', async function () {
        req.query.lat = 51.5074;
        req.query.lon = -0.1278;

        const mockResponse = { data: { name: 'London', main: { temp: 22.5 } } };
        sandbox.stub(axios, 'get').resolves(mockResponse);

        await getWeatherDataCtrl(req, res);

        expect(res.json.calledWith(mockResponse.data)).to.be.true;
    });

    it('should return 400 for invalid request parameters', async function () {
        req.query = {}; // No city or lat/lon

        await getWeatherDataCtrl(req, res);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.called).to.be.true;
    });

    it('should handle API errors properly', async function () {
        req.query.city = 'InvalidCity';
    
        const mockError = { response: { status: 404, data: { message: 'City not found' } } };
        sandbox.stub(axios, 'get').rejects(mockError);
    
        await getWeatherDataCtrl(req, res);
    
        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledWith({ error: 'City not found' })).to.be.true;
    });
    
});
