import { DataTypes, Sequelize } from "sequelize";

export interface GuildSettings {
    automod: {
        exemptRoles: string[];
        exemptUsers: string[];
    };
    roles: {
        mute: string | null;
        admin: string | null;
        moderator: string | null;
    };
}

export default (sequelize: Sequelize) => {
    const Guild = sequelize.define("guild", {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        automod: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        roles: {
            type: DataTypes.JSON,
            allowNull: false,
        },
    });

    return Guild;
};

export const DefaultSettings: GuildSettings = {
    automod: {
        exemptRoles: [],
        exemptUsers: [],
    },
    roles: {
        mute: null,
        admin: null,
        moderator: null,
    },
};
