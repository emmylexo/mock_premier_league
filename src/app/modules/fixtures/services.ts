import { ExistsError, NotFoundError, paginate, ValidationError } from "iyasunday";
import { Team } from "../teams/model";
import { createFixtureFunction, deleteFixtureFunction, FixtureInterface, listFixtureFunction, updateFixtureFunction, viewFixtureFunction } from "./interface";
import { Fixture } from "./model";
import { generateString } from "../../utils";
import { deleteRedis, getRedis, updateRedis } from "../../utils/redis";

export const getFixture = async (fixtureId: string) => {
    let fixture: FixtureInterface;
    const fixtures = await getRedis('teams', true);
    if (!fixtures) {
        fixture = await Fixture.findById(fixtureId);
        if (!fixture) throw new NotFoundError(`Fixture with ID not found`);
    } else {
        fixture = fixtures.find((fixture: FixtureInterface) => {
            return fixture._id === fixtureId
        });
    }
    return fixture;
}

export const create: createFixtureFunction = async (userId: string, body) => {

    let fixture = await Fixture.findOne({
        homeTeamId: body.homeTeamId, awayTeamId: body.awayTeamId, matchDate: body.matchDate
    });

    if (fixture) throw new ExistsError('A pending match between this two teams exist');

    if (
        new Date().getTime() >= new Date(body.matchDate).getTime()
    )
        throw new ValidationError("Match date cannot be in the past");


    const homeTeam = await Team.findById(body.homeTeamId).lean();
    const awayTeam = await Team.findById(body.awayTeamId).lean();
    const slug = await generateString(homeTeam.name, awayTeam.name, body.matchDate);
    fixture = await Fixture.create({ ...body, createdBy: userId, slug });

    await updateRedis('fixtures', fixture);
    return {
        success: true,
        message: `Fixture created`,
        data: fixture
    }
}

export const list: listFixtureFunction = async (query) => {
    const { limit, page, status } = query;
    const where: any = {};
    if (status) where.status = status;
    const fixtureCount = await Fixture.count({ ...where });
    const { offset, pageCount } = paginate(fixtureCount, page, limit);

    const fixtures = await Fixture.find({ ...where }).populate({
        path: 'homeTeam awayTeam',
        select: 'name',
    }).limit(limit).skip(offset);

    return {
        success: true,
        message: `Fixtures fetched successfully`,
        data: {
            fixtures,
            page,
            pageCount
        }
    }
}

export const view: viewFixtureFunction = async (fixtureId: string) => {
    const where: any = {}
    fixtureId.indexOf('-') > 0 ? where.slug = fixtureId : where._id = fixtureId;
    const fixture = await Fixture.findOne({
        ...where
    });

    if (!fixture) throw new NotFoundError('Fixture not found');

    return {
        success: true,
        message: `Fixture details fetched succesfully`,
        data: fixture
    }
}

export const update: updateFixtureFunction = async (fixtureId: string, body) => {
    let fixture = await Fixture.findById(fixtureId);

    if (!fixture) throw new NotFoundError('Fixture not found');

    if (body.matchDate && new Date().getTime() >= new Date(body.matchDate).getTime())
        throw new ValidationError("Match date cannot be in the past");

    fixture = await Fixture.findByIdAndUpdate(fixtureId, { $set: { ...body } })

    await updateRedis('fixtures', fixture);
    return {
        success: true,
        message: `Fixture details updated succesfully`,
        data: fixture
    }
}

export const remove: deleteFixtureFunction = async (fixtureId: string) => {
    const fixture = await Fixture.findById(fixtureId);
    if (!fixture) throw new NotFoundError(`Fixture not found`)
    await Fixture.findByIdAndDelete(fixtureId);
    await deleteRedis('fixtures', fixtureId);
    return {
        success: true,
        message: `Fixture deleted successfully`,
        data: []
    }
}