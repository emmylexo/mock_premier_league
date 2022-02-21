import * as chai from 'chai';
import chaiHttp = require('chai-http');
chai.use(chaiHttp);
import { Response } from 'superagent';
import 'mocha';
import app from '../index';
import { request } from 'chai';
import { User } from '../app/modules/users/model';
import { Fixture } from '../app/modules/fixtures/model';
import { UserInterface } from '../app/modules/users/interface';
import { teamData, usersData } from './mockData';
import { Team } from '../app/modules/teams/model';
import { delRedis } from '../app/utils/redis';

const expect = chai.expect;

let createdUser: UserInterface;
let fixtureId: string;
let homeTeamId: string;
let awayTeamId: string;

const adminUser = {
    username: 'testAdmin',
    email: 'testAdmin@gmail.com',
    password: 'Passw0rd!',
    role: 'ADMIN',
    confirmPassword: 'Passw0rd!'
}

var agent = request.agent(app);


describe('Test Fixtures', () => {
    before(async () => {
        await User.deleteMany({});
        // await Fixture.deleteMany({});
        await Team.deleteMany({});
        await delRedis('teams');
        await delRedis('fixtures');
        const res: Response = await agent.post(`/v1/auth/create-user`).send(usersData[0]);
        expect(res).to.have.status(201);
        expect(res).to.be.a('object');
        createdUser = res.body.data;

    });

    it('Should create first team', async () => {
        const res: Response = await agent.post(`/v1/team`).send(teamData[0])
            .set('Authorization', `Bearer ${createdUser.token}`);
        expect(res).to.have.status(201);
        expect(res).to.be.a('object');
        expect(res.body.data).to.haveOwnProperty('_id');
        homeTeamId = res.body.data._id;
    });

    it('Should create second team', async () => {
        const res: Response = await agent.post(`/v1/team`).send(teamData[1])
            .set('Authorization', `Bearer ${createdUser.token}`);
        expect(res).to.have.status(201);
        expect(res).to.be.a('object');
        expect(res.body.data).to.haveOwnProperty('_id');
        awayTeamId = res.body.data._id;
    })

    it('Should create a fixture successfully', async () => {
        const res: Response = await agent.post(`/v1/fixture`).send({ homeTeamId, awayTeamId, matchDate: '2022-02-25T18:01:39.729Z' })
            .set('Authorization', `Bearer ${createdUser.token}`);
        expect(res).to.have.status(201);
        expect(res).to.be.a('object');
        expect(res.body.data).to.haveOwnProperty('_id');
        fixtureId = res.body.data._id;
    });

    it('Should list all fixtures', async () => {
        const res: Response = await agent.get(`/v1/fixtures`)
            .set('Authorization', `Bearer ${createdUser.token}`);
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        expect(res.body.data).to.be.a('object');
        expect(res.body.data.fixtures).to.be.a('array');
        expect(res.body.data.fixtures[0]).to.haveOwnProperty('_id');
    });

    it('Should view a single fixture', async () => {
        const res: Response = await agent.get(`/v1/fixture/${fixtureId}`)
            .set('Authorization', `Bearer ${createdUser.token}`);
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        expect(res.body.data).to.be.a('object');
        expect(res.body.data).to.haveOwnProperty('_id');
    });


    it('Update a single fixture', async () => {
        const res: Response = await agent.patch(`/v1/fixture/${fixtureId}`).send({ status: 'COMPLETED' })
            .set('Authorization', `Bearer ${createdUser.token}`);
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        expect(res.body.data).to.be.a('object');
        expect(res.body.data).to.haveOwnProperty('_id');

    });

    it('Should delete a single fixture', async () => {
        const res: Response = await agent.delete(`/v1/fixture/${fixtureId}`)
            .set('Authorization', `Bearer ${createdUser.token}`);
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        expect(res.body.data).to.be.a('array');
    });
})