import mongoose from "mongoose";

import User from "./models/User";
import Machine from "./models/Machine";
import Production from "./models/Production";
import Maintenance from "./models/Maintenance";
import ERPRecord from "./models/ERPRecord";
import Report from "./models/Report";
import Project from "./models/Project";
import Client from "./models/Client";
import Task from "./models/Task";
import Team from "./models/Team";

export { User, Machine, Production, Maintenance, ERPRecord, Report, Project, Client, Task, Team };

export * from "./models/User";
export * from "./models/Machine";
export * from "./models/Production";
export * from "./models/Maintenance";
export * from "./models/ERPRecord";
export * from "./models/Report";
export * from "./models/Project";
export * from "./models/Client";
export * from "./models/Task";
export * from "./models/Team";

export const connectDB = async (uri: string) => {
    if (mongoose.connection.readyState >= 1) {
        return mongoose.connection;
    }
    return mongoose.connect(uri, {
        family: 4, // Force IPv4 to avoid querySrv ECONNREFUSED issues on Windows Node
        serverSelectionTimeoutMS: 5000
    });
};
