import * as chai from 'chai';
import chaiHttp = require('chai-http');
chai.use(chaiHttp);
import { Response } from 'superagent';
import { Team } from '../app/modules/teams/model';
import { UserInterface } from '../app/modules/users/interface';
import 'mocha';
import app from '../index';
import { request } from 'chai';
import { User } from '../app/modules/users/model';
import { TeamInterface } from '../app/modules/teams/interface';
import { delRedis } from '../app/utils/redis';

const expect = chai.expect;

let createdUser: UserInterface;
let teamId: string;
const adminUser = {
    username: 'testAdmin',
    email: 'testAdmin@gmail.com',
    password: 'Passw0rd!',
    role: 'ADMIN',
    confirmPassword: 'Passw0rd!'
}

var agent = request.agent(app);

before(function (done) {
    app.on("appStarted", async function () {
        done();
    });
});


describe('Test teams', () => {
    before(async () => {
        await User.deleteMany({});
        await Team.deleteMany({});
        await delRedis('teams');
        await delRedis('fixtures');
        const res: Response = await agent.post(`/v1/auth/create-user`).send(adminUser);
        expect(res).to.have.status(201);
        expect(res).to.be.a('object');
        createdUser = res.body.data;
        // done()
    });

    it('Should create a team successfully', async () => {
        const res: Response = await agent.post(`/v1/team`).send({ name: 'Barca' })
            .set('Authorization', `Bearer ${createdUser.token}`);
        expect(res).to.have.status(201);
        expect(res).to.be.a('object');
        expect(res.body.data).to.haveOwnProperty('_id');
        teamId = res.body.data._id;
    });

    it('Should list all teams', async () => {
        const res: Response = await agent.get(`/v1/teams`)
            .set('Authorization', `Bearer ${createdUser.token}`);
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        expect(res.body.data).to.be.a('object');
        expect(res.body.data.teams).to.be.a('array');
        expect(res.body.data.teams[0]).to.haveOwnProperty('_id');
    });

    it('Should view a single team', async () => {
        const res: Response = await agent.get(`/v1/team/${teamId}`)
            .set('Authorization', `Bearer ${createdUser.token}`);
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        expect(res.body.data).to.be.a('object');
        expect(res.body.data).to.haveOwnProperty('_id');
    });


    it('Update a single team', async () => {
        const res: Response = await agent.patch(`/v1/team/${teamId}`).send({ name: 'Barcelona' })
            .set('Authorization', `Bearer ${createdUser.token}`);
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        expect(res.body.data).to.be.a('object');
        expect(res.body.data).to.haveOwnProperty('_id');

    });

    it('Should delete a single team', async () => {
        const res: Response = await agent.delete(`/v1/team/${teamId}`)
            .set('Authorization', `Bearer ${createdUser.token}`);
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        expect(res.body.data).to.be.a('array');
    });
})