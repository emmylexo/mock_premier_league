import { ExistsError, NotFoundError, paginate } from "iyasunday";
import { deleteRedis, delRedis, getRedis, setRedisEx, updateRedis } from "../../utils/redis";
import { Fixture } from "../fixtures/model";
import { createTeamFunction, deleteTeamFunction, listTeamFunction, searchFunction, TeamInterface, updateTeamFunction, viewTeamFunction } from "./interface";
import { Team } from "./model";

export const getTeam = async (teamId: string) => {
    let team: TeamInterface;
    const teams = await getRedis('teams', true);
    if (!teams) {
        team = await Team.findById(teamId);
        if (!team) throw new NotFoundError(`Team with ID not found`);
    } else {
        team = teams.find((team: TeamInterface) => {
            return team._id === teamId
        });
    }
    return team;
}

export const create: createTeamFunction = async (userId, body) => {
    try {
        let team = await Team.findOne({ name: body.name }).lean();
        if (team) throw new ExistsError(`Team with name ${body.name} already exists`);

        team = await Team.create({ ...body, createdBy: userId });

        await updateRedis('teams', team);
        return {
            success: true,
            message: `Team created successfuully`,
            data: team
        }
    } catch (error) {
        throw error;
    }
}

export const list: listTeamFunction = async (query) => {
    const { limit, page } = query;
    let teams = await getRedis('teams', true);
    if (!teams) {
        teams = await Team.find({}).lean();
        await setRedisEx('teams', teams, parseInt(process.env.REDIS_TIMEOUT_SECONDS));
    }

    const teamCount = teams.length;
    const { offset, pageCount } = paginate(teamCount, page, limit);

    teams = teams.slice(offset, offset + limit);

    return {
        success: true,
        message: `Teams fetched successfully`,
        data: {
            teams,
            page,
            pageCount
        }
    }
}

export const view: viewTeamFunction = async (teamId: string) => {
    const team = await getTeam(teamId);
    if (!team) throw new NotFoundError(`Team with ID not found`);
    return {
        success: true,
        message: `Team fetched successfully`,
        data: team
    }
}

export const update: updateTeamFunction = async (teamId: string, body) => {
    try {
        let team = await getTeam(teamId);
        if (!team) throw new NotFoundError(`Team with ID not found`);

        team = await Team.findByIdAndUpdate(teamId, { $set: { ...body } }, { returnOriginal: false });
        // UPDATE REDIS VALUE
        await updateRedis('teams', team);
        return {
            success: true,
            message: `Team updated successfully`,
            data: team
        }
    } catch (error) {
        throw error;
    }

}

export const remove: deleteTeamFunction = async (teamId: string) => {
    const team = await getTeam(teamId);
    if (!team) throw new NotFoundError(`Team with ID not found`);
    await Team.findByIdAndDelete(teamId);
    await deleteRedis('teams', teamId);
    return {
        success: true,
        message: `Team deleted successfully`,
        data: []
    }
}

export const search: searchFunction = async (query) => {
    const { phrase, limit, page, status = null } = query;

    const where: any = {};

    const teamCount = await Team.find({ name: { $regex: `.*${phrase}.*` } }).count();

    const { offset, pageCount } = paginate(teamCount, page, limit);

    const teams = await Team.find({ name: { $regex: `.*${phrase}.*` } }).limit(limit).skip(offset);

    where.slug = { $regex: `.*${phrase}.*` };
    if (status) where.status = status.toUpperCase();

    const fixtures = await Fixture.find({ ...where }).limit(limit).skip(offset);

    return {
        success: true,
        message: `Successfully retrieved result`,
        data: {
            teams,
            fixtures
        }
    }
}